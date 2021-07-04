import {fxCloseAce} from '../fx/close.fx';

function closeAce(state) {
  if (!state.feedbackProvided) {
    return {
      ...state,
      feedbackActive: true,
    };
  }

  return [state, fxCloseAce()];
}

export default closeAce;
export {closeAce};
