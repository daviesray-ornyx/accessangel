import {apiSendEvent} from './api.actions';
import {fxCloseAce} from '../fx/close.fx';

function thumbsUpFeedback(state: Ace.State) {
  !state.feedbackProvided && apiSendEvent('AceFeedbackPositive');

  return {
    ...state,
    feedbackProvided: true,
  };
}

function thumbsDownFeedback(state: Ace.State) {
  !state.feedbackProvided && apiSendEvent('AceFeedbackNegative');

  return {
    ...state,
    feedbackProvided: true,
  };
}

function tellMeMore(state: Ace.State) {
  const surveyLink =
    'https://docs.google.com/forms/d/e/1FAIpQLSfZZcV1Vz6DrNVXxGJ9cszlv5zrVg5MpJCeXqonZI5-8uWdBg/viewform';
  // open link in new tab
  window.open(surveyLink);

  return [
    {
      ...state,
      feedbackProvided: true,
      feedbackActive: false,
    },
    fxCloseAce(),
  ];
}

function closeFeedback(state: Ace.State, event: KeyboardEvent) {
  const {code} = event;
  if (code === 'Enter' || event.type === 'click') {
    apiSendEvent('Feedback Ignored');
    apiSendEvent('AceClosed');

    return [
      {
        ...state,
        feedbackActive: false,
      },
      fxCloseAce(),
    ];
  }
  return state;
}

export {thumbsUpFeedback, thumbsDownFeedback, tellMeMore, closeFeedback};
