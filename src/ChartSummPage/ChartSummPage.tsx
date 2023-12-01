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
import { getAllChartsData, readChartsList } from '../fetchapi/fetchapi';
import { ChartItem } from '../global';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { GRAPH_INTERVAL } from '../globalConst';
import { StatusBlock } from '../StatusBlock';

interface ChartData {
  v: number;
  date?: string;
  date2?: string;
}

export interface Res {
  ID_PP: number;
  DT: string;
  Val: number;
}

export function ChartSummPage() {
  const [chartData1, setchartData1] = useState<ChartData[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  // const [isFetchFinish, setIsFetchFinish] = useState(false);

  const navigate = useNavigate();

  if (!localStorage.chartSummDataCache) {
    localStorage.setItem('chartSummDataCache', JSON.stringify([]));
  }

  useEffect(() => {
    const timer = setInterval(() => {
      navigate('/charts2');
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

    // *******************
    const sumVArr2 = JSON.parse(
      localStorage.getItem('chartSummDataCache') || '[]'
    );
    setchartData1(addDate(sumVArr2, dateArr));
    // *****************

    getAllChartsData()
      .then((res: Res[]) => {
        console.log('res1', res);

        const sumVArr2 = makeSummArr(res);
        // setchartData1(addDate(sumVArr2, dateArr));
        localStorage.setItem('chartSummDataCache', JSON.stringify(sumVArr2));
      })
      .catch(() => {
        console.log('ОШИБКА');
        // const sumVArr2 = JSON.parse(
        //   localStorage.getItem('chartSummDataCache') || '[]'
        // );
        // setchartData1(addDate(sumVArr2, dateArr));
      });
    // .finally(() => setIsFetchFinish(true));
  }, []);

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
    <>
      <Box paddingTop={5}>
        {/* <SwitchTransition mode='out-in'>
          <CSSTransition
            classNames='fade'
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            key={chartName.nameCh1}
          > */}
        <Typography variant="h4" align="center">
          Суммарный график
        </Typography>
        {/* </CSSTransition>
        </SwitchTransition> */}

        <ResponsiveContainer width="100%" height={800}>
          <BarChart width={1780} height={800} data={chartData1}>
            <Bar dataKey="v" fill="#8884d8" />
            <YAxis type="number" domain={[0, 'auto']} />
            <XAxis dataKey="date" ticks={xAxisData} dx={57} />
            <CartesianGrid />
          </BarChart>
        </ResponsiveContainer>
        <StatusBlock />
      </Box>
    </>
  );
}

export function makeSummArr(data: Res[]) {
  let daySumV = 0;
  let sumVArr: ChartData[] = [];
  let date = data[0].DT.substring(0, 13);
  console.log(date);
  data.forEach((item, i) => {
    if (item.DT.substring(0, 13) === date) {
      daySumV += item.Val;
    } else {
      sumVArr.push({ v: daySumV, date2: item.DT });
      daySumV = 0;
      date = item.DT.substring(0, 13);
    }
  });
  while (sumVArr.length < 360) {
    sumVArr.push({ v: 0 });
  }
  return sumVArr;
}
