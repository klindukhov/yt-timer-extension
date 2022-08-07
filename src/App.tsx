import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SettingsIcon from "@mui/icons-material/Settings";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function App() {
  const [time, setTime] = useState("--:--:--");
  const isDayMode = useRef(false);

  useEffect(() => {
    setInterval(() => {
      requestTimerUpdate();
    }, 1000);
  }, []);

  const requestTimerUpdate = () => {
    chrome.runtime.sendMessage("update", (response) => {
      updateTimer(
        isDayMode.current ? response.dailyTime : response.sessionTime
      );
    });
  };

  const updateTimer = (intervalInSeconds: number): void => {
    const hours = Math.floor(intervalInSeconds / 3600);
    const minutes = Math.floor((intervalInSeconds - 3600 * hours) / 60);
    const seconds = intervalInSeconds - 3600 * hours - 60 * minutes;

    setTime(
      (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const resetSessionTimer = () => {
    chrome.runtime.sendMessage("reset");
    requestTimerUpdate();
  };

  const toggleTimerMode = () => {
    setTime("--:--:--");
    isDayMode.current = !isDayMode.current;
  };

  return (
    <div className='App'>
      <Tooltip
        title={`switch to ${!isDayMode.current ? "day" : "session"} mode`}
      >
        <Timer onClick={toggleTimerMode}>{time}</Timer>
      </Tooltip>
      <ControlPanel>
        <IconButton>
          <Tooltip title='coming soon...'>
            <SettingsIcon color='secondary' />
          </Tooltip>
        </IconButton>
        <IconButton>
          <Tooltip title='coming soon...'>
            <QueryStatsIcon color='secondary' />
          </Tooltip>
        </IconButton>
        <IconButton onClick={resetSessionTimer}>
          <Tooltip title='Reset session timer'>
            <RestartAltIcon color='secondary' />
          </Tooltip>
        </IconButton>
      </ControlPanel>
    </div>
  );
}

const Timer = styled.div`
  text-align: center;
  width: 150px;
  padding: 5px;
  color: red;
  font-size: 30pt;
  cursor: pointer;
`;

const ControlPanel = styled.div`
  display: grid;
  height: 50px;
  grid-template-columns: auto auto auto;
`;
