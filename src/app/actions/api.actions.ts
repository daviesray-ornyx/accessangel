import {v4 as uuidv4} from 'uuid';

async function doRequest(link, req) {
  return fetch(link, req).catch(err => {
    console.log('[AccessAngel API] Error: ', err);
  });
}

async function handleRequest(link, req) {
  const res = await doRequest(link, req);
  if (res) {
    return res.json();
  }
}

async function apiSendEvent(eventType: string) {
  if (!localStorage) {
    return;
  }

  const host = location.hostname;

  if (host === 'localhost' || host === '') {
    return;
  }

  let userID = localStorage.getItem('ace_user');

  if (!userID) {
    const newID = uuidv4();
    localStorage.setItem('ace_user', newID);

    userID = newID;
  }

  const data = {
    host,
    user: userID,
    type: eventType.trim(),
  };

  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: {'Content-Type': 'application/json'},
  };

  await handleRequest('https://ace-ctrl.acetoolbar.com/api/v1/event/add', req);
}

async function apiGetTranslation(data: Ace.TranslateData) {
  const headers = new Headers({
    Authorization: `Bearer ${window.aceRuntimeProxy.authToken}`,
    'Content-Type': 'application/json',
  });
  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    credentials: 'include',
    headers,
  };

  return handleRequest('https://trans.accessangel.app/api/v1/translate', req);
}

async function apiGetTTS(data: Ace.TTSData) {
  const headers = new Headers({
    Authorization: `Bearer ${window.aceRuntimeProxy.authToken}`,
    'Content-Type': 'application/json',
  });
  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    credentials: 'include',
    headers,
  };

  return handleRequest('https://tts.accessangel.app/api/v1/text', req);
}

async function apiGetSimplify(data: Ace.SimplifyData) {
  const headers = new Headers({
    Authorization: `Bearer ${window.aceRuntimeProxy.authToken}`,
    'Content-Type': 'application/json',
  });
  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    credentials: 'include',
    headers,
  };

  return handleRequest('https://simp.accessangel.app/api/v1/simplify', req);
}

export {apiSendEvent, apiGetTranslation, apiGetTTS, apiGetSimplify};
