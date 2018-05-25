import React, { Component } from "react";
import { Provider } from "react-redux";

import { store } from "./store";
import "./App.css";
import SocketedWindow from "./containers/socket_window";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">FreeCodeCamp - Chart the Stock Market</h1>
          </header>
          <div>
            <SocketedWindow />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
