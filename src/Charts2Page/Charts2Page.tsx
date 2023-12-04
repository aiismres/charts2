import React, { useEffect, useLayoutEffect, useState } from 'react';
import styles from './charts.module.css';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  XAxis,
} from 'recharts';
import dayjs from 'dayjs';
import { getChartData, readChartsList } from '../fetchapi/fetchapi';
import { ChartItem } from '../global';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GRAPH_INTERVAL, TICK_FONT_SIZE } from '../globalConst';
import { produce } from 'immer';
import { StatusBlock } from '../StatusBlock';
import { Layout } from '../Layout';
// import './styles.css';

export interface ChartData {
  v: number;
  date2?: string;
}

export function Charts2Page() {
  const [chartData1, setChartData1] = useState<ChartData[]>([]);
  const [chartData2, setChartData2] = useState<ChartData[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [chartsList, setChartsList] = useState<ChartItem[]>([]);
  const [chartN, setChartN] = useState(0);
  const [chartName, setChartName] = useState({ nameCh1: '', nameCh2: '' });
  // const [isFetchFinish, setIsFetchFinish] = useState(false);
  // const [isServerError, setIsServerError] = useState(false);
  const [isServerRes, setIsServerRes] = useState(true);
  // const [chartDataCache, setChartDataCache] = useState<Array<ChartData[]>>([]);
  const navigate = useNavigate();

  // if (!localStorage.chartDataCache) {
  //   localStorage.setItem('chartDataCache', JSON.stringify([]));
  // }
  // if (!localStorage.chartListCache) {
  //   localStorage.setItem('chartListCache', JSON.stringify([]));
  // }

  useLayoutEffect(() => {
    const charsList = JSON.parse(
      localStorage.getItem('chartListCache') || '[]'
    );
    if (!charsList[0]) {
      window.location.replace('/');
    }
    console.log('charsList', charsList);
    setChartsList(charsList);
  }, []);

  useEffect(() => {
    console.log(' readChartsList().then');
    readChartsList().then((res) => {
      console.log(res);
      localStorage.setItem('chartListCache', JSON.stringify(res));
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('setInterval', chartsList);
      // setChartN((n) => (chartsList[n + 2] ? n + 2 : 0));
      // if (!isServerRes) {
      //   setIsServerError(true);
      // } else {
      //   setIsServerError(false);
      // }
      if (chartsList[chartN + 2]) {
        console.log('if (chartsList[chartN + 2])', chartsList[chartN + 2]);
        setChartN((n) => n + 2);
      } else {
        console.log('else');
        navigate('/chartsumm');
      }
    }, GRAPH_INTERVAL);
    // clearing interval
    return () => clearInterval(timer);
  }, [chartsList, chartN]);

  useEffect(() => {
    // *****************
    const dateArr: string[] = [];
    for (let i = 0; i < 15; i++) {
      dateArr.push(
        dayjs()
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .add(-14 + i, 'day')
          .format('DD.MM.YY')
      );
    }
    console.log({ dateArr });
    setXAxisData(dateArr);

    // *****************
    let chartDataCache: Array<ChartData[]> = JSON.parse(
      localStorage.getItem('chartDataCache') || '[]'
    );

    console.log({ chartDataCache });
    if (chartDataCache[chartN]) {
      setChartData1(addDate(chartDataCache[chartN], dateArr));
    }
    if (chartDataCache[chartN + 1]) {
      setChartData2(addDate(chartDataCache[chartN + 1], dateArr));
    }
    setChartName((st) => ({
      ...st,
      nameCh1: chartsList[chartN]?.name,
      nameCh2: chartsList[chartN + 1]?.name,
    }));
    // *****************

    Promise.all([
      getChartData(chartsList[chartN]?.id),
      getChartData(chartsList[chartN + 1]?.id),
    ])
      .then((res) => {
        console.log('asdf', res);
        // setChartData1(addDate(res[0], dateArr));
        // setChartData2(addDate(res[1], dateArr));
        let chartDataCache: Array<ChartData[]> = JSON.parse(
          localStorage.getItem('chartDataCache') || '[]'
        );
        chartDataCache[chartN] = res[0];
        chartDataCache[chartN + 1] = res[1];
        localStorage.setItem('chartDataCache', JSON.stringify(chartDataCache));
        // setIsServerError(false);
        setIsServerRes(true);
        localStorage.setItem('isServerError', JSON.stringify(''));
      })
      .catch((err) => {
        console.log('new Error12!!', err);
        // setIsServerError(true);
        localStorage.setItem(
          'isServerError',
          JSON.stringify('server needs care')
        );

        // let chartDataCache: Array<ChartData[]> = JSON.parse(
        //   localStorage.getItem('chartDataCache') || '[]'
        // );
        // setChartData1(addDate(chartDataCache[chartN], dateArr));
        // setChartData2(addDate(chartDataCache[chartN + 1], dateArr));
      })
      .finally(() => {
        // setChartName((st) => ({
        //   ...st,
        //   nameCh1: chartsList[chartN]?.name,
        //   nameCh2: chartsList[chartN + 1]?.name,
        // }));
        // setIsFetchFinish(true);
      });

    // *****************
  }, [chartsList, chartN]);

  function addDate(arr: ChartData[], dateArr2: string[]) {
    return arr.map((item, i) => {
      if (i % 24 === 0) {
        return { ...item, date: dateArr2[i / 24] };
      } else {
        return { ...item };
      }
    });
  }

  return (
    // <>
    // <Layout>
    <Box padding={5}>
      {/* <Typography variant='h4' align='center'>
          {chartName.nameCh1}
        </Typography> */}
      <SwitchTransition mode="out-in">
        <CSSTransition
          classNames="fade"
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          key={chartName.nameCh1}
        >
          <Typography variant="h4" align="center" minHeight={40}>
            {chartName.nameCh1}
          </Typography>
        </CSSTransition>
      </SwitchTransition>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={1780}
          height={400}
          data={chartData1}
          margin={{ left: 20 }}
        >
          <Bar dataKey="v" fill="#8884d8" />
          <YAxis
            type="number"
            domain={[0, 'auto']}
            tickFormatter={(tick) => {
              return tick.toLocaleString();
            }}
            style={{
              fontSize: TICK_FONT_SIZE,

              // fontFamily: 'Arial',
            }}
          />
          <XAxis dataKey="date" ticks={xAxisData} dx={57} />
          <CartesianGrid />
        </BarChart>
      </ResponsiveContainer>
      <br />
      <SwitchTransition mode="out-in">
        <CSSTransition
          classNames="fade"
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          key={chartName.nameCh2}
        >
          <Typography variant="h4" align="center" minHeight={40}>
            {chartName.nameCh2}
          </Typography>
        </CSSTransition>
      </SwitchTransition>

      {/* <ResponsiveContainer width='100%' height='100%'> */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={1780}
          height={400}
          data={chartData2}
          margin={{ left: 20 }}
        >
          <Bar dataKey="v" fill="red" />
          <YAxis
            type="number"
            domain={[0, 'auto']}
            tickFormatter={(tick) => {
              return tick.toLocaleString();
            }}
            style={{
              fontSize: TICK_FONT_SIZE,
            }}
          />
          <XAxis dataKey="date" ticks={xAxisData} dx={57} />
          <CartesianGrid />
        </BarChart>
      </ResponsiveContainer>
      {/* <div>{isServerError && 'server needs care'}</div> */}
      <StatusBlock />
    </Box>
    // </Layout>
    // </>
  );
}
