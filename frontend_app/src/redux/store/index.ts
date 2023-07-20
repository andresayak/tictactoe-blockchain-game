import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";

const multiActionMiddleware = (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case "MULTI_ACTION": {
      next(action);
      return action.payload.actions.map((a: any) => store.dispatch(a));
    }
    default:
      return next(action);
  }
};
export default createStore(rootReducer, applyMiddleware(multiActionMiddleware));
