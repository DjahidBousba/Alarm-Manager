import React from 'react';
import styled from 'styled-components';

import { Clock, AlarmList } from 'Components';

function App() {
  return (
    <Container>
      <Title>Alarm manager</Title>
      <Left>
        <Clock />
      </Left>
      <Right>
        <AlarmList />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  text-align: center;
  align-items: flex-start;
  flex-wrap: wrap;
  height: 95vh;
`;

const Title = styled.text`
  font-size: 4rem;
  margin: 1rem 0;
  height: 10%;
  color: #11f5ff;
  font-weight: 700;
  width: 100%;
  font-style: italic;
  -webkit-text-stroke: 1px black;
`;

const Left = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
`;

const Right = styled.div`
  display: flex;
  width: 50%;
  height: 90%;
`;

export default App;
