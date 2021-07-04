import {languageChangeAll, ptCachePage} from '../actions/language.actions';
import {ttsChangeVoice} from '../actions/tts.actions';

function fxLanguageChangeAll(key: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, props.key);
    },
    {
      key,
      action: languageChangeAll,
    },
  ];
}

function fxPtCachePage(state: Ace.State) {
  return [
    (dispatch, props) => {
      dispatch(props.action);
    },
    {
      state,
      action: ptCachePage,
    },
  ];
}

function fxPtSwitchTTS(key: number) {
  return [
    (dispatch, props) => {
      console.log(key);
      dispatch(props.action, key);
    },
    {
      action: ttsChangeVoice,
    },
  ];
}

export {fxLanguageChangeAll, fxPtCachePage, fxPtSwitchTTS};
