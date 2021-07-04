import BigNumber from 'bignumber.js';
import {apiSendEvent} from './api.actions';

function maskToggle(state: Ace.State) {
  if (!state.maskActive) {
    apiSendEvent('AceScreenMask_On');
  }

  return {
    ...state,
    maskActive: !state.maskActive,
  };
}

function maskEnable(state: Ace.State) {
  apiSendEvent('AceScreenMask_On');

  return {
    ...state,
    maskActive: true,
  };
}

function maskChangeColour(state: Ace.State, colour?: string) {
  const {maskColourCurrent} = state;
  const currentColour: string = colour || maskColourCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  return {
    ...state,
    maskColourCurrent: colour,
    maskCustomActive: false,
  };
}

function maskChangeColourCustom(state: Ace.State, colour: string) {
  const {maskColourCustomCurrent} = state;
  const currentColour: string = colour || maskColourCustomCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  return {
    ...state,
    maskColourCurrent: colour,
    maskColourCustomCurrent: colour,
    maskCustomActive: true,
  };
}

function maskDecreaseOpacity(state: Ace.State) {
  const {maskOpacity, maskOpacityStep, maskOpacityMin} = state;
  const newOpacity = new BigNumber(maskOpacity).minus(maskOpacityStep);

  if (newOpacity.isLessThan(maskOpacityMin)) {
    return state;
  }

  return {
    ...state,
    maskOpacity: newOpacity.toString(),
  };
}

function maskIncreaseOpacity(state: Ace.State) {
  const {maskOpacity, maskOpacityStep, maskOpacityMax} = state;
  const newOpacity = new BigNumber(maskOpacity).plus(maskOpacityStep);

  if (newOpacity.isGreaterThan(maskOpacityMax)) {
    return state;
  }

  return {
    ...state,
    maskOpacity: newOpacity.toString(),
  };
}

export {
  maskChangeColourCustom,
  maskChangeColour,
  maskDecreaseOpacity,
  maskIncreaseOpacity,
  maskToggle,
  maskEnable,
};
