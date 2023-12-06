import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './charts.module.css';
import {
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
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { GRAPH_INTERVAL, TICK_FONT_SIZE } from '../globalConst';
import { StatusBlock } from '../StatusBlock';
// import './styles.css';

export interface ChartData {
  v: number;
  date2?: string;
}

export function Charts2Page() {
  const [chartData1, setChartData1] = useState<ChartData[]>([]);
  const [chartData2, setChartData2] = useState<ChartData[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  // const [chartsList, setChartsList] = useState<ChartItem[]>([]);
  const [chartN, setChartN] = useState(0);
  const [chartName, setChartName] = useState({ nameCh1: '', nameCh2: '' });
  const chartDataRef1 = useRef<ChartData[]>([]);
  const chartDataRef2 = useRef<ChartData[]>([]);
  const chartsListRef = useRef<ChartItem[]>([]);

  const [isServerRes, setIsServerRes] = useState(true);
  const navigate = useNavigate();

  // useLayoutEffect(() => {
  //   const charsList = JSON.parse(
  //     localStorage.getItem('chartListCache') || '[]'
  //   );
  //   if (!charsList[0]) {
  //     window.location.replace('/');
  //   }
  //   console.log('charsList', charsList);
  //   setChartsList(charsList);
  // }, []);

  useEffect(() => {
    chartsListRef.current = JSON.parse(
      localStorage.getItem('chartListCache') || '[]'
    );
    if (!chartsListRef.current[0]) {
      window.location.replace('/');
    }
    console.log('charsList', chartsListRef.current);

    const timer = setInterval(() => {
      if (chartsListRef.current[chartN + 2]) {
        console.log(
          'if (chartsList[chartN + 2])',
          chartsListRef.current[chartN + 2]
        );
        setChartN((n) => n + 2);
      } else {
        console.log('else');
        navigate('/chartsumm');
      }
    }, GRAPH_INTERVAL);

    return () => clearInterval(timer);
  }, [chartN]);

  useEffect(() => {
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

    let chartDataCache: Array<ChartData[]> = JSON.parse(
      localStorage.getItem('chartDataCache') || '[]'
    );

    console.log({ chartDataCache });
    if (chartDataCache[chartN]) {
      chartDataRef1.current = addDate(chartDataCache[chartN], dateArr);
      setChartData1(addDate(chartDataCache[chartN], dateArr));
    }
    if (chartDataCache[chartN + 1]) {
      chartDataRef2.current = addDate(chartDataCache[chartN + 1], dateArr);
      setChartData2(addDate(chartDataCache[chartN + 1], dateArr));
    }
    setChartName((st) => ({
      ...st,
      nameCh1: chartsListRef.current[chartN]?.name,
      nameCh2: chartsListRef.current[chartN + 1]?.name,
    }));

    Promise.all([
      getChartData(chartsListRef.current[chartN]?.id),
      getChartData(chartsListRef.current[chartN + 1]?.id),
    ])
      .then((res) => {
        console.log('asdf', res);

        let chartDataCache: Array<ChartData[]> = JSON.parse(
          localStorage.getItem('chartDataCache') || '[]'
        );
        chartDataCache[chartN] = res[0];
        chartDataCache[chartN + 1] = res[1];
        localStorage.setItem('chartDataCache', JSON.stringify(chartDataCache));
        setIsServerRes(true);
        localStorage.setItem('isServerError', JSON.stringify(''));
      })
      .catch((err) => {
        console.log('new Error12!!', err);
        localStorage.setItem(
          'isServerError',
          JSON.stringify('server needs care')
        );
      });

    readChartsList().then((res) => {
      console.log(res);
      localStorage.setItem('chartListCache', JSON.stringify(res));
    });
  }, [chartN]);

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
    <Box padding={5}>
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
          // data={chartData1}
          data={chartDataRef1.current}
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

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={1780}
          height={400}
          // data={chartData2}
          data={chartDataRef2.current}
          margin={{ left: 20 }}
        >
          <Bar dataKey="v" fill="#FF8080" />
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
      <StatusBlock />
    </Box>
  );
}
