import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";

import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const middleware = [thunk, promiseMiddleware()];

if (process.env.NODE_ENV !== "production") {
  const logger = createLogger({ collapsed: true });
  middleware.push(logger);
}

// setup for redux devtools extension
const withDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  withDevTools(applyMiddleware(...middleware)),
);
