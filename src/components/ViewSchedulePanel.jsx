import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { getSchedules } from "../../firebase/getSchedules";
function ViewSchedulePanel({ value, schedules }) {
  const [openItems, setOpenItems] = React.useState({});
  const handleClick = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <div>
      <CustomTabPanel value={value} index={2}>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              ROTC Schedules
            </ListSubheader>
          }
        >
          {schedules.map((schedule, index) => (
            <ListItemButton key={index} onClick={() => handleClick(index)}>
              <ListItemText
                primary={`${schedule.schoolyear} - ${schedule.semester}`}
              />
              <Collapse in={!!openItems[index]} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {schedule.time.map((time, timeIndex) => (
                    <ListItem key={timeIndex}>
                      <ListItemText
                        primary={`${time} - ${schedule.event[timeIndex]}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </ListItemButton>
          ))}
        </List>
      </CustomTabPanel>
    </div>
  );
}

export default ViewSchedulePanel;
