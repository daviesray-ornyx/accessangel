import {h} from 'hyperapp';
import {customList, customListItemFactory} from './custom_list.component';
import ISO6391 from 'iso-639-1';
import {
  settingsClose,
  settingsToggleSRLangList,
  settingsToggleTTSList,
  settingsChangeTheme,
  settingsToggleTTSGenderList,
} from '../actions/settings.actions';
import {ttsChangeGender, ttsChangeVoice} from '../actions/tts.actions';
import {srChangeLang} from '../actions/sr.actions';
import {switchEl} from './menus.component';
import {
  aceSpeakTooltipsToggle,
  handleButtonNavigation,
} from '../actions/ace.actions';
import {aceAddTippy, aceSpeakTooltip} from '../actions/ace.actions';
import isMobile from 'is-mobile';

const settingsHeader = ({settingsHidden}) => {
  return h('ab-settings-header', {class: 'ab-modal-header'}, [
    h(
      'ab-logo',
      {
        class: 'ab-modal-logo',
        'aria-label': 'AccessAngel logo',
      },
      [h('ab-logo-img', {class: 'ab-logo-img-word', alt: 'AccessAngel Logo'})]
    ),
    h('ab-settings-header-title', {class: 'ab-modal-header-title'}, 'Settings'),
    h(
      'ab-settings-close-button',
      {
        'aria-controls': 'ab-settings',
        'aria-label': 'Close Settings',
        'aria-pressed': String(settingsHidden),
        class: 'ab-modal-close-button',
        id: 'ab-settings-close-button',
        onclick: settingsClose,
        onkeydown: settingsClose,
        onmouseover: [
          aceAddTippy,
          {id: '#ab-settings-close-button', content: 'Close Settings Menu'},
        ],
        onmouseenter: [
          aceSpeakTooltip,
          {id: '#ab-settings-close-button', content: 'Close Settings Menu'},
        ],
        role: 'button',
        tabindex: 0,
      },
      [
        h('ab-icon', {
          'aria-hidden': 'true',
          class: 'ab-icon ab-icon-cross',
        }),
      ]
    ),
  ]);
};

const settingsTTSSection = ({
  ttsVoices,
  ttsVoiceListActive,
  ttsGenderListActive,
  ttsCurrentVoiceName,
  ttsGenders,
  ttsGender,
}: Ace.State) => {
  const factoryCfgVoices: Ace.ListItem[] = [];
  const factoryCfgGenders: Ace.ListItem[] = [];
  let customListVoices = h(
    'ab-setting-placeholder',
    {
      class: 'ab-modal-placeholder',
      tabindex: 0,
    },
    ['Please open Text to Speech to choose a voice.']
  );

  if (ttsVoices && ttsVoices.length > 0) {
    for (const [key, obj] of ttsVoices.entries()) {
      factoryCfgVoices.push({
        key,
        name: obj.name,
        action: (state, actionKey: number) => {
          return [
            state,
            [
              (dispatch, props) => {
                dispatch(props.toggleSettings);
                dispatch(props.changeVoice, props.key);
              },
              {
                toggleSettings: settingsToggleTTSList,
                changeVoice: ttsChangeVoice,
                key: actionKey,
              },
            ],
          ];
        },
      });
    }

    const listItems = customListItemFactory(factoryCfgVoices);
    const customListObjVoices = {
      listItems,
      active: ttsVoiceListActive,
      currentItem: ttsCurrentVoiceName,
      openList: settingsToggleTTSList,
      customListID: 'ab-custom-list-tts-voices',
    };

    customListVoices = customList(customListObjVoices);
  }

  for (const [key, name] of ttsGenders.entries()) {
    factoryCfgGenders.push({
      key,
      name,
      action: (state, actionKey: number) => {
        return [
          state,
          [
            (dispatch, props) => {
              dispatch(props.toggleSettings);
              dispatch(props.changeGender, props.key);
            },
            {
              toggleSettings: settingsToggleTTSGenderList,
              changeGender: ttsChangeGender,
              key: actionKey,
            },
          ],
        ];
      },
    });
  }

  const listItems = customListItemFactory(factoryCfgGenders);
  const customListObjGenders = {
    listItems,
    active: ttsGenderListActive,
    currentItem: ttsGender,
    openList: settingsToggleTTSGenderList,
    customListID: 'ab-custom-list-tts-genders',
  };
  const customListGenders = customList(customListObjGenders);

  return [
    h(
      'ab-settings-section-title',
      {class: 'ab-modal-section-title'},
      'Text To Speech'
    ),
    h('ab-settings-tts-voice', {class: 'ab-modal-section-group'}, [
      h('ab-setting-title', {class: 'ab-modal-title'}, 'Voice'),
      customListVoices,
    ]),
    h('ab-settings-tts-gender', {class: 'ab-modal-section-group'}, [
      h('ab-setting-title', {class: 'ab-modal-title'}, 'Gender'),
      customListGenders,
    ]),
  ];
};

const settingsSRSection = ({srLangListActive, srLangName}) => {
  const factoryCfg: Ace.ListItem[] = [];
  const langKeys = ISO6391.getAllCodes();

  for (const key of langKeys) {
    factoryCfg.push({
      key,
      name: ISO6391.getNativeName(key),
      action: (state, actionKey: number) => {
        return [
          state,
          [
            (dispatch, props) => {
              dispatch(props.toggleSettings);
              dispatch(props.changeLang, props.key);
            },
            {
              toggleSettings: settingsToggleSRLangList,
              changeLang: srChangeLang,
              key: actionKey,
            },
          ],
        ];
      },
    });
  }

  const listItems = customListItemFactory(factoryCfg);
  const customListObj = {
    listItems,
    active: srLangListActive,
    currentItem: srLangName,
    openList: settingsToggleSRLangList,
    customListID: 'ab-custom-list-sr-langs',
  };
  const langListEl = customList(customListObj);

  return [
    h(
      'ab-settings-section-title',
      {class: 'ab-modal-section-title'},
      'Speech Recognition'
    ),
    h('ab-settings-sr-lang', {class: 'ab-modal-section-group'}, [
      h('ab-setting-title', {class: 'ab-modal-title'}, 'Language'),
      langListEl,
    ]),
  ];
};

const settingsTooltipSection = (state: Ace.State) => {
  return [
    h(
      'ab-settings-section-title',
      {class: 'ab-modal-section-title'},
      'Tooltips'
    ),
    h('ab-settings-tooltip-speak', {class: 'ab-modal-section-group'}, [
      switchEl(
        state.aceSpeakTooltips,
        aceSpeakTooltipsToggle,
        'Read tooltips aloud on hover',
        'Read tooltips aloud on hover',
        'ab-switch-settings-tooltip-speak'
      ),
    ]),
  ];
};

const settingsThemesSection = (state: Ace.State) => {
  return [
    h('ab-settings-section-title', {class: 'ab-modal-section-title'}, 'Themes'),
    h(
      'ab-settings-section-info-text',
      {class: 'ab-modal-section-info-text ab-modal-title'},
      'Choose toolbar theme'
    ),
    h(
      'ab-settings-section-theme-selector-container',
      {class: 'ab-modal-section-group-row'},
      [
        h('ab-color-selector', {
          class: `ab-color-selector default-selector ${
            state.aceTheme === 'default-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-default',
          onclick: () => [settingsChangeTheme, 'default-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-default',
              content: 'Default Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-default',
              content: 'Default theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector light-selector ${
            state.aceTheme === 'light-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-light',
          onclick: () => [settingsChangeTheme, 'light-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-light',
              content: 'Light theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-light',
              content: 'Light theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector dark-selector ${
            state.aceTheme === 'dark-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-dark',
          onclick: () => [settingsChangeTheme, 'dark-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-dark',
              content: 'Dark Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-dark',
              content: 'Dark theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector orange-selector ${
            state.aceTheme === 'orange-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-orange',
          onclick: () => [settingsChangeTheme, 'orange-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-orange',
              content: 'Orange theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-orange',
              content: 'Orange theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector sky-blue-selector ${
            state.aceTheme === 'sky-blue-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-sky-blue',
          onclick: () => [settingsChangeTheme, 'sky-blue-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-sky-blue',
              content: 'Sky Blue Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-sky-blue',
              content: 'Sky Blue theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector pink-selector ${
            state.aceTheme === 'pink-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-pink',
          onclick: () => [settingsChangeTheme, 'pink-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-pink',
              content: 'Pink Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-pink',
              content: 'Pink theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector yellow-selector ${
            state.aceTheme === 'yellow-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-yellow',
          onclick: () => [settingsChangeTheme, 'yellow-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-yellow',
              content: 'Yellow Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-yellow',
              content: 'Yellow theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector grass-green-selector ${
            state.aceTheme === 'grass-green-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-grass-green',
          onclick: () => [settingsChangeTheme, 'grass-green-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-grass-green',
              content: 'Grass Green Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-grass-green',
              content: 'Grass Green theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector aqua-blue-selector ${
            state.aceTheme === 'aqua-blue-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-aqua-blue',
          onclick: () => [settingsChangeTheme, 'aqua-blue-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-aqua-blue',
              content: 'Aqua Blue Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-aqua-blue',
              content: 'Aqua Blue theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector celery-green-selector ${
            state.aceTheme === 'celery-green-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-celery-green',
          onclick: () => [settingsChangeTheme, 'celery-green-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-celery-green',
              content: 'Celery Green Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-dark',
              content: 'Celery Green theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector jade-selector ${
            state.aceTheme === 'jade-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-jade',
          onclick: () => [settingsChangeTheme, 'jade-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-jade',
              content: 'Jade Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-jade',
              content: 'Jade theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
        h('ab-color-selector', {
          class: `ab-color-selector magenta-selector ${
            state.aceTheme === 'magenta-theme' ? 'ab-active' : ''
          }`,
          id: 'ab-color-selector-magenta',
          onclick: () => [settingsChangeTheme, 'magenta-theme'],
          onmouseover: [
            aceAddTippy,
            {
              id: '#ab-color-selector-magenta',
              content: 'Magenta Theme',
            },
          ],
          onmouseenter: [
            aceSpeakTooltip,
            {
              id: '#ab-color-selector-magenta',
              content: 'Magenta theme',
            },
          ],
          onkeydown: handleButtonNavigation,
          role: 'button',
          tabindex: 0,
        }),
      ]
    ),
  ];
};

const settingsMenu = (state: Ace.State) => {
  const mobile = isMobile({
    tablet: true,
    featureDetect: true,
  });

  return h(
    'ab-settings-menu',
    {
      id: 'ab-settings',
      class: `ab-modal ${state.settingsHidden ? 'ab-hide' : ''}`,
      'aria-label': 'AccessAngel settings',
    },
    [
      settingsHeader(state),
      h('ab-settings-section-left', {class: 'ab-modal-section-left'}),
      h('ab-settings-section', {class: 'ab-modal-section'}, [
        ...(!mobile ? settingsTTSSection(state) : []),
        ...(!mobile ? settingsSRSection(state) : []),
        ...settingsTooltipSection(state),
        ...settingsThemesSection(state),
      ]),
      h('ab-settings-section-right', {class: 'ab-modal-section-right'}),
    ]
  );
};

export default settingsMenu;
export {settingsMenu};
