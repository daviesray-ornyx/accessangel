import {
  fontChangeFamilyAll,
  fontColourChange,
  fontColourReset,
  fontFamilyReset,
  fontLetterSpacingChange,
  fontLetterSpacingReset,
  fontLineSpacingChange,
  fontLineSpacingReset,
  fontReset,
} from '../actions/font.actions';

function fxFontFamilyToggle(state: Ace.State) {
  return state.fontActive
    ? [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontChangeFamilyAll,
        },
      ]
    : [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontFamilyReset,
        },
      ];
}

function fxFontSizingDisable(state: Ace.State) {
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

function fxFontColourToggle(state: Ace.State) {
  return state.fontColourActive
    ? [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontColourChange,
        },
      ]
    : [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontColourReset,
        },
      ];
}

function fxFontLineSpacingToggle(state: Ace.State) {
  return state.fontLineSpacingActive
    ? [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontLineSpacingChange,
        },
      ]
    : [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontLineSpacingReset,
        },
      ];
}

function fxFontLetterSpacingToggle(state: Ace.State) {
  return state.fontLetterSpacingActive
    ? [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontLetterSpacingChange,
        },
      ]
    : [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: fontLetterSpacingReset,
        },
      ];
}

function fxFontColourChange(state: Ace.State, colour: string) {
  return (
    state.fontColourActive && [
      (dispatch, props) => {
        dispatch(props.action, props.colour);
      },
      {
        colour,
        action: fontColourChange,
      },
    ]
  );
}

function fxFontLineSpacingChange(state: Ace.State, nextCount: number) {
  return (
    state.fontLineSpacingActive && [
      (dispatch, props) => {
        dispatch(props.action, props.count);
      },
      {
        action: fontLineSpacingChange,
        count: nextCount,
      },
    ]
  );
}

function fxFontLetterSpacingChange(state: Ace.State, nextCount: number) {
  return (
    state.fontLetterSpacingActive && [
      (dispatch, props) => {
        dispatch(props.action, props.count);
      },
      {
        action: fontLetterSpacingChange,
        count: nextCount,
      },
    ]
  );
}

function fxFontToggleCurrent(state: Ace.State, key: string) {
  return (
    state.fontActive && [
      (dispatch, props) => {
        dispatch(props.action, props.key);
      },
      {
        key,
        action: fontChangeFamilyAll,
      },
    ]
  );
}

export {
  fxFontFamilyToggle,
  fxFontSizingDisable,
  fxFontColourToggle,
  fxFontLineSpacingToggle,
  fxFontLetterSpacingToggle,
  fxFontColourChange,
  fxFontLineSpacingChange,
  fxFontLetterSpacingChange,
  fxFontToggleCurrent,
};
