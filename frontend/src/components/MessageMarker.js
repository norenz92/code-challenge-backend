import React, {useEffect} from 'react';
import {Popover, Typography, Chip } from '@material-ui/core';
import {Alert, AlertTitle} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Traffic, Train, CalendarToday, InfoRounded } from '@material-ui/icons';
import { maxWidth } from '@mui/system';
const moment = require('moment')

const icons = {
  priority: {
    1: '#f06360',
    2: '#ffa117',
    3: '#03a9f4',
    4: '#5cb660',
    5: '#656565'
  },
  category: {
    0: Traffic,
    1: Train,
    2: CalendarToday,
    3: InfoRounded
  },
  severity: {
    1: 'error',
    2: 'warning',
    3: 'info',
    4: 'info',
    5: 'info'
  }
}

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(0),
  },
}));

export default function MessageMarker({message}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      lat={message.latitude}
      lng={message.longitude}
    >
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {React.createElement(icons.category[message.category], {htmlColor: icons.priority[message.priority]})}
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {/* <div className="MessageMarker">
          <div className="firstLine">
            <Chip label={message.subcategory} />
            <span className="date">{moment(message.createddate).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <span className="title">{message.title}</span>
          <span className="location">{message.exactlocation}</span>
          <span className="description">{message.description}</span>
          <p></p>
        </div> */}
        <Alert severity={icons.severity[message.priority]} color={message.priority === 4 ? 'success' : icons.severity[message.priority]}>
          <AlertTitle>{message.subcategory} (Prio {message.priority})</AlertTitle>
          {message.createddate && moment(message.createddate).format('YYYY-MM-DD HH:mm')}
          {message.title && <><br/><strong>{message.title}</strong></>}
          {message.exactlocation && <><br/>{message.exactlocation}</>}
          {message.description && <><br/>{message.description}</>}
          <p></p>
        </Alert>
      </Popover>
    </div>
  );
}