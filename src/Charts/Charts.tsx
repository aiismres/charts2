import React, { useEffect, useState } from 'react';
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

interface ChartData {
  v: number;
  date?: string;
}

export function Charts() {
  const [chartData1, setchartData1] = useState<ChartData[]>([]);
  const [chartData2, setchartData2] = useState<ChartData[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);

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

    // fetch('http://localhost:3001/api/chartData', {
    fetch('/api/chartData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ ID_PP: 9649 }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('res1', res);
        setchartData1(addDate(res, dateArr));
      });

    // fetch('http://localhost:3001/api/chartData', {
    fetch('/api/chartData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ ID_PP: 26125 }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log('res2', res);
        setchartData2(addDate(res, dateArr));
      });
  }, []);

  function addDate(arr: ChartData[], dateArr2: string[]) {
    return arr.map((item, i) => {
      console.log(dateArr2[i]);
      if (i % 24 === 0) {
        return { ...item, date: dateArr2[i / 24] };
      } else {
        return { ...item };
      }
    });
  }

  return (
    <>
      {/* <ResponsiveContainer width='100%' height='100%'> */}
      <BarChart width={1780} height={400} data={chartData1}>
        <Bar dataKey='v' fill='#8884d8' />
        <YAxis type='number' domain={[0, 'auto']} />
        <XAxis dataKey='date' ticks={xAxisData} dx={57} />
        <CartesianGrid />
      </BarChart>
      {/* </ResponsiveContainer> */}

      {/* <ResponsiveContainer width='100%' height='100%'> */}
      <BarChart width={1780} height={400} data={chartData2}>
        <Bar dataKey='v' fill='#8884d8' />
        <YAxis type='number' domain={[0, 'auto']} />
        <XAxis dataKey='date' ticks={xAxisData} dx={57} />
        <CartesianGrid />
      </BarChart>
      {/* </ResponsiveContainer> */}

      <ResponsiveContainer
        height={250}
        width={1800}
        // width='100%'
      >
        <LineChart data={chartData1} margin={{ right: 25, top: 10 }}>
          <CartesianGrid />
          <XAxis dataKey='date' interval={23} dx={57} />
          <YAxis type='number' domain={[0, 'auto']} />
          <Line
            type='monotone'
            dataKey='pv'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
          <Line
            type='monotone'
            dataKey='v'
            stroke='#82ca9d'
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
