import {
  fxMenuDefaultFunction,
  fxMenuDragEvents,
  fxMenuOpen,
  fxMenuFocus,
} from '../fx/menu.fx';
import menuConfig from '../../config/menu.config.json5';

function menuSpawn(state: Ace.State, opts) {
  const {menus} = state;

  return {
    ...state,
    menus: {
      ...menus,
      ...menuFactory(opts.menuName, opts.title),
    },
  };
}

function menuFactory(
  name: string,
  title: string
): {[x: string]: Ace.StateMenu} {
  if (!window.aceRuntimeProxy.mainElement) {
    return {};
  }

  const bar = window.aceRuntimeProxy.mainElement.querySelector('ab-inner-bar');

  if (!bar) {
    return {};
  }

  return {
    [name]: {
      menuActive: true,
      menuPosX: 0,
      menuPosY: bar.getBoundingClientRect().height,
      menuInitialX: 0,
      menuInitialY: 0,
      menuOffsetX: 0,
      menuOffsetY: bar.getBoundingClientRect().height,
      menuTitle: title,
      shortcutKeysAdded: false,
    },
  };
}

function menuSetFocus(state: Ace.State, opts: {menuName: string}) {
  const menuElement = document.getElementById(`ab-menu-${opts.menuName}`);
  menuElement?.focus();
  return state;
}

function menuMove(state: Ace.State) {
  if (!window.aceRuntimeProxy.mainElement) {
    return state;
  }

  const {menusDragActive, menus, dragMouseX, dragMouseY} = state;
  const {menuInitialX, menuInitialY} = menus[menusDragActive];
  const menu = window.aceRuntimeProxy.mainElement.querySelector(
    `#ab-menu-${menusDragActive}`
  );

  if (!menu) {
    return state;
  }

  const rect = menu.getBoundingClientRect();
  const windowWidth = window.innerWidth - rect.width;
  const windowHeight = window.innerHeight - rect.height;
  let x = dragMouseX - menuInitialX;
  let y = dragMouseY - menuInitialY;

  if (x < 0) {
    x = 0;
  }

  if (x > windowWidth) {
    x = windowWidth;
  }

  if (y < 0) {
    y = 0;
  }

  if (y > windowHeight) {
    y = windowHeight;
  }

  return {
    ...state,
    menus: {
      ...menus,
      [menusDragActive]: {
        ...menus[menusDragActive],
        menuPosX: x,
        menuPosY: y,
        menuOffsetX: x,
        menuOffsetY: y,
      },
    },
  };
}

function menuFixOutOfBounds(state: Ace.State) {
  const {menus} = state;
  const cMenus = menus;

  if (!window.aceRuntimeProxy.mainElement) {
    return state;
  }

  for (const index of Object.keys(cMenus)) {
    const menu = window.aceRuntimeProxy.mainElement.querySelector(
      `#ab-menu-${index}`
    );

    if (!menu) {
      return state;
    }

    const rect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth - rect.width;
    const windowHeight = window.innerHeight - rect.height;

    if (cMenus[index].menuPosX < 0) {
      cMenus[index].menuPosX = 0;
      cMenus[index].menuOffsetX = 0;
    }

    if (cMenus[index].menuPosX > windowWidth) {
      cMenus[index].menuPosX = windowWidth;
      cMenus[index].menuOffsetX = windowWidth;
    }

    if (cMenus[index].menuPosY < 0) {
      cMenus[index].menuPosY = 0;
      cMenus[index].menuOffsetY = 0;
    }

    if (cMenus[index].menuPosY > windowHeight) {
      cMenus[index].menuPosY = windowHeight;
      cMenus[index].menuOffsetY = windowHeight;
    }
  }

  return {...state, menus: cMenus};
}

function menuStartDrag(
  state: Ace.State,
  opts: {ev: Ace.DragEvent; menuName: string}
) {
  opts.ev.preventDefault();
  const {menuOffsetX, menuOffsetY} = state.menus[opts.menuName];
  const ev = opts.ev.touches ? opts.ev.touches[0] : opts.ev;
  const {clientX, clientY} = ev;

  const newState = {
    ...state,
    menusCanDrag: true,
    menusDragActive: opts.menuName,
    menus: {
      ...state.menus,
      [opts.menuName]: {
        ...state.menus[opts.menuName],
        menuInitialX: clientX - menuOffsetX,
        menuInitialY: clientY - menuOffsetY,
      },
    },
  };

  return [newState, fxMenuDragEvents(newState)];
}

function menuEndDrag(state: Ace.State) {
  const newState = {
    ...state,
    menusCanDrag: false,
    menusDragActive: '',
  };

  return [newState, fxMenuDragEvents(newState)];
}

function menuOpen(
  state: Ace.State,
  opts: {
    menuName: string;
    title: string;
    defaultFunc?: (state: Ace.State) => unknown;
  }
) {
  const {menuName, title, defaultFunc} = opts;

  return [
    state,
    [
      fxMenuOpen(state, menuName, title),
      defaultFunc && fxMenuDefaultFunction(state, defaultFunc),
      fxMenuFocus(state, menuName),
    ],
  ];
}

function menuClose(state: Ace.State, opts: {menuName: string}) {
  const {menus} = state;
  const menusCopy = menus;

  delete menusCopy[opts.menuName];

  return {
    ...state,
    menus: menusCopy,
  };
}

function menuHelp(state: Ace.State, opts: {menuName: string}) {
  // open link in new tab
  const helpURL = new URL(menuConfig[opts.menuName]['helpSection']);
  window.open(helpURL.toString());
  return state;
}

function menuTextOpsSwitchInner(state: Ace.State, current: string) {
  return {
    ...state,
    textOpsInnerMenuCurrent: current,
  };
}

function menuRulerOpsSwitchInner(state: Ace.State, current: string) {
  return {
    ...state,
    rulerOpsInnerMenuCurrent: current,
  };
}

export {
  menuMove,
  menuClose,
  menuHelp,
  menuOpen,
  menuSetFocus,
  menuRulerOpsSwitchInner,
  menuStartDrag,
  menuTextOpsSwitchInner,
  menuEndDrag,
  menuSpawn,
  menuFixOutOfBounds,
};
