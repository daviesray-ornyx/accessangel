import {ttsSpeak, ttsStopCurrent} from '../actions/tts.actions';

function fxAceSpeakTooltip(
  state: Ace.State,
  opts: {id: string; content: string}
) {
  return [
    (dispatch, props) => {
      const {aceTooltipSpeakTimeout} = state;

      if (aceTooltipSpeakTimeout) {
        clearTimeout(aceTooltipSpeakTimeout);
      }

      const to = setTimeout(() => {
        ttsStopCurrent(state);
        dispatch(ttsSpeak, props.content); // speak tippy content
      }, 500);

      dispatch({
        ...state,
        aceTooltipSpeakTimeout: to,
      });

      return () => {};
    },
    {
      ...opts,
    },
  ];
}

export {fxAceSpeakTooltip};
