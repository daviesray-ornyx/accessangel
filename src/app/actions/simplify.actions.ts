import DOMPurify from 'dompurify';
import {fxSimplify} from '../fx/simplify.fx';

function simplifyOpen(state: Ace.State) {
  const nodeClone = document.documentElement.cloneNode(true);
  const aceEl = (nodeClone as HTMLElement).querySelector('ace-app');

  if (aceEl && aceEl.parentElement) {
    aceEl.parentElement.removeChild(aceEl);
  }

  const htmlClean = DOMPurify.sanitize((nodeClone as HTMLElement).outerHTML, {
    WHOLE_DOCUMENT: true,
  });

  return [
    {
      ...state,
      simplifyHidden: false,
    },
    fxSimplify({html: htmlClean}),
  ];
}

function simplifyClose(state: Ace.State) {
  return {
    ...state,
    simplifyHidden: true,
  };
}

export {simplifyClose, simplifyOpen};
