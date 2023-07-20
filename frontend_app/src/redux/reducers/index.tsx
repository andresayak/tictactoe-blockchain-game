import { combineReducers } from "redux";

import connection from "./connectionReducer";
import system from "./systemReducer";
import theme from "./themeReducer";

let modules: any = {
  connection,
  system,
  theme,
};
export default combineReducers(modules);
