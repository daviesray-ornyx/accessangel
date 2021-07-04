import {h} from 'hyperapp';
import {magStartDrag, magEndDrag, magUpdateSize} from '../actions/mag.actions';

const mag = ({
  magPageContent,
  magActive,
  magTranslateX,
  magTranslateY,
  magScale,
  menusHidden,
  magPosX,
  magPosY,
  magPageX,
  magPageY,
  magHeight,
  magWidth,
}: Ace.State) => {
  return h(
    'ab-mag-window',
    {
      'aria-label':
        'Magnifier window. Move by holding down the left mouse button and dragging',
      class: `ab-magnifier-window ab-draggable ${
        magActive && !menusHidden ? '' : 'ab-hide'
      }`,
      id: 'ab-magnifier-window',
      onmouseup: magUpdateSize,
      ontouchcancel: magUpdateSize,
      ontouchend: magUpdateSize,
      style: {
        height: `${magHeight}px`,
        left: `${magPosX}px`,
        top: `${magPosY}px`,
        width: `${magWidth}px`,
        hover: '',
        overflow: 'hidden',
        resize: 'both',
      },
    },
    [
      h(
        'ab-mag-page-container',
        {
          class: 'ab-magnifier-page-container',
          id: 'ab-magnifier-page-container',
          ontouchstart: magStartDrag,
          onmousedown: magStartDrag,
          onmouseup: magEndDrag,
          ontouchcancel: magEndDrag,
          ontouchend: magEndDrag,
          style: {
            height: '100%',
            width: '100%',
          },
        },
        [
          h('iframe', {
            'aria-hidden': 'true',
            scrolling: 'no',
            scroll: 'no',
            class: 'ab-magnifier-page',
            id: 'ab-magnifier-page',
            srcdoc: magPageContent,
            style: {
              // overflow: 'hidden',
              left: `${magPageX}px`,
              top: `${magPageY}px`,
              transform: `translate(${magTranslateX}px, ${magTranslateY}px) scale(${magScale})`,
            },
          }),
        ]
      ),
    ]
  );
};

export default mag;
export {mag};
