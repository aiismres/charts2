import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { ChartsList } from '../DataLoadPage';
import { ChartGroup } from '../AdminGroupCharts';

interface ChartListStore {
  chartList: ChartsList[];
  chartGroups: ChartGroup[];
  setChartList: (chartsList: ChartsList[]) => void;
  addChartGroup: (chartsGroups: ChartGroup) => void;
  updChartListGroup: (id: string, group: number) => void;
}

export const useChartListStore = create<ChartListStore>()(
  devtools(
    persist(
      (set) => ({
        chartList: [],
        chartGroups: [],
        setChartList: (chartList) => set((state) => ({ chartList })),
        addChartGroup: (chartGroup) =>
          set((state) => ({
            chartGroups: state.chartGroups.concat([chartGroup]),
          })),
        updChartListGroup: (id: string, group: number) =>
          set((state) => ({
            chartList: state.chartList.map((chart) =>
              chart.id === id ? { ...chart, group } : chart
            ),
          })),
      }),
      {
        name: 'chartslist-store',
      }
    )
  )
);
