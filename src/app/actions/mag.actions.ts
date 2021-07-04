import BigNumber from 'bignumber.js';
import {apiSendEvent} from './api.actions';
import {
  fxMagAddPageContent,
  fxMagDragEvents,
  fxMagResetState,
  fxMagScrollEvents,
} from '../fx/mag.fx';
import {
  fxDragStartMouseEvents,
  fxDragStopMouseEvents,
  fxDragStop,
} from '../fx/drag.fx';

function getScrollOffsets() {
  const doc = document,
    w = window;
  let x, y, docEl;

  if (typeof w.pageYOffset === 'number') {
    x = w.pageXOffset;
    y = w.pageYOffset;
  } else {
    docEl =
      doc.compatMode && doc.compatMode === 'CSS1Compat'
        ? doc.documentElement
        : doc.body;
    x = docEl.scrollLeft;
    y = docEl.scrollTop;
  }
  return {x: x, y: y};
}

function magScaleIncrease(state: Ace.State) {
  const {magScale, magScaleMax, magScaleStep} = state;
  const pScale = new BigNumber(magScale);

  if (pScale.plus(magScaleStep).gt(magScaleMax)) {
    return state;
  }

  const pScaleAdd = pScale.plus(magScaleStep).toFixed(1);

  return {
    ...state,
    magScale: pScaleAdd,
  };
}

function magScaleDecrease(state: Ace.State) {
  const {magScale, magScaleMin, magScaleStep} = state;
  const pScale = new BigNumber(magScale);

  if (pScale.minus(magScaleStep).lt(magScaleMin)) {
    return state;
  }

  const pScaleSub = pScale.minus(magScaleStep).toFixed(1);

  return {
    ...state,
    magScale: pScaleSub,
  };
}

function magWidthIncrease(state: Ace.State) {
  const {magWidthOffset, magWidth, magSizeChangeStep} = state;
  const currentPercentage = new BigNumber(magWidth)
    .dividedBy(window.innerWidth)
    .decimalPlaces(2)
    .toNumber();
  const newPercentage = currentPercentage + magSizeChangeStep;
  const newWidth = new BigNumber(window.innerWidth)
    .times(newPercentage)
    .decimalPlaces(0);

  if (newWidth.isGreaterThan(window.innerWidth - magWidthOffset)) {
    return state;
  }

  return {
    ...state,
    magWidth: newWidth.toString(),
  };
}

function magWidthDecrease(state: Ace.State) {
  const {magWidth, magSizeChangeStep, magWidthMin} = state;
  const currentPercentage = new BigNumber(magWidth)
    .dividedBy(window.innerWidth)
    .decimalPlaces(2)
    .toNumber();
  const newPercentage = currentPercentage - magSizeChangeStep;
  const newWidth = new BigNumber(window.innerWidth)
    .times(newPercentage)
    .decimalPlaces(0);

  if (newWidth.isLessThan(magWidthMin)) {
    return state;
  }

  return {
    ...state,
    magWidth: newWidth.toString(),
  };
}

function magHeightDecrease(state: Ace.State) {
  const {magHeight, magSizeChangeStep, magHeightMin} = state;
  const currentPercentage = new BigNumber(magHeight)
    .dividedBy(window.innerHeight)
    .decimalPlaces(2)
    .toNumber();
  const newPercentage = currentPercentage - magSizeChangeStep;
  const newHeight = new BigNumber(window.innerHeight)
    .times(newPercentage)
    .decimalPlaces(0);

  if (newHeight.isLessThan(magHeightMin)) {
    return state;
  }

  return {
    ...state,
    magHeight: newHeight.toString(),
  };
}

function magHeightIncrease(state: Ace.State) {
  const {magHeight, magSizeChangeStep, magHeightOffset} = state;
  const currentPercentage = new BigNumber(magHeight)
    .dividedBy(window.innerHeight)
    .decimalPlaces(2)
    .toNumber();
  const newPercentage = currentPercentage + magSizeChangeStep;
  const newHeight = new BigNumber(window.innerHeight)
    .times(newPercentage)
    .decimalPlaces(0);

  if (newHeight.isGreaterThan(window.innerHeight - magHeightOffset)) {
    return state;
  }

  return {
    ...state,
    magHeight: newHeight.toString(),
  };
}

function magMove(state: Ace.State) {
  const {
    magCanDrag,
    magInitialX,
    magInitialY,
    dragMouseX,
    dragMouseY,
    magScale,
    magBorder,
  } = state;

  if (!window.aceRuntimeProxy.mainElement || !magCanDrag) {
    return state;
  }

  const mag = window.aceRuntimeProxy.mainElement.querySelector(
    '#ab-magnifier-window'
  );
  const magPage = window.aceRuntimeProxy.mainElement.querySelector(
    '#ab-magnifier-page'
  );

  if (
    !mag ||
    !magPage ||
    !(magPage instanceof HTMLIFrameElement) ||
    !magPage.contentDocument
  ) {
    return state;
  }

  const rect = mag.getBoundingClientRect();
  const windowWidth = window.innerWidth - rect.width;
  const windowHeight = window.innerHeight - rect.height;
  let x = dragMouseX - magInitialX;
  let y = dragMouseY - magInitialY;

  if (x < 0) {
    x = 0;
  }

  if (x > windowWidth) {
    x = windowWidth;
  }

  if (y < 0) {
    y = 0;
  }

  if (y > windowHeight) {
    y = windowHeight;
  }

  // Anchor the position of the iframe to the top left corner of body
  const fixedX = -(x + magBorder);
  const fixedY = -(y + magBorder);

  const pScale = new BigNumber(magScale);

  // Get the distance between the middle point of the magnifier on the normal page and scaled page
  const pointX = x + rect.width / 2;
  const scaledPointX = pScale.times(pointX);
  const distanceX = scaledPointX.minus(pointX).toNumber();

  const pointY = y + rect.height / 2;
  const scaledPointY = pScale.times(pointY);
  const distanceY = scaledPointY.minus(pointY).toNumber();

  let pushMargin = false;

  if (pointY < rect.height * 0.6) {
    pushMargin = true;
    magPage.contentDocument.body.style.marginTop = `${rect.height / 4}px`;
  }

  if (pointX < rect.width * 0.6) {
    pushMargin = true;
    magPage.contentDocument.body.style.marginLeft = `${rect.width / 4}px`;
  }

  if (pointY > windowHeight + rect.height * 0.4) {
    pushMargin = true;
    magPage.contentDocument.body.style.marginBottom = `${rect.height / 4}px`;
  }

  if (pointX > windowWidth + rect.width * 0.4) {
    pushMargin = true;
    magPage.contentDocument.body.style.marginRight = `${rect.width / 4}px`;
  }

  if (!pushMargin) {
    magPage.contentDocument.body.style.marginTop = '0';
    magPage.contentDocument.body.style.marginRight = '0';
    magPage.contentDocument.body.style.marginBottom = '0';
    magPage.contentDocument.body.style.marginLeft = '0';
  }

  return {
    ...state,
    magPosX: x,
    magPosY: y,
    magOffsetX: x,
    magOffsetY: y,
    magPageX: fixedX,
    magPageY: fixedY,
    magTranslateX: -distanceX,
    magTranslateY: -distanceY,
  };
}

function magScroll(state: Ace.State) {
  const {magScale} = state;
  // We already know that this is a scroll event. Magnifier window does not move from it's current position, except for the back window being magnified
  // ab-icon will be used to position clientX and clientY
  const scrollOffsets = getScrollOffsets();

  if (!window.aceRuntimeProxy.mainElement) {
    return state;
  }

  const magPage = window.aceRuntimeProxy.mainElement.querySelector(
    '#ab-magnifier-page'
  ) as HTMLIFrameElement;

  if (!magPage || !magPage.contentWindow) {
    return state;
  }

  // convert string to BigNumber
  const pixelScaling = parseInt(magScale) || 1;
  // Ensure that scaling is taken into consideration
  magPage.contentWindow.scrollTo(
    scrollOffsets.x * pixelScaling,
    scrollOffsets.y * pixelScaling
  );
  return state;
}

function magUpdatePosition(state: Ace.State) {
  const {magScale, magPosX, magPosY} = state;
  const magEl = document.getElementById('ab-magnifier-window');

  if (!window.aceRuntimeProxy.mainElement) {
    return state;
  }

  const magPage = window.aceRuntimeProxy.mainElement.querySelector(
    '#ab-magnifier-page'
  );

  if (
    !magEl ||
    !magPage ||
    !(magPage instanceof HTMLIFrameElement) ||
    !magPage.contentDocument
  ) {
    return state;
  }

  const elRect = magEl.getBoundingClientRect();
  const pScale = new BigNumber(magScale);

  const pointX = magPosX + elRect.width / 2;
  const scaledPointX = pScale.times(pointX);
  const distanceX = scaledPointX.minus(pointX).toNumber();

  const pointY = magPosY + elRect.height / 2;
  const scaledPointY = pScale.times(pointY);
  const distanceY = scaledPointY.minus(pointY).toNumber();

  return {
    ...state,
    magTranslateX: -distanceX,
    magTranslateY: -distanceY,
  };
}

function magAddPageContent(state: Ace.State) {
  let pageContent = document.documentElement.outerHTML;
  const aceMagEl = /<ab-mag-page-container.*<\/ab-mag-page-container>/gis;
  const aceEl = /<ace-app.*<\/ace-app>/gi;
  const aceScripts = /<script.*src=.*(accessabar|ace).*<\/script>/gi;

  pageContent = pageContent.replace(aceMagEl, '');
  pageContent = pageContent.replace(aceEl, '');
  pageContent = pageContent.replace(aceScripts, '');

  return {
    ...state,
    magPageContent: pageContent,
  };
}

function magToggle(state: Ace.State) {
  const newState = {
    ...state,
    magActive: !state.magActive,
  };

  newState.magActive && apiSendEvent('AceMagnifier_On');

  return [
    newState,
    [
      newState.magActive && fxMagAddPageContent(newState),
      fxMagResetState(newState),
      fxMagScrollEvents(newState),
    ],
  ];
}

function magEnable(state: Ace.State) {
  const newState = {
    ...state,
    magActive: true,
  };

  apiSendEvent('AceMagnifier_On');

  return [
    newState,
    [
      newState.magActive && fxMagAddPageContent(newState),
      fxMagResetState(newState),
      fxMagScrollEvents(newState),
    ],
  ];
}

function magUpdateSize(state) {
  if (!window.aceRuntimeProxy.mainElement) {
    return state;
  }

  const mag = window.aceRuntimeProxy.mainElement.querySelector(
    '#ab-magnifier-window'
  ) as HTMLElement;

  if (!mag || !document.defaultView) {
    return state;
  }

  const newWidth = parseInt(
    document.defaultView.getComputedStyle(mag).width,
    10
  );
  const newHeight = parseInt(
    document.defaultView.getComputedStyle(mag).height,
    10
  );
  return {
    ...state,
    magWidth: newWidth,
    magHeight: newHeight,
  };
}

function magStartDrag(state: Ace.State, event: Ace.DragEvent) {
  event.preventDefault();
  const {magOffsetX, magOffsetY} = state;
  const ev = event.touches ? event.touches[0] : event;
  const {clientX, clientY} = ev;

  const newState = {
    ...state,
    magCanDrag: true,
    magInitialX: clientX - magOffsetX,
    magInitialY: clientY - magOffsetY,
  };

  return [newState, [fxMagDragEvents(newState)]];
}

function magEndDrag(state: Ace.State) {
  const newState = {
    ...state,
    magCanDrag: false,
  };

  return [newState, fxMagDragEvents(newState)];
}

function magResetAll(state: Ace.State) {
  const newState = {
    ...state,
    magActive: false,
    magCanDrag: false,
  };

  apiSendEvent('AceMagnifier_Off');
  return [newState];
}

export {
  magScaleIncrease,
  magScaleDecrease,
  magMove,
  magScroll,
  magAddPageContent,
  magHeightDecrease,
  magHeightIncrease,
  magStartDrag,
  magEndDrag,
  magToggle,
  magEnable,
  magUpdatePosition,
  magUpdateSize,
  magWidthDecrease,
  magWidthIncrease,
  getScrollOffsets,
  magResetAll,
};
