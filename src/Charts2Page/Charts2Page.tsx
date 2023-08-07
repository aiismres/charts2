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
import { readChartsList } from '../fetchapi/fetchapi';
import { ChartItem } from '../global';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GRAPH_INTERVAL, TICK_FONT_SIZE } from '../globalConst';
import { produce } from 'immer';

// import './styles.css';

interface ChartData {
  v: number;
  date?: string;
}

export function Charts2Page() {
  const [chartData1, setChartData1] = useState<ChartData[]>([]);
  const [chartData2, setChartData2] = useState<ChartData[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [chartsList, setChartsList] = useState<ChartItem[]>([]);
  const [chartN, setChartN] = useState(0);
  const [chartName, setChartName] = useState({ nameCh1: '', nameCh2: '' });
  // const [chartDataCache, setChartDataCache] = useState<Array<ChartData[]>>([]);
  const navigate = useNavigate();

  if (!localStorage.chartDataCache) {
    localStorage.setItem('chartDataCache', JSON.stringify([]));
  }
  if (!localStorage.chartListCache) {
    localStorage.setItem('chartListCache', JSON.stringify([]));
  }

  useLayoutEffect(() => {
    readChartsList()
      .then((res) => {
        setChartsList(res);
        console.log('readChartsList() res=',res)
        localStorage.setItem('chartListCache', JSON.stringify(res));
      })
      .catch(() => {
        console.log('ОШИБКА сервера ChartsList');
        setChartsList(
          JSON.parse(localStorage.getItem('chartListCache') || '[]')
        );
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      // setChartN((n) => (chartsList[chartN + 2] ? n + 2 : 0));
      if (chartsList[chartN + 2]) {
        setChartN((n) => n + 2);
      } else {
        navigate('/chartsumm');
      }
    }, GRAPH_INTERVAL);
    // clearing interval
    return () => clearInterval(timer);
  });

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

    // *****************
    // fetch('http://localhost:3001/api/chartData', {
    fetch('/api/chartData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ ID_PP: chartsList[chartN]?.id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('ошибка сервера')
        }
        return res.json();
      })
      .then((res) => {
        console.log('res1', res);
        setChartData1(addDate(res, dateArr));
        // setChartDataCache(
        //   produce((draft) => {
        //     draft[chartN] = res;
        //   })
        // );
        let chartDataCache: Array<ChartData[]> = JSON.parse(
          localStorage.getItem('chartDataCache') || '[]'
        );
        chartDataCache[chartN] = res;
        console.log('chartDataCache', chartDataCache);
        localStorage.setItem('chartDataCache', JSON.stringify(chartDataCache));
      })
      .catch((err) => {
        console.log('ОШИБКА', err);
        let chartDataCache: Array<ChartData[]> = JSON.parse(
          localStorage.getItem('chartDataCache') || '[]'
        );
        setChartData1(addDate(chartDataCache[chartN], dateArr));
      })
      .finally(() => {
        setChartName((st) => ({
          ...st,
          nameCh1: chartsList[chartN]?.name,
          nameCh2: chartsList[chartN + 1]?.name,
        }));
      });

    // fetch('http://localhost:3001/api/chartData', {
    fetch('/api/chartData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ ID_PP: chartsList[chartN + 1]?.id }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('res2', res);
        setChartData2(addDate(res, dateArr));
        // setChartDataCache(
        //   produce((draft) => {
        //     draft[chartN + 1] = res;
        //   })
        // );
        let chartDataCache: Array<ChartData[]> = JSON.parse(
          localStorage.getItem('chartDataCache') || '[]'
        );
        chartDataCache[chartN + 1] = res;
        console.log('chartDataCache', chartDataCache);
        localStorage.setItem('chartDataCache', JSON.stringify(chartDataCache));
      })
      .catch((err) => {
        console.log('ОШИБКА', err);
        let chartDataCache: Array<ChartData[]> = JSON.parse(
          localStorage.getItem('chartDataCache') || '[]'
        );
        setChartData2(addDate(chartDataCache[chartN + 1], dateArr));
      });
  }, [chartsList, chartN]);

  function addDate(arr: ChartData[], dateArr2: string[]) {
    return arr.map((item, i) => {
      // console.log(dateArr2[i]);
      if (i % 24 === 0) {
        return { ...item, date: dateArr2[i / 24] };
      } else {
        return { ...item };
      }
    });
  }

  return (
    <>
      <Box paddingTop={5}>
        {/* <Typography variant='h4' align='center'>
          {chartName.nameCh1}
        </Typography> */}
        <SwitchTransition mode='out-in'>
          <CSSTransition
            classNames='fade'
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            key={chartName.nameCh1}
          >
            <Typography variant='h4' align='center'>
              {chartName.nameCh1}
            </Typography>
          </CSSTransition>
        </SwitchTransition>

        <ResponsiveContainer width='100%' height={400}>
          <BarChart width={1780} height={400} data={chartData1}>
            <Bar dataKey='v' fill='#8884d8' />
            <YAxis
              type='number'
              domain={[0, 'auto']}
              tickFormatter={(tick) => {
                return tick.toLocaleString();
              }}
              style={{
                fontSize: TICK_FONT_SIZE,

                // fontFamily: 'Arial',
              }}
            />
            <XAxis dataKey='date' ticks={xAxisData} dx={57} />
            <CartesianGrid />
          </BarChart>
        </ResponsiveContainer>
        <br />
        <SwitchTransition mode='out-in'>
          <CSSTransition
            classNames='fade'
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            key={chartName.nameCh2}
          >
            <Typography variant='h4' align='center'>
              {chartName.nameCh2}
            </Typography>
          </CSSTransition>
        </SwitchTransition>

        {/* <ResponsiveContainer width='100%' height='100%'> */}
        <ResponsiveContainer width='100%' height={400}>
          <BarChart width={1780} height={400} data={chartData2}>
            <Bar dataKey='v' fill='red' />
            <YAxis type='number' domain={[0, 'auto']} />
            <XAxis dataKey='date' ticks={xAxisData} dx={57} />
            <CartesianGrid />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
}
