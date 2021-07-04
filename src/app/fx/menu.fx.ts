import {menuMove, menuSpawn, menuSetFocus} from '../actions/menu.actions';
import {fxDragStartMouseEvents, fxDragStopMouseEvents} from './drag.fx';

function fxMenuDragEvents(state: Ace.State) {
  return state.menusCanDrag
    ? [fxDragStartMouseEvents(state), fxMenuMoveStart()]
    : [fxDragStopMouseEvents(state), fxMenuMoveStop()];
}

const menuMoveHandle: unknown[] = [];
const menuMovePassthrough = (dispatch, props) => {
  menuMoveHandle.length < 1 &&
    menuMoveHandle.push(() => dispatch(props.action));

  return menuMoveHandle[0];
};

function fxMenuMoveStart() {
  return [
    (dispatch, props) => {
      document.addEventListener(
        'mousemove',
        menuMovePassthrough(dispatch, props)
      );
      document.addEventListener(
        'touchmove',
        menuMovePassthrough(dispatch, props)
      );
    },
    {
      action: menuMove,
    },
  ];
}

function fxMenuMoveStop() {
  return [
    (dispatch, props) => {
      document.removeEventListener('mousemove', props.action);
      document.removeEventListener('touchmove', props.action);
      menuMoveHandle.pop();
    },
    {
      action: menuMoveHandle[0],
    },
  ];
}

function fxMenuOpen(state: Ace.State, menuName: string, title: string) {
  return (
    Object.keys(state.menus).indexOf(menuName) === -1 && [
      (dispatch, props) => {
        dispatch(props.action, props.opts);
      },
      {
        action: menuSpawn,
        opts: {
          menuName,
          title,
        },
      },
    ]
  );
}

function fxMenuDefaultFunction(
  state: Ace.State,
  defaultFunc: (state: Ace.State) => unknown
) {
  return (
    state.aceOpenDefaults && [
      (dispatch, props) => {
        dispatch(props.action);
      },
      {
        action: defaultFunc,
      },
    ]
  );
}

function fxMenuFocus(state: Ace.State, menuName: string) {
  return (
    Object.keys(state.menus).indexOf(menuName) !== -1 && [
      (dispatch, props) => {
        dispatch(props.action, props.opts);
      },
      {
        action: menuSetFocus,
        opts: {
          menuName,
        },
      },
    ]
  );
}

export {
  fxMenuMoveStart,
  fxMenuDragEvents,
  fxMenuMoveStop,
  fxMenuOpen,
  fxMenuDefaultFunction,
  fxMenuFocus,
};
