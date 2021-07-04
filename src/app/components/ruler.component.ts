import {h} from 'hyperapp';
import BigNumber from 'bignumber.js';

const rulerReadingBar = ({
  rulerReadingActive,
  rulerReadingColourCurrent,
  rulerPosY,
  rulerReadingOffset,
  rulerReadingOpacity,
  rulerHeight,
}: Ace.State) => {
  return h('ab-reading-ruler', {
    'aria-hidden': 'true',
    class: `ab-reading-ruler ${rulerReadingActive ? '' : 'ab-hide'}`,
    style: {
      opacity: rulerReadingOpacity,
      top: `${new BigNumber(rulerPosY).plus(rulerReadingOffset).toString()}px`,
      height: `${rulerHeight}px`,
      background: rulerReadingColourCurrent,
    },
  });
};

const rulerPinhole = ({
  rulerPinholeCentreHeight,
  rulerPosY,
  rulerPinholeOpacity,
  rulerPinholeActive,
  rulerPinholeMaskColourCurrent,
}: Ace.State) => {
  const height = new BigNumber(window.innerHeight);
  const handleHeight1 = new BigNumber(rulerPosY).minus(
    rulerPinholeCentreHeight / 2
  );
  const handleHeight2 = height
    .minus(rulerPosY)
    .minus(rulerPinholeCentreHeight / 2);

  return h(
    'ab-pinhole-ruler-container',
    {
      'aria-hidden': 'true',
      class: `ab-pinhole-ruler-container ${
        rulerPinholeActive ? '' : 'ab-hide'
      }`,
    },
    [
      h('ab-pinhole-ruler-handle', {
        'aria-hidden': 'true',
        class: 'ab-pinhole-ruler-handle ab-top',
        style: {
          background: 'black',
          opacity: 0.65,
          height: `${handleHeight1}px`,
        },
      }),
      h('ab-pinhole-ruler-centre', {
        'aria-hidden': 'true',
        class: 'ab-pinhole-ruler-centre',
        style: {
          height: `${rulerPinholeCentreHeight}px`,
          //top: `${new BigNumber(rulerPosY).plus(rulerPinholeCentreHeight / 2)}px`,
          top: `${new BigNumber(rulerPosY).minus(
            rulerPinholeCentreHeight / 2
          )}px`,
          opacity: rulerPinholeOpacity,
          background: `${rulerPinholeMaskColourCurrent}`,
        },
      }),
      h('ab-pinhole-ruler-handle', {
        'aria-hidden': 'true',
        class: 'ab-pinhole-ruler-handle ab-bottom',
        style: {
          background: 'black',
          // opacity: rulerPinholeOpacity,
          opacity: 0.65,
          height: `${handleHeight2}px`,
        },
      }),
    ]
  );
};

export default rulerReadingBar;
export {rulerReadingBar, rulerPinhole};
