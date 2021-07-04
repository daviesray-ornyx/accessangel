import {
  srAddEvents,
  srFillLastDictation,
  srHandleResult,
  srInitRuntime,
  srStart,
} from '../actions/sr.actions';

function fxSREnable(state: Ace.State) {
  return state.srActive
    ? [
        [
          (dispatch, props) => {
            dispatch(props.runtime);
            dispatch(props.events);
            dispatch(props.start);
          },
          {
            runtime: srInitRuntime,
            events: srAddEvents,
            start: srStart,
          },
        ],
      ]
    : [
        (dispatch, props) => {
          dispatch(props.action);
        },
        {
          action: (state: Ace.State) => {
            if (typeof state.srRuntime !== 'boolean') {
              state.srRuntime.abort();
            }

            return {
              ...state,
              srRuntime: false,
            };
          },
        },
      ];
}

function fxSRAddEvents(state) {
  return [
    (dispatch, props) => {
      props.runtime.onresult = event => dispatch(props.action, event);
    },
    {
      action: srHandleResult,
      runtime: state.srRuntime,
    },
  ];
}

function fxSRFillLastDictate(dictation: string) {
  return [
    (dispatch, props) => {
      dispatch(props.action, dictation);
    },
    {
      dictation,
      action: srFillLastDictation,
    },
  ];
}

export {fxSREnable, fxSRAddEvents, fxSRFillLastDictate};
