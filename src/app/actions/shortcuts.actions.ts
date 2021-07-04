/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import fontConfig from '../../config/fonts.config.json5';
import {
  fxDragStartMouseEvents,
  fxDragStopMouseEvents,
  fxDragStop,
} from '../fx/drag.fx';

import {
  fxTTSEnable,
  fxTTSStopAll,
  fxTTSHandleHighlight,
  fxFontFamilyChange,
  fxFontSizeIncrease,
  fxFontSizeDecrease,
  fxFontColorChange,
  fxFontLineSpacingInc,
  fxFontLineSpacingDec,
  fxFontLetterSpacingInc,
  fxFontLetterSpacingDec,
  fxMagShow,
  fxMaskShow,
  fxRulerShow,
  fxRulerSizeIncrease,
  fxRulerSizeDecrease,
  fxPinholeShow,
  fxPinholeColorChange,
  fxPinholeSizeIncrease,
  fxPinholeSizeDecrease,
  fxSREnable,
  fxMenuOpen,
  fxMenuClose,
} from '../fx/shortcuts.fx';

function isModifierKey(event: KeyboardEvent) {
  return (
    event.key === 'Alt' ||
    event.key === 'Option' ||
    event.key === 'Control' ||
    event.key === 'Shift'
  );
}

function concatWithSeparator(list: string[], separator: string) {
  let concatString = '';
  list.forEach(element => {
    concatString =
      concatString +
      (concatString.length > 0 && element.length > 0 ? separator : '') +
      element;
  });
  return concatString;
}

function buildModifierKeys(event: KeyboardEvent) {
  const altKey = event.altKey ? 'alt' : '';
  const ctrlKey = event.ctrlKey ? 'ctrl' : '';
  const shiftKey = event.shiftKey ? 'shift' : '';
  return concatWithSeparator([altKey, ctrlKey, shiftKey], ',');
}

function buildKeyCombination(state: Ace.State, eventData: KeyboardEvent) {
  //eventData.preventDefault(); // prevent default action
  if (!state.kbsReady) {
    return state;
  }

  if (eventData.type === 'keydown') {
    if (isModifierKey(eventData)) {
      return state;
    }

    if (eventData.repeat) {
      return state;
    }

    const keyToAdd = eventData.key === ',' ? '@' : eventData.key.toLowerCase();

    const newKbsKeyCombination =
      state.kbsKeyCombination +
      (state.kbsKeyCombination.length > 0 ? ',' : '') +
      keyToAdd;

    const newState = {
      ...state,
      kbsKeyCombination: newKbsKeyCombination,
      kbsCount: state.kbsCount + 1,
    };
    return newState;
  } else if (eventData.type === 'keyup') {
    if (eventData.key === 'Escape') {
      // Need to close topmost open menus at the moment
      if (Object.keys(state.menus).length > 0) {
        const menuName = Object.keys(state.menus)[0];
        // Need to adjust tabbing container settings
        const newState = {
          ...state,
          tabContainerActive: true,
          tabContainerCurrent: 'ab-button-area',
          tabContainerActivator: '',
        };
        // tabContainerActivator
        const activatorButton = document.getElementById(
          state.tabContainerActivator
        );
        if (activatorButton) {
          activatorButton.focus();
        }
        return [newState, fxMenuClose(state, menuName)];
      }
      return state;
    }

    if (isModifierKey(eventData)) {
      return state;
    }

    const newCount = state.kbsCount <= 0 ? 0 : state.kbsCount - 1;
    if (newCount > 0) {
      return {
        ...state,
        kbsCount: newCount,
      };
    }

    const modifierCombination = buildModifierKeys(eventData);
    const fullKbsCombination =
      modifierCombination +
      (modifierCombination.length > 0 && state.kbsKeyCombination.length > 0
        ? ','
        : '') +
      state.kbsKeyCombination;

    let newState = {
      ...state,
      kbsKeyCombination: '',
      kbsCount: newCount,
      kbsReady: true,
    };

    switch (fullKbsCombination) {
      case 'alt,shift,p':
        return [newState, fxTTSEnable(newState)];
      case 'alt,shift,s':
        return [newState, fxTTSStopAll(newState)];
      case 'alt,shift,h':
        return [newState, fxTTSHandleHighlight(newState)];
      case 'alt,i':
        // Increase font
        return [newState, fxFontSizeIncrease(newState)];
      case 'alt,shift,d':
        // Decrease font size
        return [newState, fxFontSizeDecrease(newState)];
      case 'alt,shift,>':
      case 'alt,shift,.':
        // Next font
        if (!newState.fontActive) {
          newState = {...newState, fontActive: true};
        }
        if (newState.fontCurrentKey.length <= 0) {
          // No font set yet. Set font to the first key
          newState = {...newState, fontCurrentKey: 'sylexiad_sans'};
          return [newState, fxFontFamilyChange(newState, 'sylexiad_sans')];
        }
        // eslint-disable-next-line no-case-declarations
        let currentFont = fontConfig[newState.fontCurrentKey];
        // eslint-disable-next-line no-case-declarations
        let nextFontKey = newState.fontCurrentKey;
        for (const key in fontConfig) {
          if (fontConfig[key]?.id > currentFont.id) {
            nextFontKey = key;
            break;
          }
        }

        newState = {...newState, fontCurrentKey: nextFontKey};
        return [newState, fxFontFamilyChange(newState, nextFontKey)];
      case 'alt,shift,<':
      case 'alt,shift,@':
        // Previous font
        if (!newState.fontActive) {
          newState = {...newState, fontActive: true};
        }
        if (newState.fontCurrentKey.length <= 0) {
          // No font set yet. Set font to the first key
          newState = {...newState, fontCurrentKey: 'sylexiad_sans'};
          return [newState, fxFontFamilyChange(newState, 'sylexiad_sans')];
        }
        currentFont = fontConfig[newState.fontCurrentKey];
        // eslint-disable-next-line no-case-declarations
        let prevFontKey = newState.fontCurrentKey;
        for (const key in fontConfig) {
          if (fontConfig[key]?.id === currentFont.id - 1) {
            prevFontKey = key;
            break;
          }
        }
        newState = {...newState, fontCurrentKey: prevFontKey};
        return [newState, fxFontFamilyChange(newState, prevFontKey)];
      case 'alt,c,1':
        return [newState, fxFontColorChange(newState, 'red')];
      case 'alt,c,2':
        return [newState, fxFontColorChange(newState, 'blue')];
      case 'alt,c,3':
        return [newState, fxFontColorChange(newState, 'green')];
      case 'alt,c,4':
        return [newState, fxFontColorChange(newState, 'yellow')];
      case 'alt,c,5':
        return [newState, fxFontColorChange(newState, 'orange')];
      case 'alt,c,6':
        return [newState, fxFontColorChange(newState, 'purple')];
      case 'alt,c,7':
        return [newState, fxFontColorChange(newState, 'black')];
      case 'alt,c,8':
        return [newState, fxFontColorChange(newState, 'grey')];
      case 'alt,c,9':
        return [newState, fxFontColorChange(newState, 'white')];
      case 'l,+':
      case 'l,=':
        if (!newState.fontLineSpacingActive) {
          newState = {...newState, fontLineSpacingActive: true};
        }
        return [newState, fxFontLineSpacingInc(newState)];
      case 'l,-':
      case 'l,_':
        if (!newState.fontLineSpacingActive) {
          newState = {...newState, fontLineSpacingActive: true};
        }
        return [newState, fxFontLineSpacingDec(newState)];
      case 'c,+':
      case 'c,=':
        if (!newState.fontLetterSpacingActive) {
          newState = {...newState, fontLetterSpacingActive: true};
        }
        return [newState, fxFontLetterSpacingInc(newState)];
      case 'c,-':
      case 'c,_':
        if (!newState.fontLetterSpacingActive) {
          newState = {...newState, fontLetterSpacingActive: true};
        }
        return [newState, fxFontLetterSpacingDec(newState)];
      case 'alt,m':
        return [newState, fxMagShow(newState)];
      case 'alt,o,1':
        if (!newState.maskActive) {
          newState = {...newState, maskActive: true};
        }
        return [newState, fxMaskShow(newState, 'red')];
      case 'alt,o,2':
        if (!newState.maskActive) {
          newState = {...newState, maskActive: true};
        }
        return [newState, fxMaskShow(newState, 'blue')];
      case 'alt,o,3':
        if (!newState.maskActive) {
          newState = {...newState, maskActive: true};
        }
        return [newState, fxMaskShow(newState, 'green')];
      case 'alt,o,4':
        if (!newState.maskActive) {
          newState = {...newState, maskActive: true};
        }
        return [newState, fxMaskShow(newState, 'yellow')];
      case 'alt,o,5':
        if (!newState.maskActive) {
          newState = {...newState, maskActive: true};
        }
        return [newState, fxMaskShow(newState, 'orange')];
      case 'alt,o,6':
        if (!newState.maskActive) {
          newState = {...newState, maskActive: true};
        }
        return [newState, fxMaskShow(newState, 'purple')];
      case 'alt,r':
        // open reading bar
        if (newState.rulerReadingActive) {
          return newState;
        }
        return [newState, fxRulerShow(newState)];
      case 'r,+':
      case 'r,=':
        if (!newState.rulerReadingActive) {
          return newState;
        }
        return [newState, fxRulerSizeIncrease(newState)];
      case 'r,-':
      case 'r,_':
        if (!newState.rulerReadingActive) {
          return newState;
        }
        return [newState, fxRulerSizeDecrease(newState)];
      case 'alt,shift,o':
        if (!newState.rulerReadingActive) {
          newState = {...newState, rulerReadingActive: true};
        }
        return [newState, fxPinholeShow(newState)];
      case 'alt,1':
        return [newState, fxPinholeColorChange(newState, 'red')];
      case 'alt,2':
        return [newState, fxPinholeColorChange(newState, 'blue')];
      case 'alt,3':
        return [newState, fxPinholeColorChange(newState, 'green')];
      case 'alt,4':
        return [newState, fxPinholeColorChange(newState, 'yellow')];
      case 'alt,5':
        return [newState, fxPinholeColorChange(newState, 'orange')];
      case 'alt,6':
        return [newState, fxPinholeColorChange(newState, 'purple')];
      case 'alt,7':
        return [newState, fxPinholeColorChange(newState, 'black')];
      case 'alt,8':
        return [newState, fxPinholeColorChange(newState, 'grey')];
      case 'alt,9':
        return [newState, fxPinholeColorChange(newState, 'white')];
      case 'o,+':
      case 'o,=':
        return [newState, fxPinholeSizeIncrease(newState)];
      case 'o,-':
      case 'o,_':
        return [newState, fxPinholeSizeDecrease(newState)];
      case 'alt,s':
        return [newState, fxSREnable(newState)];
      default:
        return newState;
    }
  } else {
    return state;
  }
}

function openMenu(state: Ace.State, menuName, title, defaultFunc) {
  return [state, fxMenuOpen(state, menuName, title, defaultFunc)];
}

function focusHelper(state: Ace.State, eventData: MouseEvent) {
  if (eventData.type !== 'click') {
    return state;
  }

  return [state, fxDragStopMouseEvents(state)];
}
export default buildKeyCombination;
export {buildKeyCombination, openMenu, focusHelper};
