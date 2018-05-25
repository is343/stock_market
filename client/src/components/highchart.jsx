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
  AreaSplineSeries,
  SplineSeries,
  Navigator,
  RangeSelector,
  Tooltip,
} from "react-jsx-highstock";

import axios from "axios";
// import { data } from "./data";

export const createDataPoint = (
  time = Date.now(),
  magnitude = 1000,
  offset = 0,
) => {
  return [time + offset * magnitude, Math.round(Math.random() * 100 * 2) / 2];
};

export const createRandomData = (time, magnitude, points = 100) => {
  const data = [];
  let i = points * -1 + 1;
  for (i; i <= 0; i++) {
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

class StockChart extends Component {
  constructor(props) {
    super(props);

    const now = Date.now();
    this.state = {
      data1: createRandomData(now, 1e7, 500),
      data3: createRandomData(now, 1e7, 500),
    };
    console.log("====================================");
    console.log(this.props);
    console.log(this.props.data.data);
    console.log("====================================");
    console.log("====================================");
    console.log(this.state.data1);
    console.log("====================================");
  }

  render() {
    const { data1, data2 } = this.state;
    const { data } = this.props.data;

    return (
      <div className="app">
        <HighchartsStockChart>
          <Chart zoomType="x" />

          <Title>Highstocks Example</Title>

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
            <YAxis.Title>Price</YAxis.Title>
            <AreaSplineSeries id="profit" name="Profit" data={data} />
          </YAxis>

          <YAxis id="social" opposite>
            <YAxis.Title>Social Buzz</YAxis.Title>
            <SplineSeries id="twitter" name="Twitter mentions" data={data2} />
          </YAxis>

          <Navigator>
            <Navigator.Series seriesId="profit" />
            <Navigator.Series seriesId="twitter" />
          </Navigator>
        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(StockChart, Highcharts);
