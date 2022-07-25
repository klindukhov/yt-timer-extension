import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function App() {
  const [time, setTime] = useState("");

  useEffect(() => {
    setInitialTimestamp();
  }, []);

  useEffect(() => {
    let lastSavedInterval = getSavedTimeIntervalInSeconds();
    setInterval(() => {
      if (getSavedTimeIntervalInSeconds() === 0) lastSavedInterval = 0;
      const intervalInSeconds =
        getCurrentIntervalInSeconds() + lastSavedInterval;

      setSavedTimeIntervalInSeconds(intervalInSeconds);

      updateTimer(intervalInSeconds);
    }, 1000);
  }, []);

  const updateTimer = (intervalInSeconds : number) : void => {
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

  const setInitialTimestamp = (): void => {
    const currentTimestamp = new Date();
    window.localStorage.setItem(
      "initialTimestamp",
      currentTimestamp.toString()
    );
  };

  const setSavedTimeIntervalInSeconds = (interval: number): void => {
    window.localStorage.setItem(
      "savedTimeIntervalInSeconds",
      interval.toString()
    );
  };

  const getSavedTimeIntervalInSeconds = (): number => {
    return (
      Number(window.localStorage.getItem("savedTimeIntervalInSeconds")) ?? 0
    );
  };

  const getCurrentIntervalInSeconds = (): number => {
    const currentTimestamp = new Date();
    const initialTimestamp = new Date(
      window.localStorage.getItem("initialTimestamp") ?? ""
    );

    return Math.floor(
      (currentTimestamp.getTime() - initialTimestamp.getTime()) / 1000
    );
  };

  const resetTimer = () => {
    setSavedTimeIntervalInSeconds(0);
    setInitialTimestamp();
  };

  return (
    <div className='App'>
      <Timer title='reset' onClick={resetTimer}>
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
