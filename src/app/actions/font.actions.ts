import config from '../../config/functions.config.json5';
import fontConfig from '../../config/fonts.config.json5';
import {
  acePruneFuncs,
  editLoop,
  editLoopComputed,
  getParents,
} from './ace.actions';
import {apiSendEvent} from './api.actions';
import {
  fxFontColourToggle,
  fxFontColourChange,
  fxFontFamilyToggle,
  fxFontLetterSpacingToggle,
  fxFontLineSpacingToggle,
  fxFontSizingDisable,
  fxFontLineSpacingChange,
  fxFontLetterSpacingChange,
  fxFontToggleCurrent,
} from '../fx/font.fx';

/**
 * Fetches and returns parents of text nodes in the document
 */

function fontDecSize(state: Ace.State) {
  const {fontSizing}: {fontSizing: Ace.FuncConfig} = config;

  editLoopComputed(fontSizing, 'fontSize', -1);

  apiSendEvent('AceFontSizeDec');

  return {
    ...state,
    fontSizingActive: true,
    fontSizingRelative: state.fontSizingRelative - 1,
  };
}

function fontSizingDisable(state: Ace.State) {
  return [
    {
      ...state,
      fontSizingActive: false,
    },
    fxFontSizingDisable(state),
  ];
}

function fontIncSize(state: Ace.State) {
  const {fontSizing}: {fontSizing: Ace.FuncConfig} = config;

  editLoopComputed(fontSizing, 'fontSize', 1);

  apiSendEvent('AceFontSizeInc');

  return {
    ...state,
    fontSizingActive: true,
    fontSizingRelative: state.fontSizingRelative + 1,
  };
}

function fontHydrateSize(state: Ace.State) {
  const {fontSizingRelative} = state;
  const {fontSizing}: {fontSizing: Ace.FuncConfig} = config;

  editLoopComputed(fontSizing, 'fontSize', fontSizingRelative);

  return {
    ...state,
    fontSizingActive: true,
  };
}

function fontFamilyToggle(state: Ace.State) {
  const newState = {
    ...state,
    fontActive: !state.fontActive,
  };

  newState.fontActive && apiSendEvent('AceFontType_On');
  return [newState, fxFontFamilyToggle(newState)];
}

function fontFamilyReset(state: Ace.State) {
  fontReset(state, 'fontFamily');
  return state;
}

function fontChangeFamilyAll(state: Ace.State, key?: string) {
  const {fontCurrentKey} = state;
  const currentKey: string = key || fontCurrentKey;

  if (currentKey.length <= 0) {
    return state;
  }

  const currentFontFamily = fontConfig[currentKey]?.family;
  const {fontFamily}: {fontFamily: Ace.FuncConfig} = config;

  editLoop(fontFamily, 'fontFamily', currentFontFamily);

  return state;
}

function fontColourChangeSingle(state: Ace.State, colour: string) {
  return [
    {
      ...state,
      fontColourCurrent: colour,
      fontCustomActive: false,
    },
    fxFontColourChange(state, colour),
  ];
}

function fontColourChangeCustom(state: Ace.State, colour: string) {
  return [
    {
      ...state,
      fontColourCurrent: colour,
      fontColourCustomCurrent: colour,
      fontCustomActive: true,
    },
    fxFontColourChange(state, colour),
  ];
}

function fontColourChange(state: Ace.State, colour?: string) {
  const {fontColourCurrent} = state;
  const currentColour: string = colour || fontColourCurrent;

  if (currentColour.length <= 0) {
    return state;
  }

  const {fontColour}: {fontColour: Ace.FuncConfig} = config;

  editLoop(fontColour, 'color', currentColour);

  return state;
}

function fontColourToggle(state: Ace.State) {
  const newState = {
    ...state,
    fontColourActive: !state.fontColourActive,
  };

  newState.fontColourActive && apiSendEvent('AceFontColour_On');
  return [newState, fxFontColourToggle(newState)];
}

function fontColourReset(state: Ace.State) {
  fontReset(state, 'fontColour');
  return state;
}

function fontReset(state: Ace.State, configKey: string) {
  const parentElements = getParents();
  const configObj: Ace.FuncConfig = config[configKey];

  for (const el of parentElements) {
    const aceEdited = el.getAttribute('ace-edited');

    if (!aceEdited) {
      continue;
    }

    const orig = el.getAttribute(configObj.attrNames.orig);

    if (!orig) {
      continue;
    }

    if (orig === 'none') {
      el.style.setProperty(configObj.editName, null);
    } else {
      el.style.setProperty(configObj.editName, orig);
    }

    acePruneFuncs(el, aceEdited, configObj);
    el.removeAttribute(configObj.attrNames.orig);

    if (configObj.attrNames.origComputed) {
      el.removeAttribute(configObj.attrNames.origComputed);
    }
  }

  return state;
}

function fontLineSpacingToggle(state: Ace.State) {
  const newState = {
    ...state,
    fontLineSpacingActive: !state.fontLineSpacingActive,
  };

  newState.fontLineSpacingActive && apiSendEvent('AceFontLineSpacing_On');
  return [newState, fxFontLineSpacingToggle(newState)];
}

function fontLineSpacingIncrement(state: Ace.State) {
  const {fontLineSpacingCount, fontLineSpacingStep, fontLineSpacingMax} = state;
  const nextCount = fontLineSpacingCount + fontLineSpacingStep;

  if (Math.abs(nextCount) > fontLineSpacingMax) {
    return state;
  }

  return [
    {
      ...state,
      fontLineSpacingCount: nextCount,
    },
    fxFontLineSpacingChange(state, nextCount),
  ];
}

function fontLineSpacingDecrement(state: Ace.State) {
  const {fontLineSpacingCount, fontLineSpacingStep, fontLineSpacingMax} = state;
  const nextCount = fontLineSpacingCount - fontLineSpacingStep;

  if (Math.abs(nextCount) > fontLineSpacingMax) {
    return state;
  }

  return [
    {
      ...state,
      fontLineSpacingCount: nextCount,
    },
    fxFontLineSpacingChange(state, nextCount),
  ];
}

function fontLineSpacingChange(state: Ace.State, count?: number) {
  const {fontLineSpacingCount, fontLineSpacingStep} = state;
  const currentCount = count || fontLineSpacingCount;

  const {fontLineSpacing}: {fontLineSpacing: Ace.FuncConfig} = config;

  editLoopComputed(
    fontLineSpacing,
    'lineHeight',
    currentCount,
    fontLineSpacingStep
  );

  return state;
}

function fontLineSpacingReset(state: Ace.State) {
  fontReset(state, 'fontLineSpacing');
  return state;
}

function fontLetterSpacingToggle(state: Ace.State) {
  const newState = {
    ...state,
    fontLetterSpacingActive: !state.fontLetterSpacingActive,
  };

  newState.fontLetterSpacingActive && apiSendEvent('AceFontLetterSpacing_On');
  return [newState, fxFontLetterSpacingToggle(newState)];
}

function fontLetterSpacingIncrement(state: Ace.State) {
  const {
    fontLetterSpacingStep,
    fontLetterSpacingCount,
    fontLetterSpacingMax,
  } = state;
  const nextCount = fontLetterSpacingCount + fontLetterSpacingStep;

  if (Math.abs(nextCount) > fontLetterSpacingMax) {
    return state;
  }

  return [
    {
      ...state,
      fontLetterSpacingCount: nextCount,
    },
    fxFontLetterSpacingChange(state, nextCount),
  ];
}

function fontLetterSpacingDecrement(state: Ace.State) {
  const {
    fontLetterSpacingCount,
    fontLetterSpacingStep,
    fontLetterSpacingMax,
  } = state;
  const nextCount = fontLetterSpacingCount - fontLetterSpacingStep;

  if (Math.abs(nextCount) > fontLetterSpacingMax) {
    return state;
  }

  return [
    {
      ...state,
      fontLetterSpacingCount: nextCount,
    },
    fxFontLetterSpacingChange(state, nextCount),
  ];
}

function fontLetterSpacingChange(state: Ace.State, count: number) {
  const {fontLetterSpacingCount, fontLetterSpacingStep} = state;
  const currentCount = count || fontLetterSpacingCount;

  const {fontLetterSpacing}: {fontLetterSpacing: Ace.FuncConfig} = config;

  editLoopComputed(
    fontLetterSpacing,
    'letterSpacing',
    currentCount,
    fontLetterSpacingStep
  );

  return state;
}

function fontLetterSpacingReset(state: Ace.State) {
  fontReset(state, 'fontLetterSpacing');

  return state;
}

function fontToggleList(state: Ace.State) {
  return {
    ...state,
    selectFontListActive: !state.selectFontListActive,
  };
}

function fontToggleCurrent(state: Ace.State, key: string) {
  return [
    {
      ...state,
      fontCurrentKey: key,
      selectFontListActive: false,
    },
    fxFontToggleCurrent(state, key),
  ];
}

export {
  fontDecSize,
  fontIncSize,
  fontSizingDisable,
  fontColourToggle,
  fontColourChange,
  fontColourChangeSingle,
  fontColourChangeCustom,
  fontColourReset,
  fontChangeFamilyAll,
  fontFamilyReset,
  fontFamilyToggle,
  fontLetterSpacingChange,
  fontLetterSpacingDecrement,
  fontLetterSpacingToggle,
  fontLetterSpacingIncrement,
  fontLetterSpacingReset,
  fontLineSpacingIncrement,
  fontLineSpacingChange,
  fontLineSpacingDecrement,
  fontLineSpacingReset,
  fontLineSpacingToggle,
  fontReset,
  fontToggleList,
  fontToggleCurrent,
  fontHydrateSize,
};
