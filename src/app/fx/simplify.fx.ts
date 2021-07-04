import {apiGetSimplify} from '../actions/api.actions';

function fxSimplify(data: Ace.SimplifyData) {
  return [
    (dispatch, props) => {
      apiGetSimplify(props.data).then(simplifyData => {
        if (simplifyData?.text) {
          dispatch(state => ({...state, simplifyText: simplifyData.text}));
        }
      });
    },
    {
      data,
    },
  ];
}

export {fxSimplify};
