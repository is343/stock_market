import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const endpoint = "http://localhost:5000/";
const socket = socketIOClient(endpoint);

class SocketTest extends Component {
  constructor() {
    super();

    this.state = {
      inputText: "",
    };
  }

  // sending sockets
  getAll = () => {
    // const socket = socketIOClient(this.state.endpoint);
    socket.emit("read");
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAdd = stock => {
    // const socket = socketIOClient(this.state.endpoint);
    socket.emit("create", stock);
    this.setState({ inputText: "" });
  };

  handleDelete = stock => {
    // const socket = socketIOClient(this.state.endpoint);
    socket.emit("delete", stock);
    this.setState({ inputText: "" });
  };

  render() {
    // testing for socket connections

    // const socket = socketIOClient(this.state.endpoint);
    socket.on("read", stocks => {
      console.log(stocks);
    });
    socket.on("message", message => {
      console.log(message);
    });

    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.getAll()}>Get All Stocks</button>
        <input
          type="text"
          name="inputText"
          value={this.state.inputText}
          onChange={this.handleChange}
        />
        <button id="blue" onClick={() => this.handleAdd(this.state.inputText)}>
          Add
        </button>
        <button
          id="red"
          onClick={() => this.handleDelete(this.state.inputText)}
        >
          Delete
        </button>
      </div>
    );
  }
}

export default SocketTest;
