function readChartsList() {
  return fetch(
    `http://192.168.0.222:80/api/chartsList`
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

readChartsList()
  .then((res) => {
    // setChartsList(res);
    console.log('readChartsList() res=', res);
    localStorage.setItem('chartListCache', JSON.stringify(res));
  })
  .catch(() => {
    console.log('ОШИБКА сервера ChartsList');
    // setChartsList(
    //   JSON.parse(localStorage.getItem('chartListCache') || '[]')
    // );
  });
