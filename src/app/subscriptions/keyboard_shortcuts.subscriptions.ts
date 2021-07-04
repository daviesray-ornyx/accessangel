import {buildKeyCombination, focusHelper} from '../actions/shortcuts.actions';

// KeyDown Subscription
const subKeyDown = (dispatch, props) => {
  const handler = event => {
    dispatch(props.action, event);
  };

  window.addEventListener('keydown', handler);

  return () => window.removeEventListener('keydown', handler);
};

const subKeyDownHelper = () => [subKeyDown, {action: buildKeyCombination}];

const subKeyUp = (dispatch, props) => {
  const handler = event => {
    dispatch(props.action, event);
  };

  window.addEventListener('keyup', handler);

  return () => window.removeEventListener('keyup', handler);
};

const subKeyUpHelper = () => [subKeyUp, {action: buildKeyCombination}];

const subMouseEvent = (dispatch, props) => {
  const handler = event => {
    dispatch(props.action, event);
  };

  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
};
const subMouseEventHelper = () => [subMouseEvent, {action: focusHelper}];
export {subKeyDownHelper, subKeyUpHelper, subMouseEventHelper};
