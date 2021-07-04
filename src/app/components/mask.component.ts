import {h} from 'hyperapp';

const mask = ({maskActive, maskColourCurrent, maskOpacity}: Ace.State) => {
  return h('ab-mask', {
    'aria-hidden': 'true',
    class: `ab-mask ${maskActive ? '' : 'ab-hide'}`,
    style: {
      background: maskColourCurrent,
      opacity: maskOpacity,
    },
  });
};

export default mask;
export {mask};
