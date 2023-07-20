import {
    multiAction
} from "./connectionActions";

import * as types from "../constants";

export type successActionResponse = {
    success: boolean;
    type: string;
    data: any
}

export const openModal = (dispatch: any, code: string, params: any = {}) => {
    dispatch({
        type: types.THEME_OPEN_MODAL,
        code, params
    })
};
export const changeModal = (dispatch: any, code: string, params: any = {}) => {
    dispatch(multiAction([
        {
            type: types.THEME_CLOSE_MODAL
        },
        {
            type: types.THEME_OPEN_MODAL,
            code, params
        }
    ]));
};
export const closeModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_MODAL
    })
};

export const openPostControllsModal = (dispatch: any, params: any) => {
    dispatch({
        type: types.THEME_OPEN_POST_CONTROLLS_MODAL,
        params
    })
};

export const closePostControllsModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_POST_CONTROLLS_MODAL
    })
};

export const openFollowingModal = (dispatch: any, params: any) => {
    dispatch({
        type: types.THEME_OPEN_FOLLOWING_MODAL,
        params
    })
};

export const closeFollowingModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_FOLLOWING_MODAL
    })
};

export const openFollowersModal = (dispatch: any, params: any) => {
    dispatch({
        type: types.THEME_OPEN_FOLLOWERS_MODAL,
        params
    })
};

export const closeFollowersModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_FOLLOWERS_MODAL
    })
};

export const openViewsModal = (dispatch: any, params: any) => {
    dispatch({
        type: types.THEME_OPEN_VIEW_MODAL,
        params
    })
};

export const closeViewsModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_VIEW_MODAL
    })
};

export const openLikeModal = (dispatch: any, params: any) => {
    dispatch({
        type: types.THEME_OPEN_LIKE_MODAL,
        params
    })
};

export const closeLikeModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_LIKE_MODAL
    })
};

export const openShareModal = (dispatch: any, params: any) => {
    dispatch({
        type: types.THEME_OPEN_SHARE_MODAL,
        params
    })
};

export const closeShareModal = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_SHARE_MODAL
    })
};


export const openWalletMenu = (dispatch: any) => {
    dispatch({
        type: types.THEME_OPEN_WALLET_MENU
    })
};

export const closeWalletMenu = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_WALLET_MENU
    })
};

export const openProfileMenu = (dispatch: any) => {
    dispatch({
        type: types.THEME_OPEN_PROFILE_MENU
    })
};

export const closeProfileMenu = (dispatch: any) => {
    dispatch({
        type: types.THEME_CLOSE_PROFILE_MENU
    })
};
