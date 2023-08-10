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
  Legend,
} from 'recharts';
import dayjs from 'dayjs';
import { getChartsGroupData, readChartsList } from '../fetchapi/fetchapi';
import { ChartItem } from '../global';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { COLORS_ARR, GRAPH_INTERVAL } from '../globalConst';
import { useNavigate } from 'react-router-dom';
import { error } from 'console';
import { StatusBlock } from '../StatusBlock';

export interface Res {
  ID_PP: number;
  DT: string;
  Val: number;
}
interface ChartDataItem {
  [k: string]: number | string;
}
export interface GroupObj {
  [k: string]: string[];
}

export function ChartsGroupPage() {
  const [chartData1, setchartData1] = useState<ChartDataItem[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [chartsList, setChartsList] = useState<ChartItem[]>([]);
  const [groupsList, setGroupsList] = useState<Set<number>>(new Set([1]));
  const [groupNum, setGroupNum] = useState(1);
  const [groupObj, setGroupObj] = useState<GroupObj>({});
  const navigate = useNavigate();

  if (!localStorage.chartGroupDataCache) {
    localStorage.setItem('chartGroupDataCache', JSON.stringify([]));
  }

  useLayoutEffect(() => {
    let tempRes: ChartItem[] = JSON.parse(
      localStorage.getItem('chartListCache') || '[]'
    );
    setChartsList(tempRes);

    const groupSet: Set<number> = new Set([1]);
    const groupObjTemp: GroupObj = {};
    tempRes.forEach((item) => {
      groupSet.add(item.group);
      if (groupObjTemp[item.group]) {
        groupObjTemp[item.group].push(item.id);
      } else {
        groupObjTemp[item.group] = [item.id];
      }
    });
    setGroupObj(groupObjTemp);
    setGroupsList(groupSet);
    console.log(groupSet, groupSet.size);

    // let tempRes: ChartItem[] = [];
    // readChartsList()
    //   .then((res: ChartItem[]) => {
    //     setChartsList(res);
    //     tempRes = res;
    //   })
    //   .catch((err) => {
    //     console.log('ОШИБКА', err);
    //     setChartsList(
    //       JSON.parse(localStorage.getItem('chartListCache') || '[]')
    //     );
    //     tempRes = JSON.parse(localStorage.getItem('chartListCache') || '[]');
    //   })
    //   .finally(() => {
    //     const groupSet: Set<number> = new Set([1]);
    //     const groupObjTemp: GroupObj = {};
    //     tempRes.forEach((item) => {
    //       groupSet.add(item.group);
    //       if (groupObjTemp[item.group]) {
    //         groupObjTemp[item.group].push(item.id);
    //       } else {
    //         groupObjTemp[item.group] = [item.id];
    //       }
    //     });
    //     setGroupObj(groupObjTemp);
    //     setGroupsList(groupSet);
    //     console.log(groupSet, groupSet.size);
    //   });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      // console.log('timer', groupNum + 1, groupsList.size);
      // setGroupNum((n) => (n + 1 > groupsList.size ? 1 : n + 1));
      if (groupNum + 1 <= groupsList.size) {
        setGroupNum((n) => n + 1);
      } else {
        navigate('/charts2');
        // setGroupNum(1);
      }
    }, GRAPH_INTERVAL);
    // clearing interval
    return () => clearInterval(timer);
  });

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

    let tempRes: Res[] = JSON.parse(
      localStorage.getItem('chartGroupDataCache') || '[]'
    )[groupNum];
    if (!tempRes) {
      console.log('ОШИБКА, tempRes=', tempRes);
      window.location.replace('/');
    }
    const dataArr: ChartDataItem[] = [];
    tempRes.forEach((item) => {
      const length = dataArr.length;

      if (
        dataArr[length - 1] &&
        item.DT.substring(0, 13) === dataArr[length - 1].date2
      ) {
        if (dataArr[length - 1][item.ID_PP]) {
          dataArr[length - 1][item.ID_PP] =
            Number(dataArr[length - 1][item.ID_PP]) + item.Val;
        } else {
          dataArr[length - 1][item.ID_PP] = item.Val;
        }
      } else {
        dataArr.push({
          date2: item.DT.substring(0, 13),
          [item.ID_PP]: item.Val,
        });
      }
    });

    while (dataArr.length < 360) {
      dataArr.push({});
    }

    setchartData1(addDate(dataArr, dateArr));

    // fetch('/api/chartsGroupData', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    //   },
    //   body: JSON.stringify({ group: groupNum }),
    // })
    //   .then((res) => {
    //     console.log('res', res);
    //     if (!res.ok) {
    //       throw new Error('Ошибка сервера');
    //     }
    //     return res.json();
    //   })
    getChartsGroupData(groupNum)
      .then((res: Res[]) => {
        console.log('res1', res);
        // tempRes = res;
        let tempChGDC = JSON.parse(
          localStorage.getItem('chartGroupDataCache') || '[]'
        );
        tempChGDC[groupNum] = res;
        localStorage.setItem('chartGroupDataCache', JSON.stringify(tempChGDC));
      })
      .catch((err) => {
        // tempRes = JSON.parse(
        //   localStorage.getItem('chartGroupDataCache') || '[]'
        // )[groupNum];
        // console.log('ОШИБКА, tempRes=', tempRes);
      })
      .finally(() => {
        // const dataArr: ChartDataItem[] = [];
        // tempRes.forEach((item) => {
        //   const length = dataArr.length;
        //   if (
        //     dataArr[length - 1] &&
        //     item.DT.substring(0, 13) === dataArr[length - 1].date2
        //   ) {
        //     if (dataArr[length - 1][item.ID_PP]) {
        //       dataArr[length - 1][item.ID_PP] =
        //         Number(dataArr[length - 1][item.ID_PP]) + item.Val;
        //     } else {
        //       dataArr[length - 1][item.ID_PP] = item.Val;
        //     }
        //   } else {
        //     dataArr.push({
        //       date2: item.DT.substring(0, 13),
        //       [item.ID_PP]: item.Val,
        //     });
        //   }
        // });
        // while (dataArr.length < 360) {
        //   dataArr.push({});
        // }
        // setchartData1(addDate(dataArr, dateArr));
      });
  }, [chartsList, groupNum, groupsList]);

  function addDate(arr: ChartDataItem[], dateArr2: string[]) {
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
        <Typography variant='h4' align='center'>
          Сводный график №{groupNum}
        </Typography>
        <ResponsiveContainer
          height={700}
          // width={1800}
          // width='100%'
        >
          <LineChart data={chartData1} margin={{ right: 25, top: 10 }}>
            <CartesianGrid />
            <XAxis dataKey='date' interval={23} dx={57} />
            <YAxis type='number' domain={[0, 'auto']} />
            {/* <Line
              type='monotone'
              dataKey='9649'
              stroke='#8884d8'
              strokeWidth={3}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='26125'
              stroke='#82ca9d'
              strokeWidth={3}
              dot={false}
            /> */}
            {groupObj[groupNum]?.map((item, i) => (
              <Line
                key={item}
                type='monotone'
                dataKey={item}
                stroke={COLORS_ARR[i]}
                strokeWidth={3}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <Legend
          payload={groupObj[groupNum]?.map((item, i) => ({
            id: item,
            type: 'square',
            value: chartsList.find((item2) => item2.id === item)?.name,
            color: COLORS_ARR[i],
          }))}
        />
        {/* <ul>
          {COLORS_ARR.map((item, i) => (
            <li style={{ color: item }}>{i + item + '----------------'}</li>
          ))}
        </ul> */}
        <StatusBlock />
      </Box>
    </>
  );
}
