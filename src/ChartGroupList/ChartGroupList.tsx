import React from 'react';
import { ChartGroup } from '../AdminGroupCharts';
import { List, ListItem, Paper, Typography } from '@mui/material';
import { useChartListStore } from '../zustand/store';
import { Draggable, Droppable } from 'react-beautiful-dnd';
// import styles from './chartsgroup.css';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface Props {
  chartGroupData: ChartGroup;
}

export function ChartGroupList({ chartGroupData }: Props) {
  const { name, groupN } = chartGroupData;
  const chartList = useChartListStore((state) => state.chartList);
  console.log(chartGroupData, chartList);
  const gridArea = 'gra' + String(chartGroupData.groupN);

  return (
    <ListItem sx={{ gridArea: gridArea }}>
      <Paper elevation={3} sx={{ width: '100%' }}>
        <Typography variant="h5" sx={{ pt: 2, textAlign: 'center' }}>
          {name}
          {' Группа № '} {groupN}
        </Typography>
        <Droppable droppableId={String(groupN)}>
          {(provided) => (
            <List
              // sx={{ display: 'flex', flexDirection: 'column' }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {chartList.map((chartData, index) => {
                if (chartData.group === groupN) {
                  return (
                    <Draggable draggableId={chartData.id} index={index}>
                      {(provided) => (
                        <ListItem
                          sx={{ pl: 1 }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <DragIndicatorIcon sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            {chartData.name}
                          </Typography>
                        </ListItem>
                      )}
                    </Draggable>
                  );
                }
                // else {
                //   return <p>нет ни в одной группе</p>;
                // }
              })}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Paper>
    </ListItem>
  );
}
