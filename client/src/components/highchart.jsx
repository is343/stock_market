import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import {
  HighchartsStockChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Title,
  Legend,
  SplineSeries,
  Navigator,
  RangeSelector,
  Tooltip,
} from "react-jsx-highstock";

class StockChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const stockData = this.props.data.map(stock => {
      return (
        <div key={stock.stock}>
          <SplineSeries id={stock.stock} name={stock.name} data={stock.data} />
        </div>
      );
    });

    const keyData = this.props.data.map(stock => {
      return (
        <div key={stock.stock}>
          <Navigator.Series seriesId={stock.stock} />
        </div>
      );
    });
    return (
      <div className="app">
        <HighchartsStockChart>
          <Chart zoomType="x" />

          <Title>Stock Price History</Title>

          <Legend>
            <Legend.Title>Key</Legend.Title>
          </Legend>

          <RangeSelector>
            <RangeSelector.Button count={1} type="day">
              1d
            </RangeSelector.Button>
            <RangeSelector.Button count={7} type="day">
              7d
            </RangeSelector.Button>
            <RangeSelector.Button count={1} type="month">
              1m
            </RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>
            <RangeSelector.Input boxBorderColor="#7cb5ec" />
          </RangeSelector>

          <Tooltip />

          <XAxis>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis id="price">
            <YAxis.Title>Price (USD)</YAxis.Title>
            {stockData}
          </YAxis>

          <Navigator>{keyData}</Navigator>
        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(StockChart, Highcharts);
