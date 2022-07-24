import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function App() {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!window.localStorage.getItem("initialTimestamp")) {
      setInitialTimestamp();
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      const currentTimestamp = new Date();
      const initialTimestamp = new Date(
        window.localStorage.getItem("initialTimestamp") ?? ""
      );

      const intervalInSeconds = Math.floor(
        (currentTimestamp.getTime() - initialTimestamp.getTime()) / 1000
      );

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
    }, 1000);
  }, []);

  const setInitialTimestamp = () => {
    const currentTimestamp = new Date();
    window.localStorage.setItem(
      "initialTimestamp",
      currentTimestamp.toString()
    );
  };

  return (
    <div className='App'>
      <Timer title="reset" onClick={setInitialTimestamp}>{time}</Timer>
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
