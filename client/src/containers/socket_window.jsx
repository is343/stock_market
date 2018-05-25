import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import _ from "lodash";

import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";

import StockChart from "../components/highchart";
import {
  deleteStock,
  readAllStocks,
  readOneStock,
} from "../store/actions/stock";

const endpoint = "http://localhost:5000/";
const socket = socketIOClient(endpoint);

class SocketedWindow extends Component {
  constructor() {
    super();

    this.state = {
      inputText: "",
      messageOpen: false,
      messageText: "",
    };
  }

  getAll = () => {
    socket.emit("read");
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAdd = stock => {
    socket.emit("create", stock);
    this.setState({ inputText: "" });
  };

  handleDeleteSend = stock => {
    socket.emit("delete", stock);
    this.setState({ inputText: "" });
  };

  handleDeleteReceive = stock => {
    let bounceCheck = false;
    bounceCheck = this.props.stockData.some(val => {
      return val.stock === stock;
    });
    if (bounceCheck) {
      const currentStocks = _.cloneDeep(this.props.stockData);
      const filteredStocks = currentStocks.filter(val => {
        return val.stock !== stock;
      });
      this.props.deleteStock(filteredStocks);
    }
  };

  handleRead = incomingStockData => {
    let bounceCheck = false;
    bounceCheck = _.isEqual(incomingStockData, this.props.stockData);
    if (!bounceCheck) {
      this.props.readAllStocks(incomingStockData);
    }
  };

  handleReadOne = stock => {
    const stockName = stock.stock;
    // prevent multiples due to bounces
    let bounceCheck = false;
    bounceCheck = this.props.stockData.some(val => {
      return val.stock === stockName;
    });
    if (!bounceCheck) {
      const updatedData = _.cloneDeep(this.props.stockData);
      updatedData.push(stock);
      this.props.readOneStock(updatedData);
    }
  };

  // MESSAGE FUNCTIONS

  handleMessage = message => {
    this.setState({ messageOpen: true, messageText: message });
  };

  handleMessageClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ messageOpen: false, messageText: "" });
  };

  componentDidMount() {
    this.getAll();
  }

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
      this.handleMessage(message);
    });

    const { stockData } = this.props;
    const { inputText, messageOpen, messageText } = this.state;

    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <button onClick={() => this.getAll()}>Get All Stocks</button>
          <form
            onSubmit={e => {
              e.preventDefault();
              this.handleAdd(inputText);
            }}
          >
            <input
              type="text"
              name="inputText"
              placeholder="ticker symbol"
              value={inputText}
              onChange={this.handleChange}
            />
          </form>
          <button
            type="submit"
            id="Add"
            onClick={() => this.handleAdd(inputText)}
          >
            Add
          </button>
          <button id="Delete" onClick={() => this.handleDeleteSend(inputText)}>
            Delete
          </button>
        </div>
        {!_.isEmpty(stockData) ? (
          <StockChart data={stockData} />
        ) : (
          <CircularProgress size={50} />
        )}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={messageOpen}
          autoHideDuration={3500}
          onClose={this.handleMessageClose}
          ContentProps={{ "aria-describedby": "message-id" }}
          message={<span id="message-id">{messageText}</span>}
        />
      </div>
    );
  }
}

SocketedWindow.propTypes = {
  deleteStock: PropTypes.func.isRequired,
  readAllStocks: PropTypes.func.isRequired,
  readOneStock: PropTypes.func.isRequired,
  stockData: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  stockData: state.stocks,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { deleteStock, readAllStocks, readOneStock },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SocketedWindow);
