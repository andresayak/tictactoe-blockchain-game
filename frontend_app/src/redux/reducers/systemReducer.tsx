import * as types from "../constants";

export type ConfigType = {
  FACTORY_ADDRESS: string;
}

const initialState = {
  loaded: false,
  loader: false,
  loader_progress: 0,
  configs: {
    FACTORY_ADDRESS: null,
  },
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.SYSTEM_SET_CONFIG:
      return { ...state, loaded: true, configs: action.data };
    case types.SYSTEM_LOADER_START:
      return { ...state, loader: true, loader_progress: 0 };
    case types.SYSTEM_LOADER_STOP:
      return { ...state, loader: false, loader_progress: 100 };
    case types.SYSTEM_LOADER_PROGRESS:
      return { ...state, loader_progress: action.progress };
    default:
      return state;
  }
}
