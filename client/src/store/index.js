import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const history = createHistory();

const middleware = [routerMiddleware(history), thunk, promiseMiddleware()];

if (process.env.NODE_ENV !== "production") {
  const logger = createLogger({ collapsed: true });
  middleware.push(logger);
}

// setup for redux devtools extension
const withDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  withDevTools(applyMiddleware(...middleware))
);

export { store, history };
