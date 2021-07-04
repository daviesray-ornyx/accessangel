import {h} from 'hyperapp';
import buttonArea from './components/button_area.component';
import {hideButton} from './components/buttons.component';
import menuArea from './components/menu_area.component';
import funcArea from './components/function_area.component';
import settingsMenu from './components/settings.component';
import aboutMenu from './components/about.component';
import isMobile from 'is-mobile';
import simplifyEl from './components/simplify.component';

const innerBar = state => {
  const mobile = isMobile({
    tablet: true,
    featureDetect: true,
  });

  return h('ab-inner-bar', {class: 'ab-bar ab-growable'}, [
    !mobile &&
      h('ab-logo', {class: 'ab-logo', 'aria-label': 'Ace logo'}, [
        h('ab-logo-img', {class: 'ab-logo-img', alt: 'Ace Logo'}),
      ]),
    h(
      'ab-button-area-container',
      {class: 'ab-button-area-container ab-bar-container ab-growable'},
      [buttonArea(state)]
    ),
  ]);
};

const underBar = state => {
  return h('ab-underbar', {class: 'ab-underbar'}, [
    h('ab-hide-button-container', {class: 'ab-hide-button-container ab-flex'}, [
      hideButton(state),
    ]),
  ]);
};

/**
 * Main container for all Ace elements
 */
const mainView = state => {
  return h('ab-grid', {class: `ab-bar-grid ${state.aceTheme}`}, [
    innerBar(state),
    underBar(state),
    funcArea(state),
    menuArea(state),
    settingsMenu(state),
    aboutMenu(state),
    simplifyEl(state),
  ]);
};

export default mainView;
