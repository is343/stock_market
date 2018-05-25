"use strict";
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");

const path = require("path");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("express-async-errors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// DB IMPORT
const db = require("./models");

// ROUTE IMPORTS
const stockRoutes = require("./routes/stock");

//////////////////////
// MIDDLEWARE SETUP //
//////////////////////

app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors()); // allows any domain can make a request for the api

////////////////
// SET ROUTES //
////////////////

app.use("/api", stockRoutes);

/////////////////////
// SOCKET IO SETUP //
/////////////////////

io.on("connection", socket => {
  console.log("Client connected", socket.id);

  socket.on("read", () => {
    getAllStocks(socket.id);
  });

  socket.on("delete", stock => {
    console.log("deleted:", stock);
    deleteStock(stock);
  });

  socket.on("create", stock => {
    console.log("Created:", stock);
    createStock(stock, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/:company", getAllData);

function test(color) {
  return io.sockets.emit("change color", color);
}

//////////////////////
// ACTION FUNCTIONS //
//////////////////////

function getAllStocks(socketId) {
  // omit the _id and __v
  const query = db.Stock.find({}).select("-_id -__v");
  query.exec((err, stocks) => {
    if (err) {
      console.error("DB find error:", err);
      return err;
    } else {
      getAllData(stocks, socketId);
    }
  });
}

async function getAllData(stockList, socketId) {
  const collectedData = [];
  for (let i = 0; i < stockList.length; i++) {
    let stock = stockList[i].stock;
    const url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?column_index=4&order=asc&api_key=${
      process.env.API_KEY
    }`;
    await axios
      .get(url)
      .then(response => {
        console.log("====================================");
        console.log(response.data.dataset.data.length);
        console.log("====================================");
        const responseData = response.data.dataset.data;
        // chart requires unix dates
        // mapping the array ends up mutating the arrays within
        const filteredData = response.data.dataset.data.map(datum => {
          let date = new Date(datum[0]);
          datum[0] = date.getTime();
        });
        collectedData.push({
          stock,
          name: response.data.dataset.name,
          data: responseData,
        });
      })
      .catch(error => {
        console.error("Stock info GET error:", error.response.status);
        if (error.response.status === 404) {
          deleteStock(stock);
          return sendMessage("Invalid ticker symbol");
        }
      });
  }
  // to return to client via socket
  console.log("Read: Number of stock data sent:", collectedData.length);
  return io.sockets.connected[socketId].emit("read", collectedData);
}

function getOne(stock, socketId) {
  const url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?column_index=4&order=asc&api_key=${
    process.env.API_KEY
  }`;
  axios
    .get(url)
    .then(response => {
      console.log("====================================");
      console.log(response.data.dataset.data.length);
      console.log("====================================");
      const responseData = response.data.dataset.data;
      // chart requires unix dates
      // mapping the array ends up mutating the arrays within
      const filteredData = response.data.dataset.data.map(datum => {
        let date = new Date(datum[0]);
        datum[0] = date.getTime();
      });
      // to return to client via socket
      const collectedData = {
        stock,
        name: response.data.dataset.name,
        data: responseData,
      };
      console.log("Read One: Number of stock data sent:", 1);
      return io.sockets.emit("readOne", collectedData);
    })
    .catch(error => {
      console.error("Stock info GET error:", error.response.status);
      if (error.response.status === 404) {
        deleteStock(stock);
        return sendMessage("Invalid ticker symbol", socketId);
      }
    });
}

function sendMessage(message, socketId) {
  return io.sockets.connected[socketId].emit("message", message);
}

function createStock(stock, socketId) {
  const newStock = new db.Stock({ stock: stock.toUpperCase() });
  db.Stock.create(newStock)
    .then(stock => {
      getOne(stock.stock, socketId);
    })
    .catch(err => {
      console.error("DB create error:", err);
    });
}

function deleteStock(stock) {
  db.Stock.deleteOne({ stock: stock.toUpperCase() }, err => {
    if (err) {
      console.error("DB delete error:", err);
    } else {
      console.log("Stock deleted:", stock);
      return io.sockets.emit("delete", stock);
    }
  });
}

//////////////
// CATCHALL //
//////////////

// Send back React's index.html file for production
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

////////////
// LISTEN //
////////////

const port = process.env.PORT || 5000;
// socket-io requires server.listen
server.listen(port, () => console.log(`Listening on port ${port}`));
