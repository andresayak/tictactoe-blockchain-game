import store from '../store';

export type UploadToken = { token: string, host: string };

export const multiAction = (actions: any, meta = {}) => ({
    type: 'MULTI_ACTION',
    payload: {actions},
    meta
});

export type successActionResponse = {
    success: boolean;
    type: string;
    data: any
};

export const request = (dispatch: any, url: string, params: any = {}) => {
    return fetch(url, params).then((res) => {
        if (res.ok)
            return res;
        new Error(res.statusText);
        return res;
    }).then(response => {
        return response;
    });
};

export const requestJsonPrivatePost = (dispatch: any, url: string, postdata: any = {}, method = 'POST') => {
    // @ts-ignore
    let accessToken = store.getState().auth.access_token;
    return request(dispatch, process.env['NX_API_HOST'] + url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + accessToken
        },
        mode: "cors",
        method: method,
        body: JSON.stringify(postdata)
    }).then(response => response.json());
};

export const requestJsonPostFormData = (dispatch: any, url: string, uploadToken: string, postdata: any, method = 'POST', file: any = false) => {
    const formData = new FormData();
    Object.keys(postdata).forEach(key => formData.append(key, postdata[key]));
    return request(dispatch, url, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + uploadToken
        },
        mode: "cors",
        method: method,
        body: formData
    }).then(response => response.json());
};

export const requestJsonRefreshToken = (dispatch: any, url: string, method = 'GET') => {
    // @ts-ignore
    let accessToken = store.getState().auth.refresh_token;
    return request(dispatch, process.env['NX_API_HOST'] + url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + accessToken
        },
        mode: "cors",
        method: method,
    }).then(response => response.json());
};

export const requestJsonPrivateGet = (dispatch: any, url: string, method = 'GET', headers = {}) => {
    // @ts-ignore
    let accessToken = store.getState().auth.access_token;
    return request(dispatch, process.env['NX_API_HOST'] + url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + accessToken,
            ...headers
        },
        mode: "cors",
        method: method
    }).then(response => response.json());
};

export const requestJsonGet = (dispatch: any, url: string, method = 'GET', headers = {}) => {
    return request(dispatch, process.env['NX_API_HOST'] + url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            ...headers
        },
        mode: "cors",
        method: method
    }).then(response => response.json());
};

export const requestJsonPost = (dispatch: any, url: string, postdata: any, method = 'POST') => {
    return request(dispatch, process.env['NX_API_HOST'] + url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
        },
        mode: "cors",
        method: method,
        body: JSON.stringify(postdata)
    }).then(response => response.json());
};
