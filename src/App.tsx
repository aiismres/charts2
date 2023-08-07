import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Charts } from './Charts';
import { Admin } from './Admin';
import { Charts2Page } from './Charts2Page';
import { ChartSummPage } from './ChartSummPage';
import { ChartsGroupPage } from './ChartsGroupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Charts />} />
        <Route path='/charts2' element={<Charts2Page />} />
        <Route path='/chartsumm' element={<ChartSummPage />} />
        <Route path='/chartsgroup' element={<ChartsGroupPage />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
