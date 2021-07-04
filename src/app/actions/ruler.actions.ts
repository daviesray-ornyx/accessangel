import BigNumber from 'bignumber.js';
import {apiSendEvent} from './api.actions';
import {fxRulerPinholeEvents, fxRulerReadingEvents} from '../fx/ruler.fx';

interface DragEvent extends MouseEvent, TouchEvent {}

function rulerReadingToggle(state: Ace.State) {
  const newState = {
    ...state,
    rulerReadingActive: !state.rulerReadingActive,
    rulerPinholeActive: false,
  };

  newState.rulerReadingActive && apiSendEvent('AceRulerReading_On');

  return [newState, fxRulerReadingEvents(newState)];
}

function rulerReadingEnable(state: Ace.State) {
  const newState = {
    ...state,
    rulerReadingActive: true,
    rulerPinholeActive: false,
  };

  apiSendEvent('AceRulerReading_On');

  return [newState, fxRulerReadingEvents(newState)];
}

function rulerPinholeToggle(state: Ace.State) {
  const newState = {
    ...state,
    rulerPinholeActive: !state.rulerPinholeActive,
    rulerReadingActive: false,
  };

  newState.rulerPinholeActive && apiSendEvent('AceRulerPinhole_On');

  return [newState, fxRulerPinholeEvents(newState)];
}

function rulerMove(state: Ace.State) {
  const {dragMouseX, dragMouseY} = state;

  return {
    ...state,
    rulerPosX: dragMouseX,
    rulerPosY: dragMouseY,
  };
}

function rulerReadingOpacityInc(state: Ace.State) {
  const {
    rulerReadingOpacity,
    rulerReadingOpacityStep,
    rulerReadingOpacityMax,
  } = state;
  const newOpacity = new BigNumber(rulerReadingOpacity).plus(
    rulerReadingOpacityStep
  );

  if (newOpacity.isGreaterThan(rulerReadingOpacityMax)) {
    return state;
  }

  return {
    ...state,
    rulerReadingOpacity: newOpacity.toString(),
  };
}

function rulerReadingOpacityDec(state: Ace.State) {
  const {
    rulerReadingOpacity,
    rulerReadingOpacityStep,
    rulerReadingOpacityMin,
  } = state;
  const newOpacity = new BigNumber(rulerReadingOpacity).minus(
    rulerReadingOpacityStep
  );

  if (newOpacity.isLessThan(rulerReadingOpacityMin)) {
    return state;
  }

  return {
    ...state,
    rulerReadingOpacity: newOpacity.toString(),
  };
}

function rulerSizeDecrease(state: Ace.State) {
  const {rulerHeight, rulerHeightMin, rulerHeightStep} = state;
  const newHeight = new BigNumber(rulerHeight).minus(rulerHeightStep);

  if (newHeight.isLessThan(rulerHeightMin)) {
    return state;
  }

  return {
    ...state,
    rulerHeight: newHeight.toString(),
  };
}

function rulerSizeIncrease(state: Ace.State) {
  const {rulerHeight, rulerHeightMax, rulerHeightStep} = state;
  const newHeight = new BigNumber(rulerHeight).plus(rulerHeightStep);

  if (newHeight.isGreaterThan(rulerHeightMax)) {
    return state;
  }

  return {
    ...state,
    rulerHeight: newHeight.toString(),
  };
}

function rulerPinholeOpacityInc(state: Ace.State) {
  const {
    rulerPinholeOpacity,
    rulerPinholeOpacityStep,
    rulerPinholeOpacityMax,
  } = state;
  const newOpacity = new BigNumber(rulerPinholeOpacity).plus(
    rulerPinholeOpacityStep
  );

  if (newOpacity.isGreaterThan(rulerPinholeOpacityMax)) {
    return state;
  }

  return {
    ...state,
    rulerPinholeOpacity: newOpacity.toString(),
  };
}

function rulerPinholeOpacityDec(state: Ace.State) {
  const {
    rulerPinholeOpacity,
    rulerPinholeOpacityStep,
    rulerPinholeOpacityMin,
  } = state;
  const newOpacity = new BigNumber(rulerPinholeOpacity).minus(
    rulerPinholeOpacityStep
  );

  if (newOpacity.isLessThan(rulerPinholeOpacityMin)) {
    return state;
  }

  return {
    ...state,
    rulerPinholeOpacity: newOpacity.toString(),
  };
}

function rulerPinholeSizeInc(state: Ace.State) {
  const {
    rulerPinholeCentreHeight,
    rulerPinholeCentreHeightStep,
    rulerPinholeCentreHeightMax,
  } = state;
  const newSize = rulerPinholeCentreHeight + rulerPinholeCentreHeightStep;

  if (newSize > rulerPinholeCentreHeightMax) {
    return state;
  }

  return {
    ...state,
    rulerPinholeCentreHeight: newSize,
  };
}

function rulerPinholeSizeDec(state: Ace.State) {
  const {
    rulerPinholeCentreHeight,
    rulerPinholeCentreHeightStep,
    rulerPinholeCentreHeightMin,
  } = state;
  const newSize = rulerPinholeCentreHeight - rulerPinholeCentreHeightStep;

  if (newSize < rulerPinholeCentreHeightMin) {
    return state;
  }

  return {
    ...state,
    rulerPinholeCentreHeight: newSize,
  };
}

function rulerChangePinholeMaskColour(state: Ace.State, colour: string) {
  const {rulerPinholeMaskColourCurrent} = state;
  const currentColour: string = colour || rulerPinholeMaskColourCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  return {
    ...state,
    rulerPinholeMaskColourCurrent: colour,
    rulerPinholeMaskCustomActive: false,
  };
}

function rulerChangePinholeMaskCustomColour(state: Ace.State, colour: string) {
  const {rulerPinholeMaskColourCurrent} = state;
  const currentColour: string = colour || rulerPinholeMaskColourCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  return {
    ...state,
    rulerPinholeMaskColourCurrent: colour,
    rulerPinholeMaskColourCustomCurrent: colour,
    rulerPinholeMaskCustomActive: true,
  };
}

function rulerChangeReadingColour(state: Ace.State, colour: string) {
  const {rulerReadingColourCurrent} = state;
  const currentColour: string = colour || rulerReadingColourCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  return {
    ...state,
    rulerReadingColourCurrent: colour,
    rulerReadingCustomColourActive: false,
  };
}

function rulerChangeReadingCustomColour(state: Ace.State, colour: string) {
  const {rulerReadingCustomColourCurrent} = state;
  const currentColour: string = colour || rulerReadingCustomColourCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  return {
    ...state,
    rulerReadingColourCurrent: colour,
    rulerReadingCustomColourCurrent: colour,
    rulerReadingCustomColourActive: true,
  };
}

export {
  rulerReadingToggle,
  rulerReadingEnable,
  rulerMove,
  rulerPinholeOpacityDec,
  rulerPinholeOpacityInc,
  rulerPinholeSizeDec,
  rulerPinholeSizeInc,
  rulerPinholeToggle,
  rulerReadingOpacityDec,
  rulerReadingOpacityInc,
  rulerSizeDecrease,
  rulerSizeIncrease,
  rulerChangePinholeMaskColour,
  rulerChangePinholeMaskCustomColour,
  rulerChangeReadingColour,
  rulerChangeReadingCustomColour,
};
