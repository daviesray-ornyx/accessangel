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
  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: {'Content-Type': 'application/json'},
  };

  return handleRequest('https://trans.acetoolbar.com/api/v1/translate', req);
}

async function apiGetTTS(data: Ace.TTSData) {
  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: {'Content-Type': 'application/json'},
  };

  return handleRequest('https://ace-tts.acetoolbar.com/api/v1/text', req);
}

async function apiGetSimplify(data: Ace.SimplifyData) {
  const req = {
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: {'Content-Type': 'application/json'},
  };

  return handleRequest('https://simplify.acetoolbar.com/api/v1/simplify', req);
}

export {apiSendEvent, apiGetTranslation, apiGetTTS, apiGetSimplify};
