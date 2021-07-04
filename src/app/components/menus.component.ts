import fontConfig from '../../config/fonts.config.json5';
import languageConfig from '../../config/language.config.json5';
import {h} from 'hyperapp';
import BigNumber from 'bignumber.js';
import {ttsHightlightToggle, ttsHoverToggle} from '../actions/tts.actions';
import {
  fontColourChangeCustom,
  fontColourChangeSingle,
  fontColourToggle,
  fontFamilyToggle,
  fontLetterSpacingDecrement,
  fontLetterSpacingToggle,
  fontLineSpacingDecrement,
  fontLineSpacingIncrement,
  fontLineSpacingToggle,
  fontLetterSpacingIncrement,
  fontToggleList,
  fontToggleCurrent,
} from '../actions/font.actions';
import {
  aceAddTippy,
  aceCreatePickr,
  aceSpeakTooltip,
  handleButtonNavigation,
} from '../actions/ace.actions';
import {
  menuRulerOpsSwitchInner,
  menuTextOpsSwitchInner,
} from '../actions/menu.actions';
import {
  magHeightDecrease,
  magHeightIncrease,
  magScaleDecrease,
  magScaleIncrease,
  magToggle,
  magUpdatePosition,
  magWidthDecrease,
  magWidthIncrease,
} from '../actions/mag.actions';
import {
  maskChangeColourCustom,
  maskChangeColour,
  maskDecreaseOpacity,
  maskIncreaseOpacity,
  maskToggle,
} from '../actions/mask.actions';
import {
  rulerChangePinholeMaskColour,
  rulerChangePinholeMaskCustomColour,
  rulerChangeReadingColour,
  rulerChangeReadingCustomColour,
  rulerPinholeOpacityDec,
  rulerPinholeOpacityInc,
  rulerPinholeSizeDec,
  rulerPinholeSizeInc,
  rulerPinholeToggle,
  rulerReadingOpacityDec,
  rulerReadingOpacityInc,
  rulerReadingToggle,
  rulerSizeDecrease,
  rulerSizeIncrease,
} from '../actions/ruler.actions';
import {srToggle} from '../actions/sr.actions';
import {
  ptToggle,
  languageToggleCurrent,
  languageToggleList,
} from '../actions/language.actions';
import {fxAceCreatePickr} from '../fx/shortcuts.fx';

const switchEl = (
  switchState: boolean,
  switchAction: (state: Ace.State) => unknown,
  labelText: string,
  ariaLabel: string,
  elementId?: string
) => {
  return h(
    'ab-switch-label',
    {
      id: `${elementId !== undefined ? elementId : ''}`,
      class: 'ab-label',
      onclick: switchAction,
      onkeydown: handleButtonNavigation,
      tabindex: 0,
    },
    [
      h(
        'ab-switch',
        {
          'aria-checked': switchState ? 'true' : 'false',
          'aria-label': ariaLabel,
          class: `ab-switch ${switchState ? 'ab-on' : 'ab-off'}`,
          role: 'switch',
        },
        [
          h('ab-switch-handle', {class: 'ab-handle'}),
          h(
            'ab-switch-state',
            {class: 'ab-switch-state'},
            switchState ? 'On' : 'Off'
          ),
        ]
      ),
      h('ab-switch-label-text', {}, labelText),
    ]
  );
};

const ttsMenu = (state: Ace.State) => {
  return h('ab-tts-inner-menu', {class: 'ab-menu-content'}, [
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      switchEl(
        state.ttsHoverSpeak,
        ttsHoverToggle,
        'Speak on hover',
        'Toggle speak on hover',
        'ab-switch-speak-on-hover'
      ),
    ]),
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      switchEl(
        state.ttsHighlightSpeak,
        ttsHightlightToggle,
        'Speak only highlighted',
        'Toggle speak only highlighted text',
        'ab-switch-speak-highlighted'
      ),
    ]),
  ]);
};

const textOptionsInnerFont = (state: Ace.State) => {
  const fontList: unknown[] = [];
  const fonts = Object.entries(fontConfig as Ace.FontConfig);
  const currentFont =
    state.fontCurrentKey.length > 0
      ? fontConfig[state.fontCurrentKey].name || 'Select Font'
      : 'Select Font';
  const currentFontFamily =
    state.fontCurrentKey.length > 0
      ? fontConfig[state.fontCurrentKey].family || null
      : null;

  for (const [key, obj] of fonts) {
    const item = h(
      'ab-custom-list-selection-item',
      {
        class: 'ab-custom-list-selection-item',
        onclick: [fontToggleCurrent, key],
        onkeydown: (state: Ace.State, event: KeyboardEvent) => {
          const {type, code} = event;
          if (code !== 'Enter') {
            return state;
          }
          if (type !== 'keydown' && type !== 'click' && type !== 'keypress') {
            return state;
          }
          return [fontToggleCurrent, key];
        },
        role: 'option',
        tabindex: 0,
        style: {
          fontFamily: obj.family,
        },
      },
      obj.name
    );

    fontList.push(item);
  }

  return h(
    'ab-text-options-inner-menu-font',
    {class: 'ab-flex-column', id: 'ab-text-options-inner-menu-font'},
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.fontActive,
          fontFamilyToggle,
          'Toggle Font Type',
          'Toggle the page font type',
          'ab-switch-font-family-foggle'
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-font-options-menu',
          {
            class: 'ab-font-options',
          },
          [
            h(
              'ab-custom-list',
              {class: 'ab-custom-list ab-flex ab-flex-column'},
              [
                h(
                  'ab-custom-list-box',
                  {
                    class: `ab-custom-list-box ab-flex ${
                      state.selectFontListActive ? 'ab-active' : ''
                    }`,
                    id: 'ab-custom-list-box-font',
                    onclick: fontToggleList,
                    onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                      const {type, code} = event;
                      if (code !== 'Enter') {
                        return state;
                      }
                      if (
                        type !== 'keydown' &&
                        type !== 'click' &&
                        type !== 'keypress'
                      ) {
                        return state;
                      }
                      return fontToggleList;
                    },
                    style: {
                      fontFamily: currentFontFamily,
                    },
                    tabindex: 0,
                  },
                  currentFont
                ),
                h(
                  'ab-custom-list-selection',
                  {
                    'aria-labelledby': 'ab-custom-list-box',
                    class: `ab-custom-list-selection ${
                      state.selectFontListActive ? 'ab-flex' : 'ab-hide'
                    } ab-flex-column`,
                    id: 'ab-font-list-selection',
                    role: 'listbox',
                  },
                  fontList
                ),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

const textOptionsInnerTextColour = (state: Ace.State) => {
  return h(
    'ab-text-options-inner-menu-colour',
    {class: 'ab-flex ab-flex-column', id: 'ab-text-options-inner-menu-colour'},
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.fontColourActive,
          fontColourToggle,
          'Toggle Text Colour',
          'Toggle the page text colour',
          'ab-switch-font-color-toggle'
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box'}, [
        h(
          'ab-colour-presets',
          {class: 'ab-colour-presets ab-growable ab-flex-column'},
          [
            h('ab-inner-menu-title', {class: 'ab-title'}, 'Presets'),
            h('ab-colours', {class: 'ab-colours'}, [
              h('ab-colour', {
                'aria-label': 'Change font colour to red',
                class: `ab-colour ab-red ${
                  state.fontColourCurrent === 'red' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'red'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'red'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to blue',
                class: `ab-colour ab-blue ${
                  state.fontColourCurrent === 'blue' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'blue'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'blue'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to green',
                class: `ab-colour ab-green ${
                  state.fontColourCurrent === 'green' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'green'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'green'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to yellow',
                class: `ab-colour ab-yellow ${
                  state.fontColourCurrent === 'yellow' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'yellow'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'yellow'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to orange',
                class: `ab-colour ab-orange ${
                  state.fontColourCurrent === 'orange' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'orange'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'orange'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to purple',
                class: `ab-colour ab-purple ${
                  state.fontColourCurrent === 'purple' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'purple'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'purple'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to black',
                class: `ab-colour ab-black ${
                  state.fontColourCurrent === 'black' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'black'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'black'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to grey',
                class: `ab-colour ab-grey ${
                  state.fontColourCurrent === 'grey' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'grey'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'grey'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change font colour to white',
                class: `ab-colour ab-white ${
                  state.fontColourCurrent === 'white' ? 'ab-active' : ''
                }`,
                onclick: [fontColourChangeSingle, 'white'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [fontColourChangeSingle, 'white'];
                },
                role: 'button',
                tabindex: 0,
              }),
            ]),
          ]
        ),
        h(
          'ab-colour-custom',
          {class: 'ab-colour-custom ab-growable ab-flex-column'},
          [
            h('ab-inner-menu-title', {class: 'ab-title'}, 'Custom'),
            h(
              'ab-inner-menu-desc',
              {id: 'ab-custom-colour-desc-font', class: 'ab-desc'},
              ['Click to select', h('br'), 'custom colour.']
            ),
            h(
              'ab-custom-colour-container',
              {class: 'ab-custom-container ab-flex'},
              [
                h('ab-custom-colour-box', {
                  'aria-labelledby': 'ab-custom-colour-desc-font',
                  'aria-pressed': state.fontCustomActive ? 'true' : 'false',
                  class: `ab-custom-box ${
                    state.fontCustomActive ? 'ab-active' : ''
                  }`,
                  id: 'ab-font-colour-custom-box',
                  onmouseover: [
                    aceCreatePickr,
                    {
                      id: '#ab-font-colour-custom-box',
                      action: fontColourChangeCustom,
                    },
                  ],
                  onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                    const {type, code} = event;
                    if (code !== 'Enter') {
                      return state;
                    }
                    if (
                      type !== 'keydown' &&
                      type !== 'click' &&
                      type !== 'keypress'
                    ) {
                      return state;
                    }
                    return [
                      fxAceCreatePickr,
                      {
                        id: '#ab-font-colour-custom-box',
                        action: fontColourChangeCustom,
                      },
                    ];
                  },
                  role: 'button',
                  tabindex: 0,
                  style: {background: state.fontColourCustomCurrent},
                }),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

const textOptionsInnerLineSpacing = (state: Ace.State) => {
  return h(
    'ab-text-options-inner-menu-line-spacing',
    {
      class: 'ab-flex ab-flex-column',
      id: 'ab-text-options-inner-menu-line-spacing',
    },
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.fontLineSpacingActive,
          fontLineSpacingToggle,
          'Toggle Line Spacing',
          'Toggle the page line spacing',
          'ab-switch-fontLineSpacingToggle'
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-counter',
          {
            'aria-valuemax': String(state.fontLineSpacingMax),
            'aria-valuemin': '0',
            'aria-valuenow': String(state.fontLineSpacingCount),
            'aria-valuetext': String(state.fontLineSpacingCount),
            class: 'ab-counter ab-growable',
            role: 'spinbutton',
          },
          [
            h(
              'ab-counter-decrease',
              {
                'aria-label': 'Decrease line spacing',
                class: 'ab-dec ab-bar-button',
                id: 'ab-ls-dec',
                onclick: fontLineSpacingDecrement,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ls-dec', content: 'Decrease'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ls-dec', content: 'Decrease'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-minus',
                }),
              ]
            ),
            h('ab-count-container', {class: 'ab-count-container'}, [
              h('ab-count-header', {class: 'ab-count-header'}, 'Spacing'),
              h(
                'ab-count-value',
                {class: 'ab-count'},
                state.fontLineSpacingCount
              ),
            ]),
            h(
              'ab-counter-increase',
              {
                'aria-label': 'Increase line spacing',
                class: 'ab-inc ab-bar-button',
                id: 'ab-ls-inc',
                onclick: fontLineSpacingIncrement,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ls-inc', content: 'Increase'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ls-inc', content: 'Increase'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-plus',
                }),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

const textOptionsInnerLetterSpacing = (state: Ace.State) => {
  return h(
    'ab-text-options-inner-menu-letter-spacing',
    {
      class: 'ab-flex ab-flex-column',
      id: 'ab-text-options-inner-menu-letter-spacing',
    },
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.fontLetterSpacingActive,
          fontLetterSpacingToggle,
          'Toggle Letter Spacing',
          'Toggle the page letter spacing',
          'ab-switch-fontLetterSpacingToggle'
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-counter',
          {
            'aria-valuemax': String(state.fontLetterSpacingMax),
            'aria-valuemin': '0',
            'aria-valuenow': String(state.fontLetterSpacingCount),
            'aria-valuetext': String(state.fontLetterSpacingCount),
            class: 'ab-counter ab-growable',
            role: 'spinbutton',
          },
          [
            h(
              'ab-counter-decrease',
              {
                'aria-label': 'Decrease letter spacing',
                class: 'ab-dec ab-bar-button',
                id: 'ab-ks-dec',
                onclick: fontLetterSpacingDecrement,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ks-dec', content: 'Decrease'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ks-dec', content: 'Decrease'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-minus',
                }),
              ]
            ),
            h('ab-count-container', {class: 'ab-count-container'}, [
              h('ab-count-header', {class: 'ab-count-header'}, 'Spacing'),
              h(
                'ab-count-value',
                {class: 'ab-count'},
                state.fontLetterSpacingCount
              ),
            ]),
            h(
              'ab-counter-increase',
              {
                'aria-label': 'Increase letter spacing',
                class: 'ab-inc ab-bar-button',
                id: 'ab-ks-inc',
                onclick: fontLetterSpacingIncrement,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ks-inc', content: 'Increase'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ks-inc', content: 'Increase'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-plus',
                }),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

const textOptionsInnerMenus = new Map([
  ['font', textOptionsInnerFont],
  ['text_colour', textOptionsInnerTextColour],
  ['line_spacing', textOptionsInnerLineSpacing],
  ['letter_spacing', textOptionsInnerLetterSpacing],
]);

const textOptionsMenu = (state: Ace.State) => {
  let innerMenu = h('ab-placeholder', {}, '');

  if (textOptionsInnerMenus.has(state.textOpsInnerMenuCurrent)) {
    innerMenu = (
      textOptionsInnerMenus.get(state.textOpsInnerMenuCurrent) ||
      textOptionsInnerFont
    )(state);
  }

  return h('ab-menu-container', {class: 'ab-menu-container'}, [
    h('ab-menu-tabs', {class: 'ab-menu-tabs', role: 'tablist'}, [
      h(
        'ab-tab-button',
        {
          'aria-selected':
            state.textOpsInnerMenuCurrent === 'font' ? 'true' : 'false',
          class: `ab-menu-tab-button ${
            state.textOpsInnerMenuCurrent === 'font' ? 'ab-active' : ''
          }`,
          id: 'ab-tab-button-font',
          onclick: [menuTextOpsSwitchInner, 'font'],
          onkeydown: handleButtonNavigation,
          role: 'tab',
          tabindex: 0,
        },
        'Font'
      ),
      h(
        'ab-tab-button',
        {
          'aria-selected':
            state.textOpsInnerMenuCurrent === 'text_colour' ? 'true' : 'false',
          class: `ab-menu-tab-button ${
            state.textOpsInnerMenuCurrent === 'text_colour' ? 'ab-active' : ''
          }`,
          id: 'ab-tab-button-text-color',
          onclick: [menuTextOpsSwitchInner, 'text_colour'],
          onkeydown: handleButtonNavigation,
          role: 'tab',
          tabindex: 0,
        },
        'Text Colour'
      ),
      h(
        'ab-tab-button',
        {
          'aria-selected':
            state.textOpsInnerMenuCurrent === 'line_spacing' ? 'true' : 'false',
          class: `ab-menu-tab-button ${
            state.textOpsInnerMenuCurrent === 'line_spacing' ? 'ab-active' : ''
          }`,
          id: 'ab-tab-button-line-spacing',
          onclick: [menuTextOpsSwitchInner, 'line_spacing'],
          onkeydown: handleButtonNavigation,
          role: 'tab',
          tabindex: 0,
        },
        'Line Spacing'
      ),
      h(
        'ab-tab-button',
        {
          'aria-selected':
            state.textOpsInnerMenuCurrent === 'letter_spacing'
              ? 'true'
              : 'false',
          class: `ab-menu-tab-button ${
            state.textOpsInnerMenuCurrent === 'letter_spacing'
              ? 'ab-active'
              : ''
          }`,
          id: 'ab-tab-button-letter-spacing',
          onclick: [menuTextOpsSwitchInner, 'letter_spacing'],
          onkeydown: handleButtonNavigation,
          role: 'tab',
          tabindex: 0,
        },
        'Letter Spacing'
      ),
    ]),
    h(
      'ab-inner-menu-container',
      {
        class: 'ab-menu-content',
        role: 'tabpanel',
      },
      [innerMenu]
    ),
  ]);
};

const magMenu = (state: Ace.State) => {
  const currentMagPercentage = new BigNumber(state.magScale).times(100);

  const magWidthPercentage = new BigNumber(state.magWidth)
    .dividedBy(window.innerWidth - state.magWidthOffset)
    .times(100)
    .decimalPlaces(0);
  const magWidthPercentageText = magWidthPercentage + '% ';

  const magHeightPercentage = new BigNumber(state.magHeight)
    .dividedBy(window.innerHeight - state.magHeightOffset)
    .times(100)
    .decimalPlaces(0);
  const magHeightPercentageText = magHeightPercentage + '%';

  return h('ab-mag-inner-menu', {class: 'ab-menu-content'}, [
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      switchEl(
        state.magActive,
        magToggle,
        'Show Magnifier',
        'Show magnifier',
        'ab-switch-mag-toggle'
      ),
    ]),
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      h(
        'ab-counter',
        {
          'aria-valuemax': '500',
          'aria-valuemin': '50',
          'aria-valuenow': currentMagPercentage,
          'aria-valuetext': `${currentMagPercentage}%`,
          class: 'ab-counter ab-growable',
          role: 'spinbutton',
        },
        [
          h(
            'ab-counter-decrease',
            {
              'aria-label': 'Decrease magnifier zoom',
              class: 'ab-dec ab-bar-button',
              id: 'ab-mag-scale-dec',
              onclick: (state: Ace.State) => [
                state,
                [
                  (dispatch, props) => {
                    dispatch(props.dec);
                    dispatch(props.pos);
                  },
                  {
                    dec: magScaleDecrease,
                    pos: magUpdatePosition,
                  },
                ],
              ],
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mag-scale-dec', content: 'Decrease Zoom'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mag-scale-dec', content: 'Decrease Zoom'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-minus',
              }),
            ]
          ),
          h('ab-count-container', {class: 'ab-count-container'}, [
            h('ab-count-header', {class: 'ab-count-header'}, 'Zoom'),
            h(
              'ab-count-value',
              {class: 'ab-count'},
              `${currentMagPercentage}%`
            ),
          ]),
          h(
            'ab-counter-increase',
            {
              'aria-label': 'Increase magnifier zoom',
              class: 'ab-inc ab-bar-button',
              id: 'ab-mag-scale-inc',
              onclick: (state: Ace.State) => [
                state,
                [
                  (dispatch, props) => {
                    dispatch(props.inc);
                    dispatch(props.pos);
                  },
                  {
                    inc: magScaleIncrease,
                    pos: magUpdatePosition,
                  },
                ],
              ],
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mag-scale-inc', content: 'Increase Zoom'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mag-scale-inc', content: 'Increase Zoom'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-plus',
              }),
            ]
          ),
        ]
      ),
    ]),

    // New section for mag width size
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      h(
        'ab-counter',
        {
          'aria-valuemax': String(
            state.rulerPinholeCentreHeightMax /
              state.rulerPinholeCentreHeightStep
          ),
          'aria-valuemin': '1',
          'aria-valuenow': String(magWidthPercentage),
          'aria-valuetext': String(magWidthPercentageText),
          class: 'ab-counter ab-growable',
          role: 'spinbutton',
        },
        [
          h(
            'ab-counter-decrease',
            {
              'aria-label': 'Decrease pinhole ruler size',
              class: 'ab-dec ab-bar-button',
              id: 'ab-mag-width-dec',
              onclick: magWidthDecrease,
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mag-width-dec', content: 'Decrease Width'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mag-width-dec', content: 'Decrease Width'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-minus',
              }),
            ]
          ),
          h('ab-count-container', {class: 'ab-count-container'}, [
            h('ab-count-header', {class: 'ab-count-header'}, 'Width'),
            h(
              'ab-count-value',
              {class: 'ab-count'},
              String(magWidthPercentageText)
            ),
          ]),
          h(
            'ab-counter-increase',
            {
              'aria-label': 'Increase mag width',
              class: 'ab-inc ab-bar-button',
              id: 'ab-mag-width-inc',
              onclick: magWidthIncrease,
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mag-width-inc', content: 'Increase Width'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mag-width-inc', content: 'Increase Width'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-plus',
              }),
            ]
          ),
        ]
      ),
    ]),
    // End of mag width size

    // New section for mag Height size
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      h(
        'ab-counter',
        {
          'aria-valuemax': String(
            state.rulerPinholeCentreHeightMax /
              state.rulerPinholeCentreHeightStep
          ),
          'aria-valuemin': '1',
          'aria-valuenow': String(magHeightPercentage),
          'aria-valuetext': String(magHeightPercentageText),
          class: 'ab-counter ab-growable',
          role: 'spinbutton',
        },
        [
          h(
            'ab-counter-decrease',
            {
              'aria-label': 'Decrease pinhole ruler size',
              class: 'ab-dec ab-bar-button',
              id: 'ab-mag-height-dec',
              onclick: magHeightDecrease,
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mag-height-dec', content: 'Decrease Height'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mag-height-dec', content: 'Decrease Height'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-minus',
              }),
            ]
          ),
          h('ab-count-container', {class: 'ab-count-container'}, [
            h('ab-count-header', {class: 'ab-count-header'}, 'Height'),
            h(
              'ab-count-value',
              {class: 'ab-count'},
              String(magHeightPercentageText)
            ),
          ]),
          h(
            'ab-counter-increase',
            {
              'aria-label': 'Increase mag width',
              class: 'ab-inc ab-bar-button',
              id: 'ab-mag-height-inc',
              onclick: magHeightIncrease,
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mag-height-inc', content: 'Increase Height'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mag-height-inc', content: 'Increase Height'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-plus',
              }),
            ]
          ),
        ]
      ),
    ]),
    // End of section for mag height size
  ]);
};

const maskMenu = (state: Ace.State) => {
  const opacityCurrentPercentage = new BigNumber(state.maskOpacity).times(100);

  return h('ab-inner-menu-mask', {class: 'ab-menu-content'}, [
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      switchEl(
        state.maskActive,
        maskToggle,
        'Show Screen Mask',
        'Show screen mask',
        'ab-switch-maskToggle'
      ),
    ]),
    h('ab-inner-menu-section', {class: 'ab-box'}, [
      h(
        'ab-colour-presets',
        {class: 'ab-colour-presets ab-growable ab-flex-column'},
        [
          h('ab-inner-menu-title', {class: 'ab-title'}, 'Presets'),
          h('ab-colours', {class: 'ab-colours'}, [
            h('ab-colour', {
              'aria-label': 'Change mask colour to red',
              class: `ab-colour ab-red ${
                state.maskColourCurrent === 'red' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'red'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'red'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to blue',
              class: `ab-colour ab-blue ${
                state.maskColourCurrent === 'blue' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'blue'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'blue'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to green',
              class: `ab-colour ab-green ${
                state.maskColourCurrent === 'green' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'green'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'green'];
              },
              tabindex: 0,
              role: 'button',
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to yellow',
              class: `ab-colour ab-yellow ${
                state.maskColourCurrent === 'yellow' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'yellow'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'yellow'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to orange',
              class: `ab-colour ab-orange ${
                state.maskColourCurrent === 'orange' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'orange'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'orange'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to purple',
              class: `ab-colour ab-purple ${
                state.maskColourCurrent === 'purple' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'purple'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'purple'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to black',
              class: `ab-colour ab-black ${
                state.maskColourCurrent === 'black' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'black'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'black'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to grey',
              class: `ab-colour ab-grey ${
                state.maskColourCurrent === 'grey' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'grey'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'grey'];
              },
              role: 'button',
              tabindex: 0,
            }),
            h('ab-colour', {
              'aria-label': 'Change mask colour to white',
              class: `ab-colour ab-white ${
                state.maskColourCurrent === 'white' ? 'ab-active' : ''
              }`,
              onclick: [maskChangeColour, 'white'],
              onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                const {type, code} = event;
                if (code !== 'Enter') {
                  return state;
                }
                if (
                  type !== 'keydown' &&
                  type !== 'click' &&
                  type !== 'keypress'
                ) {
                  return state;
                }
                return [maskChangeColour, 'white'];
              },
              role: 'button',
              tabindex: 0,
            }),
          ]),
        ]
      ),
      h(
        'ab-colour-custom',
        {class: 'ab-colour-custom ab-growable ab-flex-column'},
        [
          h('ab-inner-menu-title', {class: 'ab-title'}, 'Custom'),
          h(
            'ab-inner-menu-desc',
            {id: 'ab-custom-colour-desc-mask', class: 'ab-desc'},
            ['Click to select', h('br'), 'custom colour.']
          ),
          h(
            'ab-custom-colour-container',
            {class: 'ab-custom-container ab-flex'},
            [
              h('ab-custom-colour-box', {
                'aria-labelledby': 'ab-custom-colour-desc-mask',
                'aria-pressed': state.maskCustomActive ? 'true' : 'false',
                class: `ab-custom-box ${
                  state.maskCustomActive ? 'ab-active' : ''
                }`,
                id: 'ab-mask-colour-custom-box',
                onmouseover: [
                  aceCreatePickr,
                  {
                    id: '#ab-mask-colour-custom-box',
                    action: maskChangeColourCustom,
                  },
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
                style: {background: state.maskColourCustomCurrent},
              }),
            ]
          ),
        ]
      ),
    ]),
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      h(
        'ab-counter',
        {
          'aria-valuemax': '95',
          'aria-valuemin': '5',
          'aria-valuenow': opacityCurrentPercentage,
          'aria-valuetext': `${opacityCurrentPercentage}%`,
          class: 'ab-counter ab-growable',
          role: 'spinbutton',
        },
        [
          h(
            'ab-counter-decrease',
            {
              'aria-label': 'Decrease mask opacity',
              class: 'ab-dec ab-bar-button',
              id: 'ab-mask-opacity-dec',
              onclick: maskDecreaseOpacity,
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mask-opacity-dec', content: 'Decrease Opacity'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mask-opacity-dec', content: 'Decrease Opacity'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-minus',
              }),
            ]
          ),
          h('ab-count-container', {class: 'ab-count-container'}, [
            h('ab-count-header', {class: 'ab-count-header'}, 'Opacity'),
            h(
              'ab-count-value',
              {class: 'ab-count'},
              `${opacityCurrentPercentage}%`
            ),
          ]),
          h(
            'ab-counter-increase',
            {
              'aria-label': 'Increase mask opacity',
              class: 'ab-inc ab-bar-button',
              id: 'ab-mask-opacity-inc',
              onclick: maskIncreaseOpacity,
              onmouseover: [
                aceAddTippy,
                {id: '#ab-mask-opacity-inc', content: 'Increase Opacity'},
              ],
              onmouseenter: [
                aceSpeakTooltip,
                {id: '#ab-mask-opacity-inc', content: 'Increase Opacity'},
              ],
              onkeydown: handleButtonNavigation,
              role: 'button',
              tabindex: 0,
            },
            [
              h('ab-icon', {
                'aria-hidden': true,
                class: 'ab-icon ab-icon-plus',
              }),
            ]
          ),
        ]
      ),
    ]),
  ]);
};

const rulerOptionsInnerReading = (state: Ace.State) => {
  const rulerReadingOpacityPercentage = new BigNumber(
    state.rulerReadingOpacity
  ).times(100);

  return h(
    'ab-ruler-options-inner-menu-reading',
    {class: 'ab-flex-column', id: 'ab-ruler-options-inner-menu-reading'},
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.rulerReadingActive,
          rulerReadingToggle,
          'Toggle Reading Ruler',
          'Toggle the reading ruler',
          'ab-switch-rulerReadingToggle'
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box'}, [
        h(
          'ab-colour-presets',
          {class: 'ab-colour-presets ab-growable ab-flex-column'},
          [
            h('ab-inner-menu-title', {class: 'ab-title'}, 'Presets'),
            h('ab-colours', {class: 'ab-colours'}, [
              h('ab-colour', {
                'aria-label': 'Change colour to red',
                class: `ab-colour ab-red ${
                  state.rulerReadingColourCurrent === 'red' ? 'ab-active' : ''
                }`,
                onclick: [rulerChangeReadingColour, 'red'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'red'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to blue',
                class: `ab-colour ab-blue ${
                  state.rulerReadingColourCurrent === 'blue' ? 'ab-active' : ''
                }`,
                onclick: [rulerChangeReadingColour, 'blue'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'blue'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to green',
                class: `ab-colour ab-green ${
                  state.rulerReadingColourCurrent === 'green' ? 'ab-active' : ''
                }`,
                onclick: [rulerChangeReadingColour, 'green'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'green'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to yellow',
                class: `ab-colour ab-yellow ${
                  state.rulerReadingColourCurrent === 'yellow'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangeReadingColour, 'yellow'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'yellow'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to orange',
                class: `ab-colour ab-orange ${
                  state.rulerReadingColourCurrent === 'orange'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangeReadingColour, 'orange'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'orange'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to purple',
                class: `ab-colour ab-purple ${
                  state.rulerReadingColourCurrent === 'purple'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangeReadingColour, 'purple'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'purple'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to black',
                class: `ab-colour ab-black ${
                  state.rulerReadingColourCurrent === 'black' ? 'ab-active' : ''
                }`,
                onclick: [rulerChangeReadingColour, 'black'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'black'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to grey',
                class: `ab-colour ab-grey ${
                  state.rulerReadingColourCurrent === 'grey' ? 'ab-active' : ''
                }`,
                onclick: [rulerChangeReadingColour, 'grey'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'grey'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change colour to white',
                class: `ab-colour ab-white ${
                  state.rulerReadingColourCurrent === 'white' ? 'ab-active' : ''
                }`,
                onclick: [rulerChangeReadingColour, 'white'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangeReadingColour, 'white'];
                },
                role: 'button',
                tabindex: 0,
              }),
            ]),
          ]
        ),
        h(
          'ab-colour-custom',
          {class: 'ab-colour-custom ab-growable ab-flex-column'},
          [
            h('ab-inner-menu-title', {class: 'ab-title'}, 'Custom'),
            h(
              'ab-inner-menu-desc',
              {id: 'ab-custom-colour-desc-reading-mask', class: 'ab-desc'},
              ['Click to select', h('br'), 'custom colour.']
            ),
            h(
              'ab-custom-colour-container',
              {class: 'ab-custom-container ab-flex'},
              [
                h('ab-custom-colour-box', {
                  'aria-labelledby': 'ab-custom-colour-desc-reading-mask',
                  'aria-pressed': state.rulerReadingCustomColourActive
                    ? 'true'
                    : 'false',
                  class: `ab-custom-box ${
                    state.rulerReadingCustomColourActive ? 'ab-active' : ''
                  }`,
                  id: 'ab-reading-ruler-colour-custom-box',
                  onmouseover: [
                    aceCreatePickr,
                    {
                      id: '#ab-reading-ruler-colour-custom-box',
                      action: rulerChangeReadingCustomColour,
                    },
                  ],
                  onkeydown: handleButtonNavigation,
                  role: 'button',
                  tabindex: 0,
                  style: {background: state.rulerReadingCustomColourCurrent},
                }),
              ]
            ),
          ]
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-counter',
          {
            'aria-valuemax': '90',
            'aria-valuemin': '20',
            'aria-valuenow': rulerReadingOpacityPercentage,
            'aria-valuetext': `${rulerReadingOpacityPercentage}%`,
            class: 'ab-counter ab-growable',
            role: 'spinbutton',
          },
          [
            h(
              'ab-counter-decrease',
              {
                'aria-label': 'Decrease reading ruler opacity',
                class: 'ab-dec ab-bar-button',
                id: 'ab-reading-ruler-opacity-dec',
                onclick: rulerReadingOpacityDec,
                onmouseover: [
                  aceAddTippy,
                  {
                    id: '#ab-reading-ruler-opacity-dec',
                    content: 'Decrease Opacity',
                  },
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {
                    id: '#ab-reading-ruler-opacity-dec',
                    content: 'Decrease Opacity',
                  },
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-minus',
                }),
              ]
            ),
            h('ab-count-container', {class: 'ab-count-container'}, [
              h('ab-count-header', {class: 'ab-count-header'}, 'Opacity'),
              h(
                'ab-count-value',
                {class: 'ab-count'},
                `${rulerReadingOpacityPercentage}%`
              ),
            ]),
            h(
              'ab-counter-increase',
              {
                'aria-label': 'Increase reading ruler opacity',
                class: 'ab-inc ab-bar-button',
                id: 'ab-reading-ruler-opacity-inc',
                onclick: rulerReadingOpacityInc,
                onmouseover: [
                  aceAddTippy,
                  {
                    id: '#ab-ruler-reading-opacity-inc',
                    content: 'Increase Opacity',
                  },
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {
                    id: '#ab-ruler-reading-opacity-inc',
                    content: 'Increase Opacity',
                  },
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-plus',
                }),
              ]
            ),
          ]
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-counter',
          {
            'aria-valuemax': String(state.rulerHeightMax),
            'aria-valuemin': '1',
            'aria-valuenow': String(state.rulerHeight),
            'aria-valuetext': String(state.rulerHeight),
            class: 'ab-counter ab-growable',
            role: 'spinbutton',
          },
          [
            h(
              'ab-counter-decrease',
              {
                'aria-label': 'Decrease ruler size',
                class: 'ab-dec ab-bar-button',
                id: 'ab-ruler-size-dec',
                onclick: rulerSizeDecrease,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ruler-size-dec', content: 'Decrease Size'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ruler-size-dec', content: 'Decrease Size'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-minus',
                }),
              ]
            ),
            h('ab-count-container', {class: 'ab-count-container'}, [
              h('ab-count-header', {class: 'ab-count-header'}, 'Size'),
              h('ab-count-value', {class: 'ab-count'}, state.rulerHeight),
            ]),
            h(
              'ab-counter-increase',
              {
                'aria-label': 'Increase ruler size',
                class: 'ab-inc ab-bar-button',
                id: 'ab-ruler-size-inc',
                onclick: rulerSizeIncrease,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ruler-size-inc', content: 'Increase Size'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ruler-size-inc', content: 'Increase Size'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-plus',
                }),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

const rulerOptionsInnerPinhole = (state: Ace.State) => {
  const size =
    state.rulerPinholeCentreHeight / state.rulerPinholeCentreHeightStep;
  const rulerPinholeOpacityPercentage = new BigNumber(
    state.rulerPinholeOpacity
  ).times(100);

  return h(
    'ab-ruler-options-inner-menu-pinhole',
    {class: 'ab-flex-column', id: 'ab-ruler-options-inner-menu-pinhole'},
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.rulerPinholeActive,
          rulerPinholeToggle,
          'Toggle Pinhole',
          'Toggle the pinhole ruler',
          'ab-switch-rulerPinholeToggle'
        ),
      ]),
      // Masked outer section color
      h('ab-inner-menu-section', {class: 'ab-box'}, [
        h(
          'ab-colour-presets',
          {class: 'ab-colour-presets ab-growable ab-flex-column'},
          [
            h('ab-inner-menu-title', {class: 'ab-title'}, 'Presets'),
            h('ab-colours', {class: 'ab-colours'}, [
              h('ab-colour', {
                'aria-label': 'Change mask colour to red',
                class: `ab-colour ab-red ${
                  state.rulerPinholeMaskColourCurrent === 'red'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'red'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'red'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to blue',
                class: `ab-colour ab-blue ${
                  state.rulerPinholeMaskColourCurrent === 'blue'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'blue'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'blue'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to green',
                class: `ab-colour ab-green ${
                  state.rulerPinholeMaskColourCurrent === 'green'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'green'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'green'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to yellow',
                class: `ab-colour ab-yellow ${
                  state.rulerPinholeMaskColourCurrent === 'yellow'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'yellow'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'yellow'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to orange',
                class: `ab-colour ab-orange ${
                  state.rulerPinholeMaskColourCurrent === 'orange'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'orange'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'orange'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to purple',
                class: `ab-colour ab-purple ${
                  state.rulerPinholeMaskColourCurrent === 'purple'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'purple'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'purple'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to black',
                class: `ab-colour ab-black ${
                  state.rulerPinholeMaskColourCurrent === 'black'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'black'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'black'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to grey',
                class: `ab-colour ab-grey ${
                  state.rulerPinholeMaskColourCurrent === 'grey'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'grey'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'grey'];
                },
                role: 'button',
                tabindex: 0,
              }),
              h('ab-colour', {
                'aria-label': 'Change mask colour to white',
                class: `ab-colour ab-white ${
                  state.rulerPinholeMaskColourCurrent === 'white'
                    ? 'ab-active'
                    : ''
                }`,
                onclick: [rulerChangePinholeMaskColour, 'white'],
                onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                  const {type, code} = event;
                  if (code !== 'Enter') {
                    return state;
                  }
                  if (
                    type !== 'keydown' &&
                    type !== 'click' &&
                    type !== 'keypress'
                  ) {
                    return state;
                  }
                  return [rulerChangePinholeMaskColour, 'white'];
                },
                role: 'button',
                tabindex: 0,
              }),
            ]),
          ]
        ),
        h(
          'ab-colour-custom',
          {class: 'ab-colour-custom ab-growable ab-flex-column'},
          [
            h('ab-inner-menu-title', {class: 'ab-title'}, 'Custom'),
            h(
              'ab-inner-menu-desc',
              {id: 'ab-custom-colour-desc-pinhole-mask', class: 'ab-desc'},
              ['Click to select', h('br'), 'custom colour.']
            ),
            h(
              'ab-custom-colour-container',
              {class: 'ab-custom-container ab-flex'},
              [
                h('ab-custom-colour-box', {
                  'aria-labelledby': 'ab-custom-colour-desc-pinhole-mask',
                  'aria-pressed': state.rulerPinholeMaskCustomActive
                    ? 'true'
                    : 'false',
                  class: `ab-custom-box ${
                    state.rulerPinholeMaskCustomActive ? 'ab-active' : ''
                  }`,
                  id: 'ab-pinhole-mask-colour-custom-box',
                  onmouseover: [
                    aceCreatePickr,
                    {
                      id: '#ab-pinhole-mask-colour-custom-box',
                      action: rulerChangePinholeMaskCustomColour,
                    },
                  ],
                  onkeydown: handleButtonNavigation,
                  role: 'button',
                  tabindex: 0,
                  style: {
                    background: state.rulerPinholeMaskColourCustomCurrent,
                  },
                }),
              ]
            ),
          ]
        ),
      ]),
      // End outer section color

      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-counter',
          {
            'aria-valuemax': '90',
            'aria-valuemin': '20',
            'aria-valuenow': rulerPinholeOpacityPercentage,
            'aria-valuetext': `${rulerPinholeOpacityPercentage}%`,
            class: 'ab-counter ab-growable',
            role: 'spinbutton',
          },
          [
            h(
              'ab-counter-decrease',
              {
                'aria-label': 'Decrease pinhole ruler opacity',
                class: 'ab-dec ab-bar-button',
                id: 'ab-pinhole-ruler-opacity-dec',
                onclick: rulerPinholeOpacityDec,
                onmouseover: [
                  aceAddTippy,
                  {
                    id: '#ab-pinhole-ruler-opacity-dec',
                    content: 'Decrease Opacity',
                  },
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {
                    id: '#ab-pinhole-ruler-opacity-dec',
                    content: 'Decrease Opacity',
                  },
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-minus',
                }),
              ]
            ),
            h('ab-count-container', {class: 'ab-count-container'}, [
              h('ab-count-header', {class: 'ab-count-header'}, 'Opacity'),
              h(
                'ab-count-value',
                {class: 'ab-count'},
                `${rulerPinholeOpacityPercentage}%`
              ),
            ]),
            h(
              'ab-counter-increase',
              {
                'aria-label': 'Increase pinhole ruler opacity',
                class: 'ab-inc ab-bar-button',
                id: 'ab-pinhole-ruler-opacity-inc',
                onclick: rulerPinholeOpacityInc,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ruler-pinhole-opacity-inc', content: 'Increase'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ruler-pinhole-opacity-inc', content: 'Increase'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-plus',
                }),
              ]
            ),
          ]
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-counter',
          {
            'aria-valuemax': String(
              state.rulerPinholeCentreHeightMax /
                state.rulerPinholeCentreHeightStep
            ),
            'aria-valuemin': '1',
            'aria-valuenow': String(size),
            'aria-valuetext': String(size),
            class: 'ab-counter ab-growable',
            role: 'spinbutton',
          },
          [
            h(
              'ab-counter-decrease',
              {
                'aria-label': 'Decrease pinhole ruler size',
                class: 'ab-dec ab-bar-button',
                id: 'ab-pinhole-ruler-size-dec',
                onclick: rulerPinholeSizeDec,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-pinhole-ruler-size-dec', content: 'Decrease Size'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-pinhole-ruler-size-dec', content: 'Decrease Size'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-minus',
                }),
              ]
            ),
            h('ab-count-container', {class: 'ab-count-container'}, [
              h('ab-count-header', {class: 'ab-count-header'}, 'Size'),
              h('ab-count-value', {class: 'ab-count'}, size),
            ]),
            h(
              'ab-counter-increase',
              {
                'aria-label': 'Increase pinhole ruler size',
                class: 'ab-inc ab-bar-button',
                id: 'ab-pinhole-ruler-size-inc',
                onclick: rulerPinholeSizeInc,
                onmouseover: [
                  aceAddTippy,
                  {id: '#ab-ruler-pinhole-size-inc', content: 'Increase'},
                ],
                onmouseenter: [
                  aceSpeakTooltip,
                  {id: '#ab-ruler-pinhole-size-inc', content: 'Increase'},
                ],
                onkeydown: handleButtonNavigation,
                role: 'button',
                tabindex: 0,
              },
              [
                h('ab-icon', {
                  'aria-hidden': true,
                  class: 'ab-icon ab-icon-plus',
                }),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

const rulerOptionsInnerMenus = new Map([
  ['reading', rulerOptionsInnerReading],
  ['pinhole', rulerOptionsInnerPinhole],
]);

const rulerOptionsMenu = (state: Ace.State) => {
  let innerMenu = h('ab-placeholder', {}, '');

  if (rulerOptionsInnerMenus.has(state.rulerOpsInnerMenuCurrent)) {
    innerMenu = (
      rulerOptionsInnerMenus.get(state.rulerOpsInnerMenuCurrent) ||
      rulerOptionsInnerReading
    )(state);
  }

  return h('ab-menu-container', {class: 'ab-menu-container'}, [
    h('ab-menu-tabs', {class: 'ab-menu-tabs', role: 'tablist'}, [
      h(
        'ab-tab-button',
        {
          'aria-selected':
            state.rulerOpsInnerMenuCurrent === 'reading' ? 'true' : 'false',
          class: `ab-menu-tab-button ${
            state.rulerOpsInnerMenuCurrent === 'reading' ? 'ab-active' : ''
          }`,
          id: 'ab-tab-button-reading',
          onclick: [menuRulerOpsSwitchInner, 'reading'],
          onkeydown: handleButtonNavigation,
          role: 'tab',
          tabindex: 0,
        },
        'Reading'
      ),
      h(
        'ab-tab-button',
        {
          'aria-selected':
            state.rulerOpsInnerMenuCurrent === 'pinhole' ? 'true' : 'false',
          class: `ab-menu-tab-button ${
            state.rulerOpsInnerMenuCurrent === 'pinhole' ? 'ab-active' : ''
          }`,
          id: 'ab-tab-button-pinhole',
          onclick: [menuRulerOpsSwitchInner, 'pinhole'],
          onkeydown: handleButtonNavigation,
          role: 'tab',
          tabindex: 0,
        },
        'Pinhole'
      ),
    ]),
    h(
      'ab-inner-menu-container',
      {
        class: 'ab-menu-content',
        role: 'tabpanel',
      },
      [innerMenu]
    ),
  ]);
};

const srMenu = (state: Ace.State) => {
  return h('ab-sr-inner-menu', {class: 'ab-menu-content'}, [
    h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
      switchEl(
        state.srActive,
        srToggle,
        'Activate Speech Recognition',
        'Activate Speech Recognition',
        'ab-switch-srToggle'
      ),
    ]),
    h('ab-inner-menu-section', {class: 'ab-menu-content'}, [
      h(
        'ab-sr-last-dictation',
        {
          'aria-label': 'Shows the last dictation',
          class: 'ab-sr-last-dictation',
        },
        [
          h(
            'ab-sr-last-dictation-header',
            {class: 'ab-sr-last-dictation-header'},
            'Last Dictation:'
          ),
          h(
            'ab-sr-last-dictation-text',
            {class: 'ab-sr-last-dictation-text'},
            state.srLastDictation.length > 0
              ? state.srLastDictation
              : [
                  h(
                    'ab-sr-last-dictation-text-placeholder',
                    {class: 'ab-sr-last-dictation-placeholder'},
                    'Please use Speech Recognition to show the last dictation.'
                  ),
                ]
          ),
        ]
      ),
    ]),
  ]);
};

const ptMenu = (state: Ace.State) => {
  /* tslint:disable-next-line */
  const languageList: unknown[] = [];
  const languages = Object.entries(languageConfig as Ace.LanguageConfig);
  const currentLanguage =
    state.languageCurrentKey.length > 0
      ? languageConfig[state.languageCurrentKey].name || 'Select Language'
      : 'Select Language';

  for (const [key, obj] of languages) {
    const item = h(
      'ab-custom-list-selection-item',
      {
        class: 'ab-custom-list-selection-item',
        onclick: [languageToggleCurrent, key],
        onkeydown: (state: Ace.State, event: KeyboardEvent) => {
          const {type, code} = event;
          if (code !== 'Enter') {
            return state;
          }
          if (type !== 'keydown' && type !== 'click' && type !== 'keypress') {
            return state;
          }
          return [languageToggleCurrent, key];
        },
        role: 'option',
        tabindex: 0,
      },
      obj.name
    );

    languageList.push(item);
  }

  return h(
    'ab-page-translate-options-inner-menu-font',
    {class: 'ab-flex-column'},
    [
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        switchEl(
          state.ptActive,
          ptToggle,
          'Activate Page Translation',
          'Toggle Page Translation',
          'ab-switch-ptToggle'
        ),
      ]),
      h('ab-inner-menu-section', {class: 'ab-box ab-flex-column'}, [
        h(
          'ab-page-translate-options-menu',
          {
            class: 'ab-font-options',
          },
          [
            h(
              'ab-custom-list',
              {class: 'ab-custom-list ab-flex ab-flex-column'},
              [
                h(
                  'ab-custom-list-box',
                  {
                    class: 'ab-custom-list-box ab-flex ab-active',
                    id: 'ab-custom-list-box-language',
                    onclick: languageToggleList,
                    onkeydown: (state: Ace.State, event: KeyboardEvent) => {
                      const {type, code} = event;
                      if (code !== 'Enter') {
                        return state;
                      }
                      if (
                        type !== 'keydown' &&
                        type !== 'click' &&
                        type !== 'keypress'
                      ) {
                        return state;
                      }
                      return languageToggleList;
                    },
                    style: {},
                    tabindex: 0,
                  },
                  currentLanguage
                ),
                h(
                  'ab-custom-list-selection',
                  {
                    'aria-labelledby': 'ab-custom-list-box',
                    class: `ab-custom-list-selection ${
                      state.selectLanguageListActive ? 'ab-flex' : 'ab-hide'
                    } ab-flex-column ${state.ptActive ? 'disabled' : ''}`,
                    id: 'ab-language-list-selection',
                    role: 'listbox',
                  },
                  languageList
                ),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};

export {
  ttsMenu,
  textOptionsMenu,
  magMenu,
  maskMenu,
  rulerOptionsMenu,
  srMenu,
  ptMenu,
  switchEl,
};
