import aceState from '../state/ace.state';
import {fontReset} from './font.actions';
import {ptResetAll} from './language.actions';
import {magResetAll} from './mag.actions';

function resetState(state: Ace.State) {
  const resetStateObj = {
    aceHidden: state.aceHidden,
    menus: state.menus,
    feedbackProvided: state.feedbackProvided,
  };

  return {...aceState, ...resetStateObj};
}

function resetFunctions(state: Ace.State) {
  state.fontSizingActive && fontReset(state, 'fontSizing');
  state.fontActive && fontReset(state, 'fontFamily');
  state.fontColourActive && fontReset(state, 'fontColour');
  state.fontLineSpacingActive && fontReset(state, 'fontLineSpacing');
  state.fontLetterSpacingActive && fontReset(state, 'fontLetterSpacing');
  state.ptActive && ptResetAll(state);
  state.magActive && magResetAll(state);
}

function resetAll(state: Ace.State) {
  resetFunctions(state);
  return resetState(state);
}

export default resetAll;
