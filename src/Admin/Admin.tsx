import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputBase from '@mui/material/InputBase';
import Input from '@mui/material/Input';
import { ChartListItem } from '../ChartListItem';
import { readChartsList, updChartsList } from '../fetchapi/fetchapi';
import { ChartItem } from '../global';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Alert, List, Snackbar } from '@mui/material';

export interface IsReadOnly {
  [k: string]: boolean;
}

export function Admin() {
  const [chartsList, setChartsList] = useState<ChartItem[]>([]);
  const [newChartData, setNewChartData] = useState<ChartItem>({
    id: '',
    name: '',
    group: 1,
  });
  const [isReadOnly, setIsReadOnly] = useState<IsReadOnly>({});
  const [isSneckbarOpen, setIsSnackbarOpen] = useState(false);
  const [isFormNameCorrect, setIsFormNameCorrect] = useState(true);
  const [formIdError, setFormIdError] = useState('');

  useEffect(() => {
    readChartsList().then((res: ChartItem[]) => {
      console.log(res);
      setChartsList(res);
      res.forEach((item) => {
        setIsReadOnly((st) => ({ ...st, [item.id]: true }));
      });
    });
  }, []);

  function onDragEnd(result: any) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const chartsListMod = structuredClone(chartsList);
    const [draggedItem] = chartsListMod.splice(source.index, 1);
    chartsListMod.splice(destination.index, 0, draggedItem);
    setChartsList(chartsListMod);

    if (isSneckbarOpen) {
      return;
    } else {
      setIsSnackbarOpen(true);
    }
  }

  return (
    <>
      <Container>
        <Typography
          component="h1"
          variant="h4"
          paddingTop={5}
          paddingBottom={5}
        >
          Список объектов
        </Typography>
        <Box
          component={'form'}
          onSubmit={(e) => {
            console.log('submit');
            e.preventDefault();
            if (chartsList.find((item) => item.id === newChartData.id)) {
              setFormIdError('такой ID уже есть');
              return;
            }
            setChartsList((st) => {
              const newChartsList = st.concat(newChartData);
              updChartsList(newChartsList);
              return newChartsList;
            });
            setNewChartData({ id: '', name: '', group: 1 });
            // updChartsList({ chartsList, newChartData });
          }}
        >
          <Paper
            elevation={5}
            sx={{
              display: 'flex',
              alignItems: 'top',
              marginBottom: 2,
              padding: '20px 20px 0 20px ',
              borderRadius: 3,
            }}
          >
            <TextField
              required
              id="formName"
              label="Нзавание объекта"
              sx={{
                mr: 1,
                flexGrow: 1,
                // width: 700
              }}
              // defaultValue='Default Value'
              helperText={isFormNameCorrect ? ' ' : 'Заполните форму'}
              value={newChartData.name}
              onChange={(e) => {
                setNewChartData((st) => ({ ...st, name: e.target.value }));
              }}
            />
            <TextField
              required
              id="formId"
              label="ID объекта"
              sx={{ mr: 1 }}
              // defaultValue='Default Value'
              error={Boolean(formIdError)}
              helperText={formIdError || ' '}
              value={newChartData.id}
              onChange={(e) => {
                setNewChartData((st) => ({ ...st, id: e.target.value }));
                setFormIdError('');
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
              error={Boolean(formIdError)}
              helperText={formIdError || ' '}
              value={newChartData.group}
              onChange={(e) => {
                setNewChartData((st) => ({
                  ...st,
                  group: Number(e.target.value),
                }));
                setFormIdError('');
              }}
            />
            <Button type="submit" variant="contained" sx={{ height: 55 }}>
              <KeyboardReturnIcon />
            </Button>
          </Paper>
        </Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppableId">
            {(provided) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
                {chartsList.map(({ name, id }, index) => (
                  <ChartListItem
                    key={id}
                    id={id}
                    index={index}
                    name={name}
                    chartsList={chartsList}
                    setChartsList={setChartsList}
                    // isReadOnly={isReadOnly}
                    // handleMenuClick={handleMenuClick}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
        <Snackbar
          open={isSneckbarOpen}
          // autoHideDuration={6000}
          onClose={() => {
            setIsSnackbarOpen(false);
          }}
          message="Порядок графиков изменен"
          action={
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  updChartsList(chartsList);
                  setIsSnackbarOpen(false);
                }}
              >
                Сохранить
              </Button>
            </>
          }
        ></Snackbar>
      </Container>
    </>
  );
}
