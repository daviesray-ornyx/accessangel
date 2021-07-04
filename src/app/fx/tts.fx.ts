import {
  ttsHandleHighlight,
  ttsHandleHover,
  ttsSpeak,
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

function fxTTSPlayAudio(data: Ace.TTSData) {
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
      action: ttsPlayAudio,
    },
  ];
}

export {
  fxTTSHighlight,
  fxTTSHover,
  fxTTSDelaySpeech,
  fxTTSHighlightEventStop,
  fxTTSHoverEventStop,
  fxTTSPlayAudio,
};
