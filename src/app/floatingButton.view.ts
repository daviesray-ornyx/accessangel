import {h} from 'hyperapp';
import aceLogoWhite from '../images/ace_logo_white.png';

const floatingButton = () => {
  return h('ab-fb', {class: 'ab-fb'}, [
    h(
      'ab-fb-circle',
      {
        'aria-labelledby': 'ab-fb-info',
        class: 'ab-fb-circle',
      },
      [h('img', {class: 'ab-fb-circle-img', src: aceLogoWhite})]
    ),
    h('ab-fb-info', {id: 'ab-fb-info', class: 'ab-fb-info'}, [
      h('img', {class: 'ab-fb-circle-img-inline', src: aceLogoWhite}),
      'Accessibility',
      h('br'),
      'Tools',
    ]),
  ]);
};

export default floatingButton;
