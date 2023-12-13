import React, { useState } from 'react';
import { useChartListStore } from '../zustand/store';
import { Box, Button, Container, List, Paper, TextField } from '@mui/material';
import { nanoid } from 'nanoid';
import { ChartGroupList } from '../ChartGroupList';
import { DragDropContext } from 'react-beautiful-dnd';
import { AddChartGroupForm } from '../AddChartGroupForm';
import { ChartsList } from '../DataLoadPage';
import Masonry from '@mui/lab/Masonry';
// import styles from './admingroupcharts.css';

export interface ChartGroup {
  groupN: number;
  name: string;
  chartsId: string[];
}

export function AdminGroupCharts() {
  const [newChartGroup, setNewChartGroup] = useState<ChartGroup>({
    groupN: 1,
    name: '',
    chartsId: [],
  });

  const chartList = useChartListStore((state) => state.chartList);
  const chartGroups = useChartListStore<ChartGroup[]>(
    (state) => state.chartGroups
  );
  const updChartListGroup = useChartListStore(
    (state) => state.updChartListGroup
  );
  // const chartsGroups =

  function onDragEnd(result: any) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      console.log('!destination');
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = source.droppableId;
    const finish = destination.droppableId;
    console.log(draggableId, destination.droppableId);

    if (start === finish) {
      return;
    }

    updChartListGroup(draggableId, Number(destination.droppableId));
  }

  return (
    <>
      <Container>
        <h3>Группировка объектов</h3>
        <AddChartGroupForm />

        <DragDropContext onDragEnd={onDragEnd}>
          <Masonry
            columns={2}
            spacing={5}
            sx={{ margin: 0 }}
            // sx={{
            //   display: 'grid',
            //   // gridTemplateColumns: '1fr 1fr',
            //   // gridTemplateAreas: `"gra1 gra2"
            //   //                     "gra1 gra3"
            //   //                     "gra1 gra4"
            //   //                     "gra1 gra5"
            //   //                     "gra1 gra6"`,
            //   gridTemplateColumns: 'repeat(3, 200px)',
            //   // gridTemplateRows: 'repeat(3, 500px)',
            //   // gridAutoFlow: ' dense',
            // }}
          >
            {chartGroups.map((chg) => (
              <ChartGroupList chartGroupData={chg} />
            ))}
          </Masonry>
        </DragDropContext>
      </Container>
    </>
  );
}
