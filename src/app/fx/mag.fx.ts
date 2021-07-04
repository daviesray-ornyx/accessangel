import {magAddPageContent, magMove, magScroll} from '../actions/mag.actions';
import {fxDragStartMouseEvents, fxDragStopMouseEvents} from './drag.fx';

function fxMagAddPageContent(state: Ace.State) {
  return (
    state.magActive && [
      (dispatch, props) => {
        dispatch(props.action);
      },
      {
        action: magAddPageContent,
      },
    ]
  );
}

function fxMagResetState(state: Ace.State) {
  const bar =
    window?.aceRuntimeProxy?.mainElement &&
    window.aceRuntimeProxy.mainElement.querySelector('ab-inner-bar');
  return (
    !state.magActive && [
      (dispatch, props) => {
        dispatch(props.action);
      },
      {
        action: state => ({
          ...state,
          magPageContent: '',
          magPosX: window.innerHeight / 4,
          magPosY:
            (bar &&
              bar.getBoundingClientRect().height + window.innerHeight / 4) ||
            0,
          magInitialX: 0,
          magInitialY: 0,
          magOffsetX: window.innerHeight / 4,
          magOffsetY:
            (bar &&
              bar.getBoundingClientRect().height + window.innerHeight / 4) ||
            0,
        }),
      },
    ]
  );
}

function fxMagDragEvents(state: Ace.State) {
  return state.magCanDrag
    ? [fxDragStartMouseEvents(state), fxMagMoveStart()]
    : [fxDragStopMouseEvents(state), fxMagMoveStop()];
}

const magMoveHandle: unknown[] = [];
const magMovePassthrough = (dispatch, props) => {
  magMoveHandle.length < 1 && magMoveHandle.push(() => dispatch(props.action));

  return magMoveHandle[0];
};

function fxMagMoveStart() {
  return [
    (dispatch, props) => {
      document.addEventListener(
        'mousemove',
        magMovePassthrough(dispatch, props)
      );
      document.addEventListener(
        'touchmove',
        magMovePassthrough(dispatch, props)
      );
    },
    {
      action: magMove,
    },
  ];
}

function fxMagMoveStop() {
  return [
    (dispatch, props) => {
      document.removeEventListener('mousemove', props.action);
      document.removeEventListener('touchmove', props.action);
      magMoveHandle.pop();
    },
    {
      action: magMoveHandle[0],
    },
  ];
}

function fxMagScrollEvents(state: Ace.State) {
  return state.magActive ? fxMagScrollStart() : fxMagScrollStop();
}

const magScrollHandle: unknown[] = [];
const magScrollPassthrough = (dispatch, props) => {
  magScrollHandle.length < 1 &&
    magScrollHandle.push(() => dispatch(props.action));

  return magScrollHandle[0];
};

function fxMagScrollStart() {
  return [
    (dispatch, props) => {
      window.addEventListener('scroll', magScrollPassthrough(dispatch, props));
    },
    {
      action: magScroll,
    },
  ];
}

function fxMagScrollStop() {
  return [
    (dispatch, props) => {
      window.removeEventListener('scroll', props.action);
      magScrollHandle.pop();
    },
    {
      action: magScrollHandle[0],
    },
  ];
}

export {
  fxMagAddPageContent,
  fxMagResetState,
  fxMagDragEvents,
  fxMagScrollEvents,
  fxMagMoveStop,
};
