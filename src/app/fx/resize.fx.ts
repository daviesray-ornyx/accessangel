import {aceResize} from '../actions/ace.actions';

function fxResize() {
  return fxResizeAce();
}

const resizeHandle: unknown[] = [];
const resizePassthrough = (dispatch, props) => {
  resizeHandle.length < 1 && resizeHandle.push(() => dispatch(props.action));

  return resizeHandle[0];
};

function fxResizeAce() {
  return [
    (dispatch, props) => {
      window.addEventListener('resize', resizePassthrough(dispatch, props), {
        passive: true,
      });

      return () => {};
    },
    {
      action: aceResize,
    },
  ];
}

export default fxResize;
