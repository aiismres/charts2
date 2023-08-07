import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './chartlistitem.module.css';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import Menu from '@mui/material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { produce } from 'immer';
import { updChartsList } from '../fetchapi/fetchapi';
import { ChartItem } from '../global';

interface Props {
  id: string;
  name: string;
  chartsList: ChartItem[];
  setChartsList: Dispatch<SetStateAction<ChartItem[]>>;
  // isReadOnly: IsReadOnly;
  // handleMenuClick: (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   id: string
  // ) => void;
}

export function ChartListItem({
  id,
  name,
  chartsList,
  setChartsList,
}: // isReadOnly,
// handleMenuClick,
Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [isReadOnly, setIsReadOnly] = useState(true);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    // setSelectedId(id);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper
        // key={id}
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
          // padding: 1,
          borderRadius: 2,
        }}
      >
        {/* <Typography sx={{ flexGrow: 1, padding: 2 }}>{name}</Typography> */}
        <InputBase
          sx={{ ml: 2, flexGrow: 1 }}
          // placeholder='Search Google Maps'
          // inputProps={{ 'aria-label': 'search google maps' }}
          // defaultValue={name}
          readOnly={isReadOnly}
          value={chartsList.find((item) => item.id === id)?.name}
          onChange={(e) =>
            setChartsList(
              produce((draft) => {
                let chartItem = draft.find((item) => item.id === id)!;
                chartItem.name = e.target.value;
              })
            )
          }
        />
        <Divider orientation='vertical' variant='middle' flexItem />
        {/* <Typography sx={{ width: 180, padding: 2 }}>{id}</Typography> */}
        <InputBase
          sx={{ ml: 2 }}
          readOnly={true}
          value={chartsList.find((item) => item.id === id)?.id}
          // onChange={(e) =>
          //   setChartsList(
          //     produce((draft) => {
          //       let chartItem = draft.find((item) => item.id === id)!;
          //       chartItem.id = e.target.value;
          //     })
          //   )
          // }
        />
        <Divider orientation='vertical' variant='middle' flexItem />
        <InputBase
          sx={{ ml: 2, width: 30 }}
          readOnly={isReadOnly}
          value={chartsList.find((item) => item.id === id)?.group}
          onChange={(e) =>
            setChartsList(
              produce((draft) => {
                let chartItem = draft.find((item) => item.id === id)!;
                chartItem.group = Number(e.target.value);
              })
            )
          }
        />
        <Divider orientation='vertical' variant='middle' flexItem />
        {isReadOnly ? (
          <IconButton
            onClick={(e) => {
              handleMenuClick(e, id);
            }}
          >
            <MoreVertIcon sx={{ width: 30 }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={(e) => {
              setIsReadOnly(true);
              updChartsList(chartsList);
            }}
          >
            <KeyboardReturnIcon sx={{ width: 30 }} />
          </IconButton>
        )}
      </Paper>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setIsReadOnly(false);
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          Редактировать
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            console.log(e.target);
            handleCloseMenu();
            setChartsList((st) => {
              const newChartsList = st.filter((item) => item.id !== id);
              updChartsList(newChartsList);
              return newChartsList;
            });
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>
    </>
  );
}
