import {
  ttsHandleHighlight,
  ttsHandleHover,
  ttsSpeak,
  ttsPrepAudio,
  ttsPlayAudio,
  ttsStopCurrent,
} from '../actions/tts.actions';
import {apiGetTTS} from '../actions/api.actions';

const hoverHandle: unknown[] = [];
const hoverPassthrough = (dispatch, props) => {
  hoverHandle.length < 1 &&
    hoverHandle.push(event => dispatch(props.action, event));

  return hoverHandle[0];
};

function fxTTSHover(state: Ace.State) {
  return state.ttsHoverSpeak
    ? [
        (dispatch, props) => {
          document.addEventListener(
            'mouseover',
            hoverPassthrough(dispatch, props)
          );

          return () => {
            document.removeEventListener(
              'mouseover',
              hoverPassthrough(dispatch, props)
            );
          };
        },
        {
          action: ttsHandleHover,
        },
      ]
    : [
        (dispatch, props) => {
          document.removeEventListener('mouseover', props.action);
          hoverHandle.pop();
        },
        {action: hoverHandle[0]},
      ];
}

function fxTTSHoverEventStop(state: Ace.State) {
  return (
    state.ttsHoverSpeak && [
      (dispatch, props) => {
        document.removeEventListener('mouseover', props.action);
        hoverHandle.pop();
      },
      {action: hoverHandle[0]},
    ]
  );
}

const highlightHandle: unknown[] = [];
const highlightPassthrough = (dispatch, props) => {
  highlightHandle.length < 1 &&
    highlightHandle.push(event => dispatch(props.action, event));

  return highlightHandle[0];
};

function fxTTSHighlight(state: Ace.State) {
  return state.ttsHighlightSpeak
    ? [
        (dispatch, props) => {
          document.addEventListener(
            'mouseup',
            highlightPassthrough(dispatch, props)
          );

          return () => {
            document.removeEventListener(
              'mouseup',
              highlightPassthrough(dispatch, props)
            );
          };
        },
        {
          action: ttsHandleHighlight,
        },
      ]
    : [
        (dispatch, props) => {
          document.removeEventListener('mouseup', props.action);
          highlightHandle.pop();
        },
        {action: highlightHandle[0]},
      ];
}


function fxTTSHighlightEventStop(state: Ace.State) {
  return (
    state.ttsHighlightSpeak && [
      (dispatch, props) => {
        document.removeEventListener('mouseup', props.action);
        highlightHandle.pop();
      },
      {action: highlightHandle[0]},
    ]
  );
}


let timeoutHandle: number;

function fxTTSDelaySpeech(state: Ace.State, currentText: string) {
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }

  return [
    (dispatch, props) => {
      const to = setTimeout(() => {
        ttsStopCurrent(state);
        dispatch(props.action, props.currentText);
      }, 500);
      timeoutHandle = to;

      return () => {
        clearTimeout(to);
      };
    },
    {
      currentText,
      action: ttsSpeak,
    },
  ];
}

function fxTTSPrepAudio(data: Ace.TTSData) {
  return [
    (dispatch, props) => {
      apiGetTTS(data).then(audioData => {
        if (audioData?.success !== 'true') {
          return;
        }

        dispatch(props.action, audioData?.id);
      });
    },
    {
      action: ttsPrepAudio,
    },
  ];
}

const playAudioHandle: unknown[] = [];
const playAudioPassthrough = (dispatch, props) => {
  playAudioHandle.length < 1 &&
  playAudioHandle.push(event => dispatch(props.action, event));

  return playAudioHandle[0];
};


function fxTTSPlayAudio(state: Ace.State){
  const {ttsAudio} = state;
  return [
    (dispatch, props) => {
      ttsAudio.addEventListener('canplaythrough', playAudioPassthrough(dispatch,props));
      
      return () => {
        ttsAudio.removeEventListener('canplaythrough', playAudioPassthrough(dispatch,props));
      };
    },
    {
      state,
      action: ttsPlayAudio,
    },
  ];
}

const stopAudioHandle: unknown[] = [];
const stopAudioPassthrough = (dispatch, props) => {
  stopAudioHandle.length < 1 &&
  stopAudioHandle.push(event => dispatch(props.action, event));

  return stopAudioHandle[0];
};

function fxTTSStopAudio(state: Ace.State){
  const {ttsAudio} = state;
  return [
    (dispatch, props) => {
      ttsAudio.addEventListener('ended', stopAudioPassthrough(dispatch,props));
      
      return () => {
        ttsAudio.removeEventListener('ended', stopAudioPassthrough(dispatch,props));
      };
    },
    {
      state,
      action: ttsStopCurrent,
    },
  ];
}

export {
  fxTTSHighlight,
  fxTTSHover,
  fxTTSDelaySpeech,
  fxTTSHighlightEventStop,
  fxTTSHoverEventStop,
  fxTTSPrepAudio,
  fxTTSPlayAudio,
  fxTTSStopAudio,
};
