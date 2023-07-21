import * as types from "../constants";
import {api} from "../fetch";
import { ConfigType } from "../reducers/systemReducer";
import { Dispatch } from "redux";

export const systemMainFetch = (dispatch: Dispatch, chainId: number) => {
  const promise = api.get('/system/main/'+chainId);
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

export const loaderStop = (dispatch: Dispatch) => {
  dispatch({
    type: types.SYSTEM_LOADER_STOP,
  });
}
export const loaderProgress = (dispatch: Dispatch, progress: number) => {
  dispatch({
    type: types.SYSTEM_LOADER_PROGRESS,
    progress
  });
}
