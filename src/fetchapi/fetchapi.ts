import { ChartItem } from '../global';

if (!localStorage.chartListCache) {
  localStorage.setItem('chartListCache', JSON.stringify([]));
}

export function readChartsList() {
  return fetch(
    `/api/chartsList`
    // `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/chartsList`
  ).then((res) => {
    console.log('res', res);
    if (res.ok) {
      return res.json();
    } else {
      return new Error('Ошибка readChartsList()');
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
    .then((res) => {
      console.log(res);
      localStorage.setItem('chartListCache', JSON.stringify(newChartsList));
    });
}

export function getChartData(id: string) {
  return fetch('/api/chartData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ ID_PP: id }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log('Error getChartData');
      throw new Error(err);
    });
}
