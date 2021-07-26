import {app} from 'hyperapp';
import initState from './state/ace.state';
import view from './main.view';
import floatingButtonView from './floatingButton.view';
import {apiSendEvent} from './actions/api.actions';
import {
  aceMoveBody,
  acePushFixedNav,
  aceResetFixedNav,
} from './actions/ace.actions';
import fxResize from './fx/resize.fx';
import {fxHydrate} from './fx/hydrate.fx';
import {
  subKeyDownHelper,
  subKeyUpHelper,
  subMouseEventHelper,
} from './subscriptions/keyboard_shortcuts.subscriptions';

declare global {
  // tslint:disable-next-line
  interface Window {
    aceRuntimeProxy: AceController;
    pickr: Pickr;
  }
}

// Custom Element used as the container for Ace.
class AceElement extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('ace-app', AceElement);

// Entry point for Ace.
class AceController {
  public version = '1.0.5';

  // Element in page that activates Ace.
  public buttonElement: Element | undefined;

  // Element that will contain Ace.
  public bindTo: Element;

  // A reference to the Ace element when rendered.
  public mainElement: HTMLElement | undefined;

  // A reference to the floating button if enabled.
  public floatingButton: HTMLElement | undefined;

  // Floating button position if enabled.
  public floatingButtonPosition = '';

  // Floating button default offset
  public floatingButtonOffsetDefault = 20;

  // Floating button offset if enabled.
  public floatingButtonOffset = 0;

  // Copy of ace state for interop.
  private aceState: Ace.State = initState;

  // Increment state version to clear saved state on clients.
  private aceStateVersion = '19';

  // Support pushing fixed navigation below AccessAngel for compatibility.
  public fixedNavigationSelector = '';

  // Position of Accessabar on the page.
  public position: string;

  // Should AccessAngel fill the width of the containing element.
  public fillWidth: boolean;

  /**
   * If enabled, the margin top of the document's body
   * will equal Ace's height. This will move the page's content
   * down in order to make space for Ace.
   */
  public moveBody: boolean;

  /**
   * rendered is true when hyperapp's app function has been called.
   * loaded is true when all ace DOM has loaded.
   */
  private rendered = false;
  public loaded = false;

  // IDToken for API's
  public authToken: string;

  constructor({
    buttonFloatPosition = '',
    buttonFloatOffset = 0,
    enableButton = '',
    bindTo = 'body',
    position = 'top',
    fillWidth = false,
    fixedNavigation,
    moveBody,
    IDToken,
  }: Ace.AceConfig) {
    // Allows easy access during runtime to separate parts of the code
    window.aceRuntimeProxy = this;

    // -- IDToken --

    if (!IDToken) {
      throw Error('[AccessAngel] Error: no IDToken provided');
    }

    this.authToken = IDToken;

    // -- enableButton --
    if (enableButton) {
      const buttonEl = document.querySelector(String(enableButton));
      if (!buttonEl) {
        throw Error('[Ace] Error: Cannot find element with the given id');
      }

      this.buttonElement = buttonEl;

      this.initEnableButton();
    }

    // -- buttonFloat --

    if (buttonFloatOffset > 0) {
      this.floatingButtonOffset = buttonFloatOffset;
    }

    if (buttonFloatPosition) {
      this.floatingButtonPosition = buttonFloatPosition;
      this.createFloatingButton();
    }

    // -- bindTo --
    const strBindTo = String(bindTo);
    const bindEl = document.querySelector(strBindTo);
    if (!bindEl) {
      throw Error(
        '[Ace] Error: Cannot find element to bind to with the given id'
      );
    }

    this.bindTo = bindEl;

    // -- position --
    const positions = new Set(['top', 'bottom', 'none']);

    if (!positions.has(position)) {
      throw Error(
        `[Ace] Error: The given position '${position}' is not valid. Options are: top, bottom.`
      );
    }

    this.position = position;

    // -- fillWidth --

    this.fillWidth = Boolean(fillWidth);

    // -- fixedNavigation --

    if (fixedNavigation) {
      this.fixedNavigationSelector = String(fixedNavigation);
    }

    // -- moveBody --
    switch (typeof moveBody) {
      default:
      case 'undefined':
        if (strBindTo === 'body') {
          this.moveBody = true;
          break;
        }

        this.moveBody = false;
        break;

      case 'boolean':
        this.moveBody = moveBody;
        break;
    }

    // -- check if opened --
    this.restoreRenderState();
  }

  public open() {
    this.openSilent();

    apiSendEvent('AceOpened');
  }

  private openSilent() {
    this.removeFloatingButton();
    this.toggleShow();
    this.createSpace();
  }

  public close() {
    if (this.mainElement?.parentElement) {
      this.mainElement.parentElement.removeChild(this.mainElement);
    }

    if (this.moveBody) {
      document.body.style.marginTop = '0';
    }

    this.disableRenderState();

    if (this.floatingButtonPosition) {
      this.createFloatingButton();
    }

    delete this.mainElement;

    const event = new CustomEvent('aceClose');
    window.dispatchEvent(event);
  }

  private enableRenderState() {
    this.rendered = true;

    if (!window.localStorage) {
      return;
    }

    window.localStorage.setItem('aceRendered', 'true');
  }

  private disableRenderState() {
    this.rendered = false;

    if (!window.localStorage) {
      return;
    }

    window.localStorage.setItem('aceRendered', 'false');
  }

  private restoreRenderState() {
    if (this.rendered && this.mainElement) {
      return;
    }

    if (!window.localStorage) {
      return;
    }

    const storedRenderState = window.localStorage.getItem('aceRendered');

    if (storedRenderState === 'true') {
      this.openSilent();
    }
  }

  public saveState(state: Ace.State) {
    this.aceState = state;

    if (!window.localStorage) {
      return;
    }

    const stateObj = {
      state: {
        ...state,
        aceTooltips: [],
      },
      version: this.aceStateVersion,
    };

    window.localStorage.setItem('aceLocalState', JSON.stringify(stateObj));
  }

  private getState(): Ace.State {
    if (!window.localStorage) {
      return initState;
    }

    const localState = window.localStorage.getItem('aceLocalState');

    if (!localState) {
      return initState;
    }

    const parsedState: Ace.SavedState = JSON.parse(localState);

    if (parsedState.version !== this.aceStateVersion) {
      return initState;
    }

    const stateKeys = Object.keys(parsedState.state);
    const initStateKeys = Object.keys(initState);

    // check state schema is intact and shallow check.
    if (stateKeys.length !== initStateKeys.length) {
      return initState;
    }

    for (let i = 0; i < initStateKeys.length; i++) {
      if (stateKeys.indexOf(initStateKeys[i]) === -1) {
        return initState;
      }
    }

    return parsedState.state;
  }

  private createFloatingButtonApp(containerEl: HTMLElement) {
    const appConfig = {
      view: floatingButtonView,
      init: {},
      node: containerEl,
    };

    return app(appConfig);
  }

  private createApp(containerEl: HTMLElement) {
    const state = this.getState();

    const appConfig = {
      view,
      init: [state, fxHydrate(state), fxResize()],
      node: containerEl,
      subscriptions: (st: Ace.State) => {
        this.saveState(st);
        return [subKeyDownHelper(), subKeyUpHelper(), subMouseEventHelper()];
      },
    };

    return app(appConfig);
  }

  private createSpace() {
    if (this.fixedNavigationSelector) {
      window.addEventListener('scroll', acePushFixedNav, {passive: true});
      window.addEventListener('aceClose', aceResetFixedNav);
    }

    if (this.loaded) {
      this.moveBody && aceMoveBody();
      acePushFixedNav();
      return;
    }

    window.addEventListener('aceLoad', aceMoveBody);
    window.addEventListener('aceLoad', acePushFixedNav);
  }

  /**
   * Handles rendering of ace.
   * Fires a CustomEvent after rendering ace if needed.
   */
  private toggleShow() {
    if (!this.rendered) {
      const renderFunc = () => {
        const containerEl = this.setContainerStyle(new AceElement());
        const haBind = document.createElement('div');

        containerEl.id = 'accessabar';
        containerEl.setAttribute('aria-label', 'Start of Ace toolbar.');
        containerEl.style.width = this.fillWidth
          ? '100%'
          : `${window.innerWidth}px`;
        this.mainElement = containerEl;
        this.bindTo.insertAdjacentElement('afterbegin', containerEl);
        containerEl.appendChild(haBind);

        this.createApp(haBind);
        this.enableRenderState();

        const eventFunc = () => {
          const abGrid = containerEl?.firstChild;
          if (!abGrid) {
            setTimeout(eventFunc, 250);
            return;
          }

          if (abGrid.childNodes.length < 6) {
            setTimeout(eventFunc, 250);
            return;
          }

          const event = new CustomEvent('aceLoad');
          window.dispatchEvent(event);
          this.loaded = true;
        };

        setTimeout(eventFunc, 250);
      };

      // Check page if page is ready to render Accessabar
      if (
        document.readyState === 'interactive' ||
        document.readyState === 'complete'
      ) {
        renderFunc();

        return;
      }

      // If page is not ready, wait until it is
      document.addEventListener('DOMContentLoaded', renderFunc.bind(this));
      return;
    }
  }

  /**
   * Removes the floating button for opening AccessAngel.
   */

  private removeFloatingButton() {
    if (this.floatingButton) {
      document.body.removeChild(this.floatingButton);
    }
  }

  /**
   * Creates a floating button for opening AccessAngel.
   */

  private createFloatingButton() {
    const floatingButtonContainerEl = document.createElement(
      'ab-floating-button-container'
    );
    const haBind = document.createElement('div');
    floatingButtonContainerEl.appendChild(haBind);

    this.createFloatingButtonApp(haBind);
    this.floatingButton = floatingButtonContainerEl;
    this.initFloatingButton();

    switch (this.floatingButtonPosition) {
      case 'top-right':
        floatingButtonContainerEl.classList.add('ab-fb-top-right');
        floatingButtonContainerEl.style.top = `${
          this.floatingButtonOffsetDefault + this.floatingButtonOffset
        }px`;
        floatingButtonContainerEl.style.right = `${this.floatingButtonOffsetDefault}px`;
        document.body.appendChild(floatingButtonContainerEl);
        break;
      case 'top-left':
        floatingButtonContainerEl.classList.add('ab-fb-top-left');
        floatingButtonContainerEl.style.top = `${
          this.floatingButtonOffsetDefault + this.floatingButtonOffset
        }px`;
        floatingButtonContainerEl.style.left = `${this.floatingButtonOffsetDefault}px`;
        document.body.appendChild(floatingButtonContainerEl);
        break;
      case 'bottom-right':
        floatingButtonContainerEl.classList.add('ab-fb-bottom-right');
        floatingButtonContainerEl.style.bottom = `${
          this.floatingButtonOffsetDefault + this.floatingButtonOffset
        }px`;
        floatingButtonContainerEl.style.right = `${this.floatingButtonOffsetDefault}px`;
        document.body.appendChild(floatingButtonContainerEl);
        break;
      case 'bottom-left':
        floatingButtonContainerEl.classList.add('ab-fb-bottom-left');
        floatingButtonContainerEl.style.bottom = `${
          this.floatingButtonOffsetDefault + this.floatingButtonOffset
        }px`;
        floatingButtonContainerEl.style.left = `${this.floatingButtonOffsetDefault}px`;
        document.body.appendChild(floatingButtonContainerEl);
        break;
      default:
        throw Error(
          `[Ace] Error: position '${this.floatingButtonPosition}' is not valid`
        );
    }
  }

  /**
   * Sets the dynamic styles of the container element.
   */

  private setContainerStyle(containerEl: AceElement) {
    switch (this.position) {
      default:
      case 'top':
        containerEl.style.position = 'fixed';
        containerEl.style.top = '0';
        break;
      case 'bottom':
        containerEl.style.position = 'fixed';
        containerEl.style.bottom = '0';
        break;
      case 'none':
        break;
    }

    return containerEl;
  }

  /**
   * Adds an click event listener to the enable button.
   */
  private initEnableButton() {
    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', this.open.bind(this));
    }
  }

  /**
   * Adds an click event listener to the enable button.
   */
  private initFloatingButton() {
    if (this.floatingButton) {
      this.floatingButton.addEventListener('click', this.open.bind(this));
    }
  }
}

export default AceController;
export {AceController};
