import { GET_ALL_STOCKS, GET_ONE_STOCK, DELETE_STOCK } from "./constants";

export function readAllStocks(stockData) {
  return { type: GET_ALL_STOCKS, payload: stockData };
}

export function readOneStock(updatedData) {
  return { type: GET_ONE_STOCK, payload: updatedData };
}

export function deleteStock(preFilteredStocks) {
  return { type: DELETE_STOCK, payload: preFilteredStocks };
}
