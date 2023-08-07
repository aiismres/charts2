import { ChartItem } from '../global';

export function readChartsList() {
  return fetch(
    `/api/chartsList`
    // `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/chartsList`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    }
    else {
      throw new Error('Ошибка readChartsList()');
    }
  });
}

export function updChartsList(newChartsList: ChartItem[]) {
  fetch(
    `/api/updChartsList`,
    // `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/updChartsList`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(newChartsList),
    }
  )
    .then((res) => res.json())
    .then((res) => console.log(res));
}
