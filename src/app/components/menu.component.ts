import {h} from 'hyperapp';
import * as menus from './menus.component';
import {
  menuEndDrag,
  menuStartDrag,
  menuSetFocus,
} from '../actions/menu.actions';
import {
  aceAddTippy,
  aceSpeakTooltip,
  handleButtonNavigation,
} from '../actions/ace.actions';
import * as actions from '../actions/menu.actions';

const menuConfigs = new Map([
  ['tts', {title: 'Text to Speech', menu: menus.ttsMenu}],
  ['textOptions', {title: 'Text Options', menu: menus.textOptionsMenu}],
  ['magnifier', {title: 'Magnifier Options', menu: menus.magMenu}],
  ['masking', {title: 'Screen Masking Options', menu: menus.maskMenu}],
  ['rulerOptions', {title: 'Ruler Options', menu: menus.rulerOptionsMenu}],
  ['speechRecognition', {title: 'Speech Recognition', menu: menus.srMenu}],
  ['pageTranslate', {title: 'Page Translation', menu: menus.ptMenu}],
]);

const placeholderEl = () => h('ab-placeholder');

const menu = (state: Ace.State, menuName: string) => {
  const menuConfig = menuConfigs.get(menuName) || {
    title: '',
    menu: placeholderEl,
  };

  return h(
    'ab-menu',
    {
      'aria-label': `${menuConfig.title} Menu`,
      class: 'ab-menu ab-draggable',
      id: `ab-menu-${menuName}`,
      style: {
        left: `${state.menus[menuName].menuPosX}px`,
        top: `${state.menus[menuName].menuPosY}px`,
      },
    },
    [
      h(
        'ab-menu-header',
        {
          'aria-label': 'Hold left mouse button to drag the menu',
          class: 'ab-menu-header ab-flex',
        },
        [
          h(
            'ab-menu-drag-handle',
            {
              class: 'ab-menu-drag-handle',
              onmousedown: [menuStartDrag, ev => ({menuName, ev})],
              ontouchstart: [menuStartDrag, ev => ({menuName, ev})],
              onmouseup: menuEndDrag,
              ontouchend: menuEndDrag,
              ontouchcancel: menuEndDrag,
            },
            h(
              'ab-menu-header-text',
              {
                class: 'ab-menu-header-text',
              },
              menuConfig.title
            )
          ),
          h('ab-menu-buttons-container', {class: 'ab-menu-buttons-container'}, [
            h(
              'ab-menu-help-button',
              {
                'aria-label': 'Feature Help',
                class: 'ab-menu-help',
                id: 'ab-menu-help',
                onclick: () => [actions.menuHelp, {menuName}],
                onmouseover: [
                  aceAddTippy,
                  {
                    id: '#ab-menu-help',
                    content: `Would you like some help on ${menuConfig.title}?`,
                  },
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {
                    id: '#ab-menu-help',
                    content: `Would you like some help on ${menuConfig.title}?`,
                  },
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': 'true',
                  class: 'ab-icon ab-icon-help',
                }),
              ]
            ),
            h(
              'ab-menu-close-button',
              {
                'aria-label': `Close ${menuConfig.title} Menu`,
                class: 'ab-menu-close',
                id: 'ab-menu-close',
                onclick: () => [actions.menuClose, {menuName}],
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-menu-close', content: 'Close Menu'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-menu-close', content: 'Close Menu'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabIndex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': 'true',
                  class: 'ab-icon ab-icon-cross',
                }),
              ]
            ),
          ]),
        ]
      ),
      menuConfig.menu(state),
    ]
  );
};

export default menu;
export {menu};
