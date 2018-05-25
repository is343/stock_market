import React, { Component } from "react";
import _ from "lodash";
import socketIOClient from "socket.io-client";

import StockChart from "./highchart";

const endpoint = "http://localhost:5000/";
const socket = socketIOClient(endpoint);

class SocketTest extends Component {
  constructor() {
    super();

    this.state = {
      inputText: "",
      stockData: [],
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

  handleDeleteSend = stock => {
    // const socket = socketIOClient(this.state.endpoint);
    socket.emit("delete", stock);
    this.setState({ inputText: "" });
  };

  handleDeleteReceive = stock => {
    const currentStocks = _.cloneDeep(this.state.stockData);
    const filteredStocks = currentStocks.filter(val => {
      return val.stock !== stock;
    });
    this.setState({ stockData: filteredStocks });
  };

  handleRead = stockData => {
    this.setState({ stockData });
  };

  handleReadOne = stock => {
    const stockName = stock.stock;
    const updatedData = _.cloneDeep(this.state.stockData);
    // prevent multiples due to bounces
    let bounceCheck = false;
    bounceCheck = updatedData.some(val => {
      return val.stock === stockName;
    });
    if (!bounceCheck) {
      updatedData.push(stock);
    }
    this.setState({ stockData: updatedData });
  };

  render() {
    socket.on("read", stocks => {
      this.handleRead(stocks);
    });
    socket.on("readOne", stock => {
      this.handleReadOne(stock);
    });
    socket.on("delete", stock => {
      this.handleDeleteReceive(stock);
    });
    socket.on("message", message => {
      console.log(message);
    });

    const { stockData } = this.state;

    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <button onClick={() => this.getAll()}>Get All Stocks</button>
          <input
            type="text"
            name="inputText"
            value={this.state.inputText}
            onChange={this.handleChange}
          />
          <button
            id="blue"
            onClick={() => this.handleAdd(this.state.inputText)}
          >
            Add
          </button>
          <button
            id="red"
            onClick={() => this.handleDeleteSend(this.state.inputText)}
          >
            Delete
          </button>
        </div>
        {!_.isEmpty(stockData) ? <StockChart data={stockData} /> : null}
      </div>
    );
  }
}

export default SocketTest;
