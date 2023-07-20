import * as types from "../constants";

const initialState = {
  profileMenu: false,
  walletMenu: false,

  likeModal: false,
  likeModalParams: {},

  postControllsModal: false,
  postControllsModalParams: {},

  viewsModal: false,
  viewsModalParams: {},

  followersModal: false,
  followersModalParams: {},

  followingModal: false,
  followingModalParams: {},

  shareModal: false,
  shareModalParams: {},

  selectModal: false,
  selectModalParams: {},
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.THEME_OPEN_MODAL:
      return { ...state, selectModal: action.code, selectModalParams: action.params };
    case types.THEME_CLOSE_MODAL:
      return { ...state, selectModal: false, selectModalParams: {} };

    case types.THEME_OPEN_POST_CONTROLLS_MODAL:
      return { ...state, postControllsModal: true, postControllsModalParams: action.params };
    case types.THEME_CLOSE_POST_CONTROLLS_MODAL:
      return { ...state, postControllsModal: false, postControllsModalParams: {} };

    case types.THEME_OPEN_PROFILE_MENU:
      return { ...state, profileMenu: true };
    case types.THEME_CLOSE_PROFILE_MENU:
      return { ...state, profileMenu: false };
    case types.THEME_OPEN_WALLET_MENU:
      return { ...state, walletMenu: true };
    case types.THEME_CLOSE_WALLET_MENU:
      return { ...state, walletMenu: false };
    case types.THEME_OPEN_LIKE_MODAL:
      return { ...state, likeModal: true, likeModalParams: action.params };
    case types.THEME_CLOSE_LIKE_MODAL:
      return { ...state, likeModal: false };
    case types.THEME_OPEN_VIEW_MODAL:
      return { ...state, viewsModal: true, viewsModalParams: action.params };
    case types.THEME_CLOSE_VIEW_MODAL:
      return { ...state, viewsModal: false };
    case types.THEME_OPEN_FOLLOWERS_MODAL:
      return { ...state, followersModal: true, followersModalParams: action.params };
    case types.THEME_CLOSE_FOLLOWERS_MODAL:
      return { ...state, followersModal: false };
    case types.THEME_OPEN_FOLLOWING_MODAL:
      return { ...state, followingModal: true, followingModalParams: action.params };
    case types.THEME_CLOSE_FOLLOWING_MODAL:
      return { ...state, followingModal: false };
    case types.THEME_OPEN_SHARE_MODAL:
      return { ...state, shareModal: true, shareModalParams: action.params };
    case types.THEME_CLOSE_SHARE_MODAL:
      return { ...state, shareModal: false };
    default:
      return state;
  }
}
