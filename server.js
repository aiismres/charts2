const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

(async () => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    const config = {
      user: 'ASKUE',
      password: '!QAZ2wsx#EDC4rfv',
      server: '192.168.0.220\\ASKUE', // You can use 'localhost\\instance' to connect to named instance
      // server: '192.168.0.220\\ASKUE', // You can use 'localhost\\instance' to connect to named instance
      database: 'MRES',
      // trustServerCertificate: true,
      // Encrypt: true,
      // Encrypt: false,
      options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        // instancename: 'ASKUE',
      },
    };
    await sql.connect(config);
  } catch (err) {
    console.log('ошибка', err);
  }
})();

function dateFromTo() {
  let todayStr = new Date().toISOString().split('T')[0];
  let date = new Date();
  date.setDate(date.getDate() - 14);
  let dateStr = date.toISOString().split('T')[0];
  return [dateStr, todayStr];
}

app.post('/api/chartData', async ({ body: { ID_PP } }, res) => {
  console.log('/api/chartData', ID_PP);
  try {
    let todayStr = new Date().toISOString().split('T')[0];
    let date = new Date();
    date.setDate(date.getDate() - 14);
    let dateStr = date.toISOString().split('T')[0];
    const result = await sql.query`select Val, DT from PointMains where DT >= ${
      dateStr + ' 00:00:00'
    } AND DT <= ${todayStr + ' 23:30:00'} AND ID_PP = ${ID_PP}`;
    console.log('result3:', result.recordset);

    const enPerHourArr = [];
    let enPerHour = 0;
    let date2;

    result.recordset.forEach((item, i) => {
      if (i % 2 === 0) {
        enPerHour = item.Val;
        // date2 =
        //   i % 48 === 0
        //     ? dayjs()
        //         .hour(0)
        //         .minute(0)
        //         .second(0)
        //         .millisecond(0)
        //         .add(-14, 'day')
        //         .add(i / 2, 'hour')
        //         .format('DD.MM.YY')
        //     : '';
      } else {
        enPerHour += item.Val;
        // const addObj = date2 ? { v: enPerHour, date: date2 } : { v: enPerHour };
        // enPerHourArr.push(addObj);
        enPerHourArr.push({
          v: enPerHour,
          date2: item.DT,
        });
        enPerHour = 0;
      }
    });
    while (enPerHourArr.length < 360) {
      enPerHourArr.push({ v: 0 });
    }
    console.log({ enPerHourArr });
    res.json(enPerHourArr);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/api/chartsList', async (req, res) => {
  let obj;
  fs.readFile('./chartsList.json', 'utf8', function (err, data) {
    if (err) throw err;
    let chartsList = JSON.parse(data);
    console.log(chartsList);
    res.json(chartsList);
  });
});

app.put('/api/updChartsList', async (req, res) => {
  console.log(req.body);
  fs.writeFile(
    './chartsList.json',
    JSON.stringify(req.body),
    'utf-8',
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File has been updated');
      res.json({ msg: 'File has been updated ' });
    }
  );
});

app.get('/api/allChartsData', async (req, res) => {
  console.log('/api/allChartsData');
  try {
    const data = fs.readFileSync('./chartsList.json', 'utf8');
    let chartsList = JSON.parse(data);
    const chartsIdArr = chartsList.map((item) => item.id);
    console.log('chartsIdArr', chartsIdArr);
    let todayStr = new Date().toISOString().split('T')[0];
    let date = new Date();
    date.setDate(date.getDate() - 14);
    let dateStr = date.toISOString().split('T')[0];
    const result =
      await sql.query`select ID_PP, DT, Val from PointMains where DT >= ${
        dateStr + ' 00:00:00'
      } AND DT <= ${todayStr + ' 23:30:00'} AND ID_PP IN (${chartsIdArr})`;
    console.log('result3:', result.recordset);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.post('/api/chartsGroupData', async ({ body: { group } }, res) => {
  console.log('/api/chartsGroupData', group);
  try {
    const data = fs.readFileSync('./chartsList.json', 'utf8');
    let chartsList = JSON.parse(data);
    const [dateFrom, dateTo] = dateFromTo();
    const chartsIdArr = chartsList
      .filter((item) => item.group === group)
      .map((item) => item.id);
    const result =
      await sql.query`select ID_PP, DT, Val from PointMains where DT >= ${
        dateFrom + ' 00:00:00'
      } AND DT <= ${dateTo + ' 23:30:00'} AND ID_PP IN (${chartsIdArr})`;
    console.log('result3:', result.recordset);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
  // console.log('/api/chartsGroupData', req.body.group);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, function () {
  console.log(`Server listening on port ${process.env.PORT}!\n`);
});
