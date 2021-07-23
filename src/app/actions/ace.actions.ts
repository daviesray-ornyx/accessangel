import Pickr from '@simonwep/pickr';
import tippy, {Tippy} from 'tippy.js';
import {fxAceSpeakTooltip} from '../fx/ace.fx';
import tabConfig from '../../config/tab.config.json5';
import {functionNameConfig, fxMenuClose} from '../fx/shortcuts.fx';
import {fxMenuFocus} from '../fx/menu.fx';
import {fxMenuOpen} from '../fx/shortcuts.fx';
import {menuFixOutOfBounds} from './menu.actions';

function aceMoveBody() {
  const {mainElement} = window.aceRuntimeProxy;

  if (mainElement) {
    const rect = mainElement.getBoundingClientRect();
    document.body.style.marginTop = `${rect.height}px`;
  }
}

function aceChangeWidth() {
  const {mainElement, fillWidth} = window.aceRuntimeProxy;

  if (fillWidth) {
    return;
  }

  if (mainElement) {
    mainElement.style.width = `${window.innerWidth}px`;
  }
}

function acePushFixedNav() {
  const {fixedNavigationSelector, mainElement} = window.aceRuntimeProxy;

  if (!fixedNavigationSelector) {
    return;
  }

  const fixedNavEl = document.querySelector(fixedNavigationSelector);

  if (!fixedNavEl || !mainElement) {
    return;
  }

  const aceRect = mainElement.getBoundingClientRect();
  const navRect = fixedNavEl.getBoundingClientRect();

  if (navRect.y >= aceRect.y + aceRect.height) {
    return;
  }

  (fixedNavEl as HTMLElement).style.top = `${aceRect.height + 25}px`;
}

function aceResetFixedNav() {
  const {fixedNavigationSelector} = window.aceRuntimeProxy;

  if (!fixedNavigationSelector) {
    return;
  }

  const fixedNavEl = document.querySelector(fixedNavigationSelector);

  if (!fixedNavEl) {
    return;
  }

  (fixedNavEl as HTMLElement).style.top = '0px';
}

function aceResize(state: Ace.State) {
  const {aceHidden} = state;
  const {mainElement} = window.aceRuntimeProxy;

  if (!mainElement) {
    return state;
  }

  if (aceHidden) {
    const rect = mainElement.getBoundingClientRect();

    mainElement.style.top = `-${rect.height - 2}px`;

    return state;
  }

  aceChangeWidth();
  aceMoveBody();
  return [
    state,
    [
      (dispatch, props) => {
        dispatch(props.action);
      },
      {
        action: menuFixOutOfBounds,
      },
    ],
  ];
}

function acePruneFuncs(
  el: HTMLElement,
  aceEdited: string,
  config: Ace.FuncConfig
) {
  const funcNames = aceEdited.split(' ') || [];

  if (funcNames.indexOf(config.editName) !== -1 && funcNames.length > 1) {
    const index = funcNames.indexOf(config.editName);
    funcNames.splice(index, 1);
    el.setAttribute('ace-edited', funcNames.join(' '));
  } else {
    el.removeAttribute('ace-edited');
  }
}

function aceHide(state: Ace.State) {
  const {aceHidden} = state;
  const {
    mainElement,
    moveBody,
    fixedNavigationSelector,
  } = window.aceRuntimeProxy;

  if (!mainElement) {
    return state;
  }

  if (aceHidden) {
    mainElement.style.top = '0';

    if (moveBody) {
      aceMoveBody();
    }

    return {...state, aceHidden: false, menusHidden: false};
  }

  const bar = mainElement.querySelector('.ab-bar');

  if (!bar) {
    return state;
  }

  // Get height of Ace, then push Ace above the window view
  // by that height - 2px (allows a small amount of Ace to still show).
  const aceRect = bar.getBoundingClientRect();
  mainElement.style.top = `-${aceRect.height - 2}px`;

  // Pushing up fixed nav
  if (fixedNavigationSelector) {
    const fixedNavEl = document.querySelector(fixedNavigationSelector);

    if (!fixedNavEl) {
      return;
    }

    const navRect = fixedNavEl.getBoundingClientRect();

    if (navRect.y <= aceRect.y + aceRect.height) {
      return;
    }

    (fixedNavEl as HTMLElement).style.top = `-${aceRect.height - 25}px`;
  }

  if (moveBody) {
    document.body.style.marginTop = '2px';
  }

  return {...state, aceHidden: true, menusHidden: true};
}

function getParents(): Set<HTMLElement> {
  const elements = document.body.childNodes;
  const taggedElements: ChildNode[] = [];
  const textNodes: Node[] = [];
  const parentElements: Set<HTMLElement> = new Set();

  // Filter through immediate child elements of body
  // and get elements to walk
  for (const el of elements) {
    // Do not add ace or elements with no children
    if (
      el !== window.aceRuntimeProxy.mainElement &&
      el.childNodes.length !== 0
    ) {
      taggedElements.push(el);
    }
  }

  for (const el of taggedElements) {
    // Will find all text nodes in element
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    // Push each text node found into array
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
  }

  for (const node of textNodes) {
    const text = (node.textContent || '').trim();

    // Do not add empty text nodes or line feeds in HTML
    if (text === '' || text === '\n') {
      continue;
    }

    const parent = node.parentElement;

    if (!parent) {
      continue;
    }

    // Do not add tippy tooltips
    if (parent.classList.contains('tippy-content')) {
      continue;
    }

    // filter out unneeded meta elements
    if (
      parent.tagName === 'SCRIPT' ||
      parent.tagName === 'HEAD' ||
      parent.tagName === 'LINK' ||
      parent.tagName === 'META' ||
      parent.tagName === 'STYLE'
    ) {
      continue;
    }

    if (parentElements.has(parent)) {
      // Do not add duplicates
      continue;
    }

    parentElements.add(parent);
  }

  return parentElements;
}

function editLoop(
  currentConfig: Ace.FuncConfig,
  modifier: string,
  modifierValue: string | number
) {
  const parentElements = getParents();

  for (const el of parentElements) {
    const abarEdited = el.getAttribute('ace-edited');

    if (!abarEdited) {
      el.setAttribute('ace-edited', currentConfig.editName);
      el.setAttribute(
        currentConfig.attrNames.orig,
        el.style[modifier] || 'none'
      );
    }

    if (
      abarEdited &&
      abarEdited.split(' ').indexOf(currentConfig.editName) === -1
    ) {
      const funcNames = abarEdited.split(' ');

      funcNames.push(currentConfig.editName);
      el.setAttribute('ace-edited', funcNames.join(' '));
      el.setAttribute(
        currentConfig.attrNames.orig,
        el.style[modifier] || 'none'
      );
    }

    el.style[modifier] = modifierValue;
  }
}

function editLoopComputed(
  currentConfig: Ace.FuncConfig,
  modifier: string,
  modifierStep: number,
  modifierCount?: number
) {
  const parentElements = getParents();

  // Loops over elements and changes text size for each element
  for (const el of parentElements) {
    // Get exact computed size for accurate results
    const computed = window.getComputedStyle(el)[modifier];
    // fix for letter-spacing when set to normal
    const size: string = computed === 'normal' ? '0px' : computed;
    const sizeNumeric: number = parseFloat(size);

    if (size) {
      const abarEdited = el.getAttribute('ace-edited');

      // Add attribute to element to flag edits from Ace.
      // If 'font-size' was set inline, it is added to 'ace-orig-font-size'.
      if (!abarEdited) {
        el.setAttribute('ace-edited', currentConfig.editName);
        el.setAttribute(
          currentConfig.attrNames.orig,
          el.style[modifier] || 'none'
        );
        el.setAttribute(currentConfig.attrNames.origComputed, size);
      }

      if (
        abarEdited &&
        abarEdited.split(' ').indexOf(currentConfig.editName) === -1
      ) {
        const funcNames = abarEdited.split(' ');

        funcNames.push(currentConfig.editName);
        el.setAttribute('ace-edited', funcNames.join(' '));
        el.setAttribute(
          currentConfig.attrNames.orig,
          el.style[modifier] || 'none'
        );
        el.setAttribute(currentConfig.attrNames.origComputed, size);
      }

      if (typeof modifierCount === 'undefined') {
        el.style[modifier] = `${sizeNumeric + modifierStep}px`;
        continue;
      }

      const origComputed = el.getAttribute(
        currentConfig.attrNames.origComputed
      );

      if (origComputed) {
        const origComputedNumeric: number = parseFloat(origComputed);

        el.style[modifier] = `${
          origComputedNumeric + modifierStep * modifierCount
        }px`;
      }
    }
  }
}

function aceCreatePickr(
  state: Ace.State,
  opts: {id: string; action: (state: Ace.State, colour: string) => unknown}
) {
  window.pickr = new Pickr({
    components: {
      hue: true,
      interaction: {
        clear: false,
        cmyk: false,
        hex: true,
        hsla: false,
        hsva: false,
        input: true,
        rgba: true,
        save: true,
      },
      opacity: true,
      preview: true,
    },
    el: opts.id,
    theme: 'nano',
    useAsButton: true,
  });

  return [
    state,
    [
      (dispatch, props) => {
        window.pickr.on('save', hsva => {
          dispatch(props.action, hsva.toHEXA().toString());
        });
      },
      {
        action: opts.action,
      },
    ],
  ];
}

function aceAddTippy(state: Ace.State, opts: {id: string; content: string}) {
  if (!(state.aceTooltips instanceof Map)) {
    state.aceTooltips = new Map<string, string>();
  }

  const tooltipContent = state.aceTooltips.get(opts.id);
  if (tooltipContent && tooltipContent === opts.content) {
    return state;
  }

  tippy(`#accessabar ${opts.id}`, {
    arrow: true,
    content: opts.content,
    placement: 'bottom',
    theme: 'ab',
  });

  state.aceTooltips.set(opts.id, opts.content);
  return {
    ...state,
    aceTooltips: state.aceTooltips,
  };
}

function aceSpeakTooltip(
  state: Ace.State,
  opts: {id: string; content: string}
) {
  return [state, state.aceSpeakTooltips && fxAceSpeakTooltip(state, opts)];
}

function aceSpeakTooltipsToggle(state: Ace.State) {
  return {
    ...state,
    aceSpeakTooltips: !state.aceSpeakTooltips,
  };
}

function findNextEl(state: Ace.State, target: HTMLElement) {
  if (state.tabContainerCurrent === undefined) {
    return;
  }

  const tabbingContainer = document.getElementById(state.tabContainerCurrent);
  if (!state.tabContainerActive) {
    // Not yet into the correct tabbing container
    const firstFocusableElement = tabbingContainer?.querySelector(
      "[tabindex='0']"
    ); // get the first element in the container
    return firstFocusableElement;
  }
  const tabIndexElements = tabbingContainer?.querySelectorAll("[tabindex='0']");

  if (tabIndexElements === undefined) {
    return;
  }
  let found = false;
  for (const elementIndex in tabIndexElements) {
    if (tabIndexElements[elementIndex].classList === undefined) {
      continue;
    }
    if (
      found &&
      !tabIndexElements[elementIndex].classList.contains('ab-hide')
    ) {
      return tabIndexElements[elementIndex];
    }
    if (tabIndexElements[elementIndex] === target) {
      found = true;
    }
  }
  return; // No tab element within container. Check if tabContainer and see how to handle.
}

function findPrevEl(state: Ace.State, target: HTMLElement) {
  if (state.tabContainerCurrent === undefined) {
    return;
  }

  const tabbingContainer = document.getElementById(state.tabContainerCurrent);
  if (!state.tabContainerActive) {
    return;
  }
  const tabIndexElements = tabbingContainer?.querySelectorAll("[tabindex='0']");

  if (tabIndexElements === undefined) {
    return;
  }
  let found = false;
  for (let i = tabIndexElements?.length - 1; i >= 0; i--) {
    if (tabIndexElements[i] === target) {
      found = true;
      continue; // move on to the next iteration
    }
    if (found && !tabIndexElements[i].classList.contains('ab-hide')) {
      return tabIndexElements[i]; // Item returned cannot be hidden
    }
  }
  return; // No next container exists, hence we stop searching for nextEl.
}

function handleSelectNavigation(state: Ace.State, event: KeyboardEvent) {
  // this will enable us handle keycode as well
  event.preventDefault();
  const selectElement = event.target as HTMLElement;

  const {code, target} = event;
  if (!code || !target) {
    return state;
  }

  let tabElement = '';
  const tabElementsIds: string[] = [];
  for (const key in tabConfig) {
    if (tabConfig[key]['id'] === selectElement.id) {
      tabElement = tabConfig[key];
    }
    tabElementsIds.push(tabConfig[key]['id']);
  }

  const funcName = tabElement['function'];
  if (code === 'Enter') {
    return [state, functionNameConfig[funcName](state)];
  }
  return state; // this is if no action is done
}

function handleActionButtonKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement
) {
  const {code} = event;
  const funcName = tabElement['function'];
  switch (code) {
    case 'Enter':
      return [state, functionNameConfig[funcName](state)];
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleMenuButtonKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement
) {
  const {code, target} = event;
  switch (code) {
    case 'Enter':
      for (const menuName in state.menus) {
        if (
          state.menus[menuName].menuActive &&
          menuName === tabElement['menuName']
        ) {
          return state;
        }
      }

      const newState = {
        ...state,
        tabContainerActive: false,
        tabContainerCurrent: tabElement['containerId'],
        tabContainerActivator: (target as HTMLElement).id,
      };

      if (tabElement['menuName'] !== undefined) {
        return [
          newState,
          fxMenuOpen(
            newState,
            tabElement['menuName'],
            tabElement['title'],
            tabElement['defaultFunc']
          ),
          fxMenuFocus(newState, tabElement['menuName']),
        ];
      }
      return [
        newState,
        fxMenuOpen(
          newState,
          tabElement['menuName'],
          tabElement['title'],
          tabElement['defaultFunc']
        ),
      ];
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleMenuHeaderButtonKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement
) {
  const {code} = event;
  const funcName = tabElement['function'];
  switch (code) {
    case 'Enter':
      for (const name in state.menus) {
        if (state.menus[name].menuActive) {
          return [state, functionNameConfig[funcName](state, name)];
        }
      }
      return state;
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleTabButtonKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement: any
) {
  const {code, target} = event;
  const funcName = tabElement['function'];
  const newState = {
    ...state,
    tabContainerActive: false,
    tabContainerCurrent: tabElement['containerId'],
    tabContainerActivator: (target as HTMLElement).id,
    tabParentContainer: state.tabContainerCurrent,
  };
  switch (code) {
    case 'Enter':
      return [
        newState,
        functionNameConfig[funcName](newState, tabElement['option']),
      ];
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleLisboxKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement
) {
  const {code} = event;
  const funcName = tabElement['function'];
  switch (code) {
    case 'Enter':
      return [state, functionNameConfig[funcName](state)];
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleColorSelectorKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement
) {
  const {code} = event;
  const funcName = tabElement['function'];
  switch (code) {
    case 'Enter':
      return [state, functionNameConfig[funcName](state, tabElement['option'])];
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleCommoMenuButtonsKeyPress(
  state: Ace.State,
  event: KeyboardEvent,
  tabElement
) {
  // settings, about, close menu buttons
  const {code, target} = event;
  const funcName = tabElement['function'];
  const newState = {
    ...state,
    tabContainerActive: false,
    tabContainerCurrent: tabElement['containerId'],
    tabContainerActivator: (target as HTMLElement).id,
  };
  switch (code) {
    case 'Enter':
      return [newState, functionNameConfig[funcName](newState)];
    case 'Esc':
      return handleEscKeyPress(state);
    case 'Tab':
      return handleTabKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

function handleEscKeyPress(state: Ace.State) {
  if (state.menus !== undefined && Object.keys(state.menus).length > 0) {
    const menuName = Object.keys(state.menus)[0];
    const newState = {
      ...state,
      tabContainerCurrent: 'ab-button-area',
      tabContainerActivator: '',
    };
    document.getElementById(state.tabContainerActivator)?.focus();
    return [newState, fxMenuClose(newState, menuName)];
  }
  return {
    ...state,
    settingsHidden: true,
    aboutHidden: true,
    feedbackActive: false,
  };
}

function handleTabKeyPress(state: Ace.State, event: KeyboardEvent, tabElement) {
  const {target} = event;
  let newState = state;
  if (!state.tabContainerActive) {
    newState = {
      ...newState,
      tabContainerActive: true,
    };
  }

  const focusElement = event.shiftKey
    ? findPrevEl(state, target as HTMLElement)
    : findNextEl(state, target as HTMLElement);

  let tabContainerActivatorElement;
  switch (focusElement) {
    case undefined:
      // Get tab container activator element
      for (const key in tabConfig) {
        if (tabConfig[key]['id'] === state.tabContainerActivator) {
          tabContainerActivatorElement = tabConfig[key];
        }
      }

      if (tabContainerActivatorElement === undefined) {
        return newState;
      }
      document.getElementById(state.tabContainerActivator)?.focus();
      if (tabContainerActivatorElement['type'] === 'tab button') {
        newState = {
          ...state,
          tabContainerActive: true,
          tabContainerCurrent: state.tabParentContainer,
          tabContainerActivator: '',
        };
      } else if (tabElement['type'] === 'menu button') {
        newState = {
          ...newState,
          tabContainerActive: false,
          tabContainerCurrent: 'ab-button-area',
          tabContainerActivator: '',
        };
      }
      return newState;
    default:
      (focusElement as HTMLElement).focus();
      return newState;
  }
}

function handleButtonNavigation(state: Ace.State, event: KeyboardEvent) {
  // eslint-disable-next-line prefer-const
  event.preventDefault();
  const {code, target} = event;
  if (!code || !target) {
    return state;
  }

  let tabElement = '';
  const tabElementsIds: string[] = [];
  for (const key in tabConfig) {
    if (tabConfig[key]['id'] === (target as HTMLElement).id) {
      tabElement = tabConfig[key];
    }
    tabElementsIds.push(tabConfig[key]['id']);
  }

  switch (tabElement['type']) {
    case 'action button':
      return handleActionButtonKeyPress(state, event, tabElement);
    case 'menu button':
      return handleMenuButtonKeyPress(state, event, tabElement);
    case 'menu header button':
      return handleMenuHeaderButtonKeyPress(state, event, tabElement);
    case 'tab button':
      return handleTabButtonKeyPress(state, event, tabElement);
    case 'listbox':
      return handleLisboxKeyPress(state, event, tabElement);
    case 'color selector':
      return handleColorSelectorKeyPress(state, event, tabElement);
    case 'settings menu button':
      return handleCommoMenuButtonsKeyPress(state, event, tabElement);
    case 'about menu button':
      return handleCommoMenuButtonsKeyPress(state, event, tabElement);
    case 'close menu button':
      return handleCommoMenuButtonsKeyPress(state, event, tabElement);
    default:
      return state;
  }
}

export {
  aceResize,
  aceMoveBody,
  acePruneFuncs,
  aceHide,
  getParents,
  editLoop,
  editLoopComputed,
  aceCreatePickr,
  aceAddTippy,
  aceSpeakTooltipsToggle,
  aceSpeakTooltip,
  handleButtonNavigation,
  handleSelectNavigation,
  acePushFixedNav,
  aceResetFixedNav,
};
