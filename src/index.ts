import '@webcomponents/custom-elements';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// import css
import './css';

// import app
import Accessabar from './app';

// accept HMR
if (module && module.hot) {
  module.hot.accept();
}

export default Accessabar;
