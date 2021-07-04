import {h} from 'hyperapp';
import * as Buttons from './buttons.component';
import {switchEl} from './menus.component';
import {aceSpeakTooltipsToggle} from '../actions/ace.actions';
import isMobile from 'is-mobile';

const innerBarSettings = state => {
  return [
    h(
      'ab-inner-bar-settings',
      {class: 'ab-inner-bar-settings'},
      switchEl(
        state.aceSpeakTooltips,
        aceSpeakTooltipsToggle,
        'Speak Tooltips',
        'Read tooltips aloud on hover',
        'ab-switch-menu-speak-tooltip'
      )
    ),
  ];
};

// Contains all the buttons in Ace
const buttonArea = (state: Ace.State) => {
  const mobile = isMobile({
    tablet: true,
    featureDetect: true,
  });
  return h(
    'ab-button-area',
    {
      'aria-role': 'toolbar',
      class: 'ab-button-area ab-growable ab-flex-wrap',
      id: 'ab-button-area',
    },
    [
      h('ab-button-section', {class: 'ab-flex'}, [
        h(
          'ab-button-group',
          {
            class: `ab-group ${
              state.ttsHoverSpeak || state.ttsHighlightSpeak
                ? 'ab-flex'
                : 'ab-hide'
            }`,
            'aria-label': 'Sound controls',
          },
          [Buttons.stopButton()]
        ),
        h('ab-button-group', {class: 'ab-group ab-flex ab-flex-wrap'}, [
          !mobile && Buttons.ttsButton(state),
          Buttons.incButton(),
          Buttons.decButton(),
          Buttons.fontResetButton(state),
          Buttons.textOpsButton(state),
          !mobile && Buttons.magButton(state),
          Buttons.maskButton(state),
          !mobile && Buttons.rulerButton(state),
          !mobile && Buttons.srButton(state),
          Buttons.ptButton(state),
          Buttons.simplifyButton(state),
        ]),
      ]),
      h('ab-button-section', {class: 'ab-flex ab-flex-wrap'}, [
        !mobile && innerBarSettings(state),
        Buttons.resetButton(),
        Buttons.settingsButton(state),
        Buttons.aboutButton(state),
        Buttons.closeButton(),
      ]),
    ]
  );
};

export default buttonArea;
export {buttonArea};
