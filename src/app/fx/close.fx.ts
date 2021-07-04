import {apiSendEvent} from '../actions/api.actions';
import {fxTTSHighlightEventStop, fxTTSHoverEventStop} from './tts.fx';
import {fxDragStop} from './drag.fx';
import {fxRulerMoveStop} from './ruler.fx';
import {fxMagMoveStop} from './mag.fx';

function stopEvents(state: Ace.State) {
  return [
    state,
    fxTTSHighlightEventStop(state),
    fxTTSHoverEventStop(state),
    fxDragStop(),
    fxRulerMoveStop(),
    fxMagMoveStop(),
  ];
}

function finalStateSave(state: Ace.State) {
  return state;
}

function fxCloseAce() {
  return [
    (dispatch, props) => {
      apiSendEvent('AceClosed');

      dispatch(props.events);
      dispatch(props.stateSave);

      window.aceRuntimeProxy.close();
    },
    {
      events: stopEvents,
      stateSave: finalStateSave,
    },
  ];
}

export {fxCloseAce};
