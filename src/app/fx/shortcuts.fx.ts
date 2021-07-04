import {
  ttsHoverEnable,
  ttsStopAll,
  ttsHandleHighlight,
  ttsHoverToggle,
  ttsHightlightToggle,
} from '../actions/tts.actions';
import {
  fontChangeFamilyAll,
  fontDecSize,
  fontIncSize,
  fontReset,
  fontFamilyToggle,
  fontToggleList,
  fontColourToggle,
  fontColourChange,
  fontLetterSpacingDecrement,
  fontLetterSpacingIncrement,
  fontLineSpacingIncrement,
  fontLineSpacingDecrement,
  fontLineSpacingToggle,
  fontLetterSpacingToggle,
} from '../actions/font.actions';

import {
  magEnable,
  magToggle,
  magUpdatePosition,
  magScaleDecrease,
  magScaleIncrease,
  magWidthDecrease,
  magWidthIncrease,
  magHeightDecrease,
  magHeightIncrease,
} from '../actions/mag.actions';
import {
  maskToggle,
  maskChangeColour,
  maskDecreaseOpacity,
  maskIncreaseOpacity,
} from '../actions/mask.actions';

import {
  rulerReadingEnable,
  rulerReadingToggle,
  rulerReadingOpacityDec,
  rulerReadingOpacityInc,
  rulerSizeIncrease,
  rulerSizeDecrease,
  rulerPinholeToggle,
  rulerChangePinholeMaskCustomColour,
  rulerPinholeSizeInc,
  rulerPinholeSizeDec,
  rulerPinholeOpacityInc,
  rulerPinholeOpacityDec,
} from '../actions/ruler.actions';

import {srEnable, srToggle} from '../actions/sr.actions';

import {
  menuOpen,
  menuClose,
  menuHelp,
  menuRulerOpsSwitchInner,
  menuTextOpsSwitchInner,
} from '../actions/menu.actions';
import {
  aceSpeakTooltipsToggle,
  aceHide,
  aceCreatePickr,
} from '../actions/ace.actions';
import resetAll from '../actions/reset.actions';
import {settingsOpen, settingsChangeTheme} from '../actions/settings.actions';
import {aboutOpen} from '../actions/about.actions';
import closeAce from '../actions/close.actions';
import {fxFontSizingDisable} from './font.fx';
import {ptToggle} from '../actions/language.actions';
import {simplifyOpen} from '../actions/simplify.actions';

const functionNameConfig = {
  _menuHelp: fxMenuHelp,
  _menuClose: fxMenuClose,
  _ttsHoverEnable: fxTTSEnable,
  _ttsHoverToggle: fxTtsHoverToggle,
  _ttsHightlightToggle: fxTtsHightlightToggle,
  _fontIncSize: fxFontSizeIncrease,
  _fontDecSize: fxFontSizeDecrease,
  _fontSizingDisable: fxFontSizingDisable,
  _textOptions: undefined,
  _fontFamilyToggle: fxFontFamilyToggle,
  _fontToggleList: fxFontToggleList,
  _fontColourToggle: fxFontColourToggle,
  _fontLineSpacingToggle: fxFontLineSpacingToggle,
  _fontLineSpacingIncrement: fxFontLineSpacingInc,
  _fontLineSpacingDecrement: fxFontLineSpacingDec,
  _fontLetterSpacingToggle: fxFontLetterSpacingToggle,
  _fontLetterSpacingIncrement: fxFontLetterSpacingInc,
  _fontLetterSpacingDecrement: fxFontLetterSpacingDec,
  _menuTextOpsSwitchInner: fxMenuTextOpsSwitchInner,
  _magEnable: fxMagShow,
  _magToggle: fxMagToggle,
  _magScaleDecrease: fxMagScaleDecrease,
  _magScaleIncrease: fxMagScaleIncrease,
  _magWidthDecrease: fxMagWidthDecrease,
  _magWidthIncrease: fxMagWidthIncrease,
  _magHeightDecrease: fxMagHeightDecrease,
  _magHeightIncrease: fxMagHeightIncrease,
  _maskEnable: fxMaskShow,
  _maskToggle: fxMaskToggle,
  _maskDecreaseOpacity: fxMaskDecreaseOpacity,
  _maskIncreaseOpacity: fxMaskIncreaseOpacity,
  _rulerReadingEnable: fxRulerShow,
  _rulerReadingToggle: fxRulerReadingToggle,
  _rulerReadingOpacityDec: fxRulerReadingOpacityDec,
  _rulerReadingOpacityInc: fxRulerReadingOpacityInc,
  _rulerSizeDecrease: fxRulerSizeDecrease,
  _rulerSizeIncrease: fxRulerSizeIncrease,
  _rulerPinholeToggle: fxRulerPinholeToggle,
  _rulerPinholeOpacityDec: fxRulerPinholeOpacityDec,
  _rulerPinholeOpacityInc: fxRulerPinholeOpacityInc,
  _rulerPinholeSizeDec: fxPinholeSizeDecrease,
  _rulerPinholeSizeInc: fxPinholeSizeIncrease,
  _menuRulerOpsSwitchInner: fxMenuRulerOpsSwitchInner,
  _srEnable: fxSREnable,
  _srToggle: fxSrToggle,
  _ptToggle: fxPtToggle,
  _simplifyOpen: fxSimplifyOpen,
  _aceSpeakTooltipsToggle: fxAceSpeakTooltipsToggle,
  _resetAll: fxResetAll,
  _settingsOpen: fxSettingsOpen,
  _settingsChangeTheme: fxSettingsChangeTheme,
  _aboutOpen: fxAboutOpen,
  _closeAce: fxCloseAce,
  _aceHide: fxHideAce,
};

function fxTTSEnable(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ttsHoverEnable,
    },
  ];
}

function fxTTSStopAll(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ttsStopAll,
    },
  ];
}

function fxTTSHandleHighlight(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ttsHandleHighlight,
    },
  ];
}

function fxTtsHoverToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ttsHoverToggle,
    },
  ];
}

function fxTtsHightlightToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ttsHightlightToggle,
    },
  ];
}

function fxFontFamilyChange(state: Ace.State, key: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, key);
    },
    {
      state,
      action: fontChangeFamilyAll,
    },
  ];
}

function fxFontSizeIncrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontIncSize,
    },
  ];
}

function fxFontSizeDecrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontDecSize,
    },
  ];
}

function fxFontReset(state: Ace.State) {
  return (
    state.fontSizingActive && [
      (dispatch, props) => {
        dispatch(props.action, props.opts);
      },
      {
        opts: 'fontSizing',
        action: fontReset,
      },
    ]
  );
}

function fxMenuTextOpsSwitchInner(state: Ace.State, current: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, current);
    },
    {
      state,
      action: menuTextOpsSwitchInner,
    },
  ];
}

function fxFontFamilyToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontFamilyToggle,
    },
  ];
}

function fxFontToggleList(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontToggleList,
    },
  ];
}

function fxFontColourToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontColourToggle,
    },
  ];
}

function fxFontColorChange(state: Ace.State, colorName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, colorName);
    },
    {
      state,
      action: fontColourChange,
    },
  ];
}

function fxAceCreatePickr(
  state: Ace.State,
  opts: {id: string; action: (state: Ace.State, colour: string) => unknown}
) {
  return [
    (dispatch, props) => {
      dispatch(props.action, opts);
    },
    {
      state,
      action: aceCreatePickr,
    },
  ];
}
function fxFontLineSpacingToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontLineSpacingToggle,
    },
  ];
}
function fxFontLineSpacingInc(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontLineSpacingIncrement,
    },
  ];
}

function fxFontLineSpacingDec(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontLineSpacingDecrement,
    },
  ];
}

function fxFontLetterSpacingToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontLetterSpacingToggle,
    },
  ];
}
function fxFontLetterSpacingInc(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontLetterSpacingIncrement,
    },
  ];
}

function fxFontLetterSpacingDec(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: fontLetterSpacingDecrement,
    },
  ];
}

function fxMagShow(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magEnable,
    },
  ];
}

function fxMagToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magToggle,
    },
  ];
}

function fxMagScaleDecrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magScaleDecrease,
    },
  ];
}

function fxMagScaleIncrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magScaleIncrease,
    },
  ];
}

function fxMagWidthDecrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magWidthDecrease,
    },
  ];
}

function fxMagWidthIncrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magWidthIncrease,
    },
  ];
}

function fxMagHeightDecrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magHeightDecrease,
    },
  ];
}

function fxMagHeightIncrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
      dispatch(magUpdatePosition);
    },
    {
      state,
      action: magHeightIncrease,
    },
  ];
}

function fxMaskShow(state: Ace.State, colorName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, colorName);
    },
    {
      state,
      action: maskChangeColour,
    },
  ];
}

function fxMaskToggle(state: Ace.State, colorName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, colorName);
    },
    {
      state,
      action: maskToggle,
    },
  ];
}

function fxMaskDecreaseOpacity(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: maskDecreaseOpacity,
    },
  ];
}

function fxMaskIncreaseOpacity(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: maskIncreaseOpacity,
    },
  ];
}

function fxMenuRulerOpsSwitchInner(state: Ace.State, current: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, current);
    },
    {
      state,
      action: menuRulerOpsSwitchInner,
    },
  ];
}

function fxRulerShow(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerReadingEnable,
    },
  ];
}

function fxRulerReadingToggle(state: Ace.State, colorName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, colorName);
    },
    {
      state,
      action: rulerReadingToggle,
    },
  ];
}

function fxRulerReadingOpacityDec(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerReadingOpacityDec,
    },
  ];
}

function fxRulerReadingOpacityInc(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerReadingOpacityInc,
    },
  ];
}

function fxRulerSizeIncrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerSizeIncrease,
    },
  ];
}

function fxRulerSizeDecrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerSizeDecrease,
    },
  ];
}

function fxPinholeShow(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerPinholeToggle,
    },
  ];
}

function fxRulerPinholeToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerPinholeToggle,
    },
  ];
}

function fxPinholeColorChange(state: Ace.State, colorName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, colorName);
    },
    {
      state,
      action: rulerChangePinholeMaskCustomColour,
    },
  ];
}

function fxRulerPinholeOpacityDec(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerPinholeOpacityDec,
    },
  ];
}

function fxRulerPinholeOpacityInc(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerPinholeOpacityInc,
    },
  ];
}

function fxPinholeSizeIncrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerPinholeSizeInc,
    },
  ];
}

function fxPinholeSizeDecrease(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: rulerPinholeSizeDec,
    },
  ];
}

function fxAceSpeakTooltipsToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: aceSpeakTooltipsToggle,
    },
  ];
}

function fxSREnable(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: srEnable,
    },
  ];
}

function fxSrToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: srToggle,
    },
  ];
}

function fxPtToggle(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ptToggle,
    },
  ];
}

function fxSimplifyOpen(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: simplifyOpen,
    },
  ];
}

function fxResetAll(state: Ace.State) {
  // resetAll
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: resetAll,
    },
  ];
}

function fxSettingsOpen(state: Ace.State) {
  // resetAll
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: settingsOpen,
    },
  ];
}

function fxSettingsChangeTheme(state: Ace.State, colorName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, colorName);
    },
    {
      state,
      action: settingsChangeTheme,
    },
  ];
}

function fxAboutOpen(state: Ace.State) {
  // resetAll
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: aboutOpen,
    },
  ];
}

function fxCloseAce(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: closeAce,
    },
  ];
}

function fxHideAce(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: aceHide,
    },
  ];
}

function fxMenuOpen(
  state: Ace.State,
  menuName: string,
  title: string,
  defaultFunc?: unknown
) {
  return [
    (dispatch, props) => {
      dispatch(props.action, {
        menuName: menuName,
        title: title,
        defaultFunc: defaultFunc,
      });
    },
    {
      state,
      action: menuOpen,
    },
  ];
}

function fxMenuClose(state: Ace.State, menuName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, {
        menuName: menuName,
      });
    },
    {
      state,
      action: menuClose,
    },
  ];
}

function fxMenuHelp(state: Ace.State, menuName: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, {
        menuName: menuName,
      });
    },
    {
      state,
      action: menuHelp,
    },
  ];
}

export {
  functionNameConfig,
  fxTTSEnable,
  fxTTSStopAll,
  fxTTSHandleHighlight,
  fxTtsHoverToggle,
  fxTtsHightlightToggle,
  fxFontFamilyChange,
  fxFontSizeIncrease,
  fxFontSizeDecrease,
  fxFontReset,
  fxFontFamilyToggle,
  fxFontToggleList,
  fxFontColourToggle,
  fxFontColorChange,
  fxFontLineSpacingToggle,
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
  fxSimplifyOpen,
  fxAceSpeakTooltipsToggle,
  fxResetAll,
  fxSettingsOpen,
  fxAboutOpen,
  fxCloseAce,
  fxHideAce,
  fxMenuOpen,
  fxMenuClose,
  fxMenuHelp,
  fxMenuTextOpsSwitchInner,
  fxAceCreatePickr,
};
