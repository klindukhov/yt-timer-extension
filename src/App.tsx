import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function App() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    setInterval(() => {
      chrome.runtime.sendMessage("m", (response) => updateTimer(response));
    }, 1000);
  }, []);

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

  return (
    <div className='App'>
      <Timer>
        {time}
      </Timer>
    </div>
  );
}

const Timer = styled.div`
  text-align: center;
  width: 150px;
  padding: 5px;
  background-color: red;
  font-size: 30pt;
  cursor: pointer;
`;
