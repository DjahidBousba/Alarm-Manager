/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';
import soundFile from 'Assets/alarm.mp3';
import { dayjs } from 'Config';

import { Alarm } from 'Types';

export const AlarmList = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const ipcRenderer = (window as any).ipcRenderer;

  useEffect(() => {
    ipcRenderer.send('getAll:alarm');

    ipcRenderer.on('getAll:alarm', (event: any, arg: any) => {
      setAlarms(arg);
    });

    ipcRenderer.on('trigger:alarm', (event: any, arg: any) => {
      playSound();
    });
  }, []);

  const playSound = () => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const handleDeleteAlarm = async (id: number) => {
    try {
      ipcRenderer.send('delete:alarm', id);
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
  };

  const handleActivation = async (id: number, checked: boolean) => {
    try {
      ipcRenderer.send('setActive:alarm', { id, checked });
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
  };

  return (
    <Container>
      <ListWrapper>
        {alarms.map(({ id, schedule, isActive }: Alarm) => (
          <AlarmElement key={id}>
            {dayjs(schedule, 'HH:mm:ss').format('HH:mm')}
            <Switch
              type="checkbox"
              defaultChecked={isActive}
              onClick={(event: any) =>
                handleActivation(id, event.target.checked)
              }
            />
            <ItemIcon
              icon={trash}
              size={32}
              onClick={() => handleDeleteAlarm(id)}
            />
          </AlarmElement>
        ))}
      </ListWrapper>
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const ListWrapper = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  overflow: scroll;
  height: 90%;

  & > li {
    margin: 1rem 0;
  }
`;

const AlarmElement = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  padding: 1rem 2rem;
  border: 3px solid #444444;
  border-radius: 10px;
  box-shadow: 2px 5px 4px rgba(0, 0, 0, 0.25);
  color: #11f5ff;
  -webkit-text-stroke: 0.5px white;
  font-weight: 700;
  text-align: center;
  list-style: none;
`;

const Switch = styled.input`
  margin-left: 3rem;
  appearance: none;
  height: 2rem;
  width: 4rem;
  background-color: #444444;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  outline: none;

  &:before {
    position: absolute;
    content: '';
    background-color: #11f5ff;
    height: 1.75rem;
    width: 1.75rem;
    border-radius: 50%;
    border: 1px solid white;
    top: 0.08rem;
    left: 0.2rem;
  }

  &:checked {
    background-color: #11f5ff;
  }

  &:checked:before {
    background-color: #444444;

    top: 0.08rem;
    left: 2rem;
  }
`;

const ItemIcon = styled(Icon)`
  margin-left: 3rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  transition: 0.15s ease-in-out;
  font-weight: bold;

  &:hover {
    scale: 1.05;
    color: #11f5ff;
  }
`;
