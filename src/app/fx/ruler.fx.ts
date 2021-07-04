import {fxDragStartMouseEvents, fxDragStopMouseEvents} from './drag.fx';
import {rulerMove} from '../actions/ruler.actions';

function fxRulerReadingEvents(state: Ace.State) {
  return state.rulerReadingActive
    ? [fxDragStartMouseEvents(state), fxRulerMoveStart()]
    : [fxDragStopMouseEvents(state), fxRulerMoveStop()];
}

function fxRulerPinholeEvents(state: Ace.State) {
  return state.rulerPinholeActive
    ? [fxDragStartMouseEvents(state), fxRulerMoveStart()]
    : [fxDragStopMouseEvents(state), fxRulerMoveStop()];
}

const rulerMoveHandle: unknown[] = [];
const rulerMovePassthrough = (dispatch, props) => {
  rulerMoveHandle.length < 1 &&
    rulerMoveHandle.push(() => dispatch(props.action));

  return rulerMoveHandle[0];
};

function fxRulerMoveStart() {
  return [
    (dispatch, props) => {
      document.addEventListener(
        'mousemove',
        rulerMovePassthrough(dispatch, props)
      );
      document.addEventListener(
        'touchmove',
        rulerMovePassthrough(dispatch, props)
      );
    },
    {
      action: rulerMove,
    },
  ];
}

function fxRulerMoveStop() {
  return [
    (dispatch, props) => {
      document.removeEventListener('mousemove', props.action);
      document.removeEventListener('touchmove', props.action);
      rulerMoveHandle.pop();
    },
    {
      action: rulerMoveHandle[0],
    },
  ];
}

export {fxRulerPinholeEvents, fxRulerReadingEvents, fxRulerMoveStop};
