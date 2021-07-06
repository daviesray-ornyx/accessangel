import BigNumber from 'bignumber.js';
import voices from '../../config/tts.config.json5';

const stateToolbar: Ace.StateToolbar = {
  aceHidden: false,
  aceTooltips: new Map(),
  aceTooltipSpeakTimeout: 0,
  aceOpenDefaults: true,
  aceSpeakTooltips: false,
  aceTheme: 'default-theme',
};

const stateFont: Ace.StateFont = {
  fontActive: false,
  fontColourActive: false,
  fontColourCurrent: '',
  fontColourCustomCurrent: '#fff',
  fontCurrentKey: '',
  fontCustomActive: false,
  fontLetterSpacingActive: false,
  fontLetterSpacingCount: 0,
  fontLetterSpacingMax: 50,
  fontLetterSpacingStep: 1,
  fontLineSpacingActive: false,
  fontLineSpacingCount: 0,
  fontLineSpacingMax: 50,
  fontLineSpacingStep: 1,
  fontSizingActive: false,
  fontSizingRelative: 0,
  textOpsInnerMenuCurrent: 'font',
  selectFontListActive: false,
};

const stateMag: Ace.StateMag = {
  magActive: false,
  magBorder: 4,
  magCanDrag: false,
  magHeight: new BigNumber(window.innerHeight)
    .times(0.3)
    .decimalPlaces(0)
    .toNumber(), // Initialize at 30% of screen
  magHeightMin: 50,
  magHeightOffset: 0,
  magPosX: 0,
  magPosY: 0,
  magInitialX: 0,
  magInitialY: 0,
  magOffsetX: 0,
  magOffsetY: 0,
  magPageContent: '',
  magPageOffsetX: 0,
  magPageOffsetY: 0,
  magPageX: 0,
  magPageY: 0,
  magScale: '1.5',
  magScaleMax: 5.0,
  magScaleMin: 0.5,
  magScaleStep: 0.1,
  magTranslateX: 0,
  magTranslateY: 0,
  magWidth: new BigNumber(window.innerWidth)
    .times(0.3)
    .decimalPlaces(0)
    .toNumber(),
  magWidthMin: 50,
  magWidthOffset: 0,
  magCanResize: false,
  magResizeStartX: 0,
  magResizeStartY: 0,
  magSizeChangeStep: 0.1,
};

const stateFeedback: Ace.StateFeedback = {
  // Feedback state Items
  feedbackProvided: false,
  feedbackActive: false,
};

const stateMask: Ace.StateMask = {
  maskActive: false,
  maskColourCurrent: 'green',
  maskColourCustomCurrent: '#fff',
  maskCustomActive: false,
  maskOpacity: '0.3',
  maskOpacityMax: 0.95,
  maskOpacityMin: 0.05,
  maskOpacityStep: 0.05,
};

const stateMenus: Ace.StateMenus = {
  menusHidden: false,
  menusCanDrag: false,
  menusDragActive: '',
  menus: {},
};

const stateDrag: Ace.StateDrag = {
  dragMouseX: 0,
  dragMouseY: 0,
  dragActive: false,
};

const stateRuler: Ace.StateRuler = {
  rulerOpsInnerMenuCurrent: 'reading',
  rulerEventActive: false,
  rulerPosX: 0,
  rulerPosY: 0,
  rulerPinholeActive: false,
  rulerPinholeCentreHeight: 48,
  rulerPinholeCentreHeightMax: 144,
  rulerPinholeCentreHeightMin: 12,
  rulerPinholeCentreHeightStep: 12,
  rulerPinholeMaskColourCurrent: 'red',
  rulerPinholeMaskColourCustomCurrent: '#fff',
  rulerPinholeMaskCustomActive: false,
  rulerPinholeCustomActive: false,
  rulerPinholeOpacity: '0.6',
  rulerPinholeOpacityMax: 0.9,
  rulerPinholeOpacityMin: 0.2,
  rulerPinholeOpacityStep: 0.05,
  rulerReadingActive: false,
  rulerReadingOffset: 8,
  rulerReadingOpacity: '0.6',
  rulerReadingOpacityMax: 1,
  rulerReadingOpacityMin: 0.2,
  rulerReadingOpacityStep: 0.05,
  rulerReadingColourCurrent: 'black',
  rulerReadingCustomColourCurrent: '#fff',
  rulerReadingCustomColourActive: false,
  rulerHeight: 48,
  rulerHeightMax: 200,
  rulerHeightMin: 12,
  rulerHeightStep: 12,
};

const stateSettings: Ace.StateSettings = {
  settingsHidden: true,
};

const stateAbout: Ace.StateAbout = {
  aboutHidden: true,
};

const stateSR: Ace.StateSR = {
  srActive: false,
  srLang: 'en',
  srLangName: 'English',
  srLangListActive: false,
  srRuntime: false,
  srLastDictation: '',
};

const stateTranslation: Ace.StateTranslation = {
  ptActive: false,
  languageActive: false,
  languageCurrentKey: '',
  selectLanguageListActive: false,
  ptPageUrlCached: '',
  ptTTSVoiceBackup: {
    name: 'English (British)',
    lang: 'en-GB',
  },
  parentElements: new Set<HTMLElement>(),
};

const stateKeyboardShortcut: Ace.StateKeyboardShortcuts = {
  kbsReady: true,
  kbsCount: 0,
  kbsKeyCombination: '',
};

const stateTabbing: Ace.StateTabbing = {
  tabContainerCurrent: 'ab-button-area',
  tabContainerActive: true,
  tabContainerActivator: '',
  tabParentContainer: '',
};

const stateTTS: Ace.StateTTS = {
  ttsCurrentVoiceName: 'English (British)',
  ttsHighlightSpeak: false,
  ttsHoverSpeak: false,
  ttsInitiated: false,
  ttsVoice: {
    name: 'English (British)',
    lang: 'en-GB',
  },
  ttsVoiceActive: false,
  ttsVoiceListActive: false,
  ttsGenderListActive: false,
  ttsVoices: voices,
  ttsAudio: new Audio(),
  ttsAudioState: 'None',
  ttsGenders: ['Neutral', 'Female', 'Male'],
  ttsGender: 'Neutral',
};

const stateSimplify: Ace.StateSimplify = {
  simplifyHidden: true,
  simplifyText: '',
};

const state = {
  ...stateToolbar,
  ...stateFont,
  ...stateMag,
  ...stateFeedback,
  ...stateMask,
  ...stateMenus,
  ...stateDrag,
  ...stateRuler,
  ...stateSettings,
  ...stateAbout,
  ...stateSR,
  ...stateTranslation,
  ...stateKeyboardShortcut,
  ...stateTabbing,
  ...stateTTS,
  ...stateSimplify,
};

export default state;
