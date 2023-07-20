import * as types from "../constants";
import {api} from "../fetch";
import { ConfigType } from "../reducers/systemReducer";

export const systemMainFetch = (dispatch: any) => {
  const promise = api.get('/system/main');
  promise.then((json: {
    data: ConfigType
  }) => {
    promise.finally(async () => {
      dispatch({
        type: types.SYSTEM_SET_CONFIG,
        data: json.data
      });
    });
    return json;
  });
  return promise;
};

export const loaderStart = (dispatch: any) => {
  dispatch({
    type: types.SYSTEM_LOADER_START,
  });
}

export const loaderStop = (dispatch: any) => {
  dispatch({
    type: types.SYSTEM_LOADER_STOP,
  });
}
export const loaderProgress = (dispatch: any, progress: number) => {
  dispatch({
    type: types.SYSTEM_LOADER_PROGRESS,
    progress
  });
}
