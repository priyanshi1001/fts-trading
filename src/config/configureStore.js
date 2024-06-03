import { combineReducers, applyMiddleware } from "redux";
import { legacy_createStore as createStore } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import reducers from "../reducers";
import {
  
  getAllContentReducer,
 

  

} from "../redux/Reducers";

export default function configureStore() {
  return createStore(
    combineReducers({
      ...reducers,

      getAllContentReducer,
  

  
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
}
