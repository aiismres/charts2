import React from 'react';
import {
  getAllChartsData,
  getChartData,
  getChartsGroupData,
  readChartsList,
} from '../fetchapi/fetchapi';
import { ChartData } from '../Charts2Page';
import { Res, makeSummArr } from '../ChartSummPage';
import { GroupObj } from '../ChartsGroupPage';
// import styles from './dataloadpage.css';

interface ChartsList {
  id: string;
  name: string;
  group: number;
}

export function DataLoadPage() {
  (async () => {
    // chartListCache *******************************
    const chartsList: ChartsList[] = await readChartsList();
    console.log(chartsList);
    localStorage.setItem('chartListCache', JSON.stringify(chartsList));

    // chartDataCache *******************************
    const chartsData: Array<ChartData[]> = [];
    for await (let chart of chartsList) {
      await getChartData(chart?.id).then((res) => chartsData.push(res));
    }
    console.log(chartsData);
    localStorage.setItem('chartDataCache', JSON.stringify(chartsData));

    // chartSummDataCache *******************************
    const allChartsData: Res[] = await getAllChartsData();
    // .then((res: Res[]) => {
    console.log('res1', allChartsData);
    const sumVArr2 = makeSummArr(allChartsData);
    localStorage.setItem('chartSummDataCache', JSON.stringify(sumVArr2));
    // });

    // ChartGroupDataCache *******************************
    const groupSet: Set<number> = new Set([1]);
    const groupObjTemp: GroupObj = {};
    chartsList.forEach((item) => {
      groupSet.add(item.group);
      if (groupObjTemp[item.group]) {
        groupObjTemp[item.group].push(item.id);
      } else {
        groupObjTemp[item.group] = [item.id];
      }
    });

    const tempChGDC: Res[] = [];
    for await (let groupNum of groupSet) {
      console.log(groupNum);
      await getChartsGroupData(groupNum).then((res) => {
        tempChGDC[groupNum] = res;
      });
    }
    localStorage.setItem('chartGroupDataCache', JSON.stringify(tempChGDC));
  })();
  return (
    <>
      <h2>Загрузка данных и карта сайта</h2>
      <ul>
        <li>
          <a href='/charts2'>Графики</a>
        </li>
        <li>
          <a href='/chartsumm'>Суммарный</a>
        </li>
        <li>
          <a href='/chartsgroup'>Групповые</a>
        </li>
        <li>
          <a href='/admin'>Админка</a>
        </li>
        <li>
          <a href='/chartvertbar'>Вертикальные</a>
        </li>
      </ul>
    </>
  );
}
