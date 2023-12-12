import { Box, Button, Paper, TextField } from '@mui/material';
import React, { useState } from 'react';
import { ChartGroup } from '../AdminGroupCharts';
import { useChartListStore } from '../zustand/store';
// import styles from './addchartsgroupform.css';

export function AddChartGroupForm() {
  const [newChartGroup, setNewChartGroup] = useState<ChartGroup>({
    groupN: 1,
    name: '',
    // chartsId: [],
  });
  const addChartsGroup = useChartListStore((state) => state.addChartGroup);

  return (
    <Box
      component={'form'}
      onSubmit={(e) => {
        console.log('submit');
        e.preventDefault();
        addChartsGroup({ ...newChartGroup });
        setNewChartGroup({
          groupN: 1,
          name: '',
          // chartsId: [],
        });
      }}
    >
      <Paper
        elevation={5}
        sx={{
          display: 'flex',
          alignItems: 'top',
          marginBottom: 2,
          padding: '20px ',
          borderRadius: 3,
        }}
      >
        <TextField
          required
          id="formName"
          label="Нзавание группы"
          sx={{
            mr: 1,
            flexGrow: 1,
          }}
          // helperText={isFormNameCorrect ? ' ' : 'Заполните форму'}
          value={newChartGroup?.name}
          onChange={(e) => {
            setNewChartGroup((st) => ({ ...st, name: e.target.value }));
          }}
        />
        <TextField
          required
          id="groupN"
          label="Группа №"
          type="number"
          inputProps={{ min: '1', max: '10' }}
          sx={{ mr: 1 }}
          // defaultValue='Default Value'
          // error={Boolean(formIdError)}
          // helperText={formIdError || ' '}
          value={newChartGroup.groupN}
          onChange={(e) => {
            setNewChartGroup((st) => ({
              ...st,
              groupN: Number(e.target.value),
            }));
          }}
        />
        <Button type="submit" variant="contained" sx={{ height: 55 }}>
          Добавить группу
        </Button>
      </Paper>
    </Box>
  );
}
