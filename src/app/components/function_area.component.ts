import {h} from 'hyperapp';
import mag from './mag.component';
import mask from './mask.component';
import {rulerReadingBar, rulerPinhole} from './ruler.component';
import feedback from './feedback.component';

const funcArea = state => {
  return h('ab-func-area', {class: 'ab-func-area'}, [
    mag(state),
    mask(state),
    rulerReadingBar(state),
    rulerPinhole(state),
    feedback(state),
  ]);
};

export default funcArea;
export {funcArea};
