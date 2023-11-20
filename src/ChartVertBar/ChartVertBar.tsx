import React from 'react';
// import styles from './chartvertbar.css';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function ChartVertBar() {
  data.sort((a, b) => a.uv - b.uv);
  return (
    <>
      <h3>Вертикальные графики</h3>
      <ResponsiveContainer width='90%' height={600}>
        <BarChart width={1200} height={600} data={data} layout='vertical'>
          <Bar dataKey='uv' fill='#8884d8' />
          <XAxis type='number' />
          <YAxis type='category' dataKey='name' width={600} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

const data = [
  {
    name: 'ГД Уренгой',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'ГТ Нижний Новгород (Нижегор-я обл.)',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'ГТ Москва (КС-29 Донская)',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'ГД Оренбург (ГЗ ГПЗ)',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'ГТ Ухта (КС-18 Мышкин)',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'ГТ Югорск (Свердловская обл.)',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'ГН ННГ',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
