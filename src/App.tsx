import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Charts } from './Charts';
import { Admin } from './Admin';
import { Charts2Page } from './Charts2Page';
import { ChartSummPage } from './ChartSummPage';
import { ChartsGroupPage } from './ChartsGroupPage';
import { DataLoadPage } from './DataLoadPage';
import { ChartVertBar } from './ChartVertBar';
import { AdminGroupCharts } from './AdminGroupCharts';

// const routes = [
//   { id: 1, path: '/', name: 'Загрузка данных и карта сайта' },
//   { id: 2, path: '/charts2', name: 'Графики потребления пообъектно' },
//   { id: 3, path: '/chartsumm', name: 'График суммарного потребления ГЭС' },
//   { id: 4, path: '/chartsgroup', name: 'Групповые графики' },
//   { id: 5, path: '/admin', name: 'Настройка графиков' },
//   { id: 6, path: '/chartvertbar', name: 'Горизонтальные бар чарт' },
// ];
export const routes = {
  home: '/',
  charts2: '/charts2',
  admin: '/admin',
  adminGroup: '/admingroup',
} as const;

function App() {
  if (!localStorage.chartDataCache) {
    localStorage.setItem('chartDataCache', JSON.stringify([]));
  }
  if (!localStorage.chartListCache) {
    localStorage.setItem('chartListCache', JSON.stringify([]));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<DataLoadPage />} />
        <Route path={routes.charts2} element={<Charts2Page />} />
        <Route path="/chartsumm" element={<ChartSummPage />} />
        <Route path="/chartsgroup" element={<ChartsGroupPage />} />
        <Route path={routes.admin} element={<Admin />} />
        <Route path={routes.adminGroup} element={<AdminGroupCharts />} />
        <Route path="/chartvertbar" element={<ChartVertBar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
