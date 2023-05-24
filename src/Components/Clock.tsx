import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { dayjs } from 'Config';

export const Clock = () => {
  const [alarm, setAlarm] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const ipcRenderer = (window as any).ipcRenderer;

  const handleSetAlarm = async (event: React.FormEvent) => {
    event.preventDefault();
    ipcRenderer.send('set:alarm', alarm + ':00');
  };

  return (
    <Container onSubmit={handleSetAlarm}>
      <DigitalClock>
        <Box>{dayjs().format('HH')}</Box> : <Box>{dayjs().format('mm')}</Box> :
        <Box>{dayjs().format('ss')}</Box>
      </DigitalClock>
      <DayWrapper>
        <Day>{dayjs().locale('fr').format('ddd ').toLocaleUpperCase()}</Day>
        <Month>
          {dayjs().locale('fr').format('DD MMMM YYYY').toLocaleUpperCase()}
        </Month>
      </DayWrapper>

      <DateInput
        type="time"
        value={alarm}
        onChange={(event) => setAlarm(event.target.value)}
      />
      <Button type="submit">Valider</Button>
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const DigitalClock = styled.div`
  display: flex;
  align-items: center;
  font-size: 5rem;
  font-weight: 700;
  color: #11f5ff;
  -webkit-text-stroke: 1px white;
`;

const DayWrapper = styled.div`
  font-size: 2.5rem;
  color: white;
`;

const Day = styled.text`
  font-weight: 300;
  -webkit-text-stroke: 0.5px #11f5ff;
`;

const Month = styled.text`
  font-weight: 700;
  -webkit-text-stroke: 1px black;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 130px;
  border: 3px solid #444444;
  border-radius: 10px;
  background-color: #23323a;
  box-shadow: 2px 5px 4px rgba(0, 0, 0, 0.25);
  margin: 1rem;
  text-align: center;
`;

const DateInput = styled.input`
  display: flex;
  justify-content: center;
  font-size: 5rem;
  font-weight: 700;
  border-radius: 10px;
  border: 2px solid #11f5ff;
  background-color: #23323a;
  padding: 1rem;
  color: white;
  -webkit-text-stroke: 2px black;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  justify-content: center;
  border-radius: 10px;
  border: 2px solid #444444;
  color: #11f5ff;
  background-color: #111111;

  &:hover {
    scale: 1.05;
  }
`;
