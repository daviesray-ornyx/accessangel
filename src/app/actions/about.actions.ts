function aboutOpen(state: Ace.State) {
  return {
    ...state,
    aboutHidden: false,
  };
}

function aboutClose(state: Ace.State, event: KeyboardEvent) {
  const {code} = event;
  if (code === 'Enter' || event.type === 'click') {
    return {
      ...state,
      aboutHidden: true,
    };
  }
  return state;
}

export {aboutOpen, aboutClose};
