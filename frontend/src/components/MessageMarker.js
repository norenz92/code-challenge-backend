import React, {useEffect} from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Traffic, Train, CalendarToday, InfoRounded } from '@material-ui/icons';

const icons = {
  priority: {
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'blue',
    5: 'grey'
  },
  category: {
    0: Traffic,
    1: Train,
    2: CalendarToday,
    3: InfoRounded
  }
}

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
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
        <div className="MessageMarker">
          <div className="firstLine">
            <span className="date">{message.subcategory}</span>
            <span className="date">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
          </div>
          <span className="title">{message.title}</span>
          <span className="location">{message.exactlocation}</span>
          <span className="description">{message.description}</span>
          <p></p>
        </div>
      </Popover>
    </div>
  );
}