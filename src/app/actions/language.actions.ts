import languageConfig from '../../config/language.config.json5';
import ttsVoices from '../../config/tts.config.json5';
import {getParents} from './ace.actions';
import {apiGetTranslation, apiSendEvent} from './api.actions';
import {
  fxLanguageChangeAll,
  fxPtCachePage,
  fxPtSwitchTTS,
  fxResetLanguage,
} from '../fx/language.fx';

function ptEnable(state: Ace.State) {
  apiSendEvent('AcePageTranslation_On');
  const newState = {
    ...state,
    ptActive: true,
  };
  return [newState, fxPtCachePage(newState)];
}

function ptCachePage(state: Ace.State) {
  const parentElements = getParents();
  if (state.ptPageUrlCached !== window.location.href) {
    // ensures that we don't override the original language text
    parentElements.forEach(element => {
      const originalTextContent = element.textContent || undefined;
      element.dataset.original = originalTextContent;
    });
  }
  return {
    ...state,
    ptPageUrlCached: window.location.href,
    parentElements: parentElements,
  };
}

async function getTranslation(
  state: Ace.State,
  payload: string[],
  currentLanguageCode: any
) {
  const req = await apiGetTranslation({
    strings: payload,
    to: currentLanguageCode,
  });

  const {parentElements} = state;

  const translateTextArray = req?.trans;
  Array.from(parentElements).forEach((element, index) => {
    if (element) {
      element.textContent = translateTextArray[index];
    }
  });
  return state;
}

function languageChangeAll(state: Ace.State, key?: string) {
  const {languageCurrentKey} = state;
  const currentKey: string = key || languageCurrentKey;
  if (currentKey.length <= 0) {
    return state;
  }

  // attempt to find similar tts voice
  let ttsVoiceSwitch = false;
  let ttsVoiceKey = 0;
  for (const [key, obj] of ttsVoices.entries()) {
    if (
      obj.name
        .toLowerCase()
        .includes(languageConfig[currentKey].name.toLowerCase())
    ) {
      ttsVoiceKey = key;
      ttsVoiceSwitch = true;
      break;
    }
  }

  const currentLanguageCode = languageConfig[currentKey].code || 'en';
  const parentElements = getParents();
  const payload = new Array<string>();

  parentElements.forEach(async element => {
    payload.push(element.textContent || '');
  });

  getTranslation(state, payload, currentLanguageCode);

  return [state, ttsVoiceSwitch && fxPtSwitchTTS(ttsVoiceKey)];
}

function languageToggleCurrent(state: Ace.State, key: string) {
  // Check if caching is necessary
  const newState = {
    ...state,
    languageActive: true,
    languageCurrentKey: key,
    selectLanguageListActive: false,
  };
  return [newState, fxLanguageChangeAll(key), fxPtCachePage(newState)];
}

function languageToggleList(state: Ace.State) {
  return {
    ...state,
    selectLanguageListActive: !state.selectLanguageListActive && state.ptActive,
  };
}

function ptToggle(state: Ace.State) {
  // pending logic to replace content
  if (state.ptPageUrlCached !== window.location.href) {
    getParents().forEach(element => {
      element.textContent = element.dataset.original || element.textContent;
    });

    state.ptPageUrlCached = window.location.href;
  }

  const newState = {
    ...state,
    ptActive: !state.ptActive,
    ...(!state.ptActive && {ptTTSVoiceBackup: state.ttsVoice}),
    ...(state.ptActive && {
      ttsVoice: state.ptTTSVoiceBackup,
      ttsCurrentVoiceName: state.ptTTSVoiceBackup.name,
    }),
    languageCurrentKey: '',
    selectLanguageListActive: state.ptActive
      ? false
      : state.selectLanguageListActive,
  };

  apiSendEvent(`AcePageTranslation_${newState.ptActive ? 'On' : 'Off'}`);
  return [
    newState,
    newState.ptActive && fxPtCachePage(newState),
    !newState.ptActive && fxResetLanguage(newState),
  ];
}

function ptResetLanguage(state: Ace.State) {
  if (state.ptPageUrlCached) {
    // Reset should happen here
    getParents().forEach(element => {
      element.textContent = element.dataset.original || '';
    });
  } else {
    return [state, ptCachePage(state)];
  }
  return state;
}

function ptResetAll(state: Ace.State) {
  apiSendEvent('AcePageTranslation_Off');
  const newState = {
    ...state,
    ptActive: false,
  };

  return [newState, ptResetLanguage(newState)];
}

export {
  ptEnable,
  ptToggle,
  languageChangeAll,
  languageToggleCurrent,
  languageToggleList,
  ptCachePage,
  ptResetAll,
  ptResetLanguage,
};
