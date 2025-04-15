import React from 'react';
import styled from 'styled-components';
import { usePetalGlowMqtt } from '../brains/usePetalGlowMqtt';

const Container = styled.div`
  height: 100%;
  padding: 32px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};

  & > span{
    flex: 50%;
  }
`;

const StatusLabel = styled.span`
  font-size: large;
  font-weight: 500;
`;

const StatusValue = styled.span<{ $status?: Status }>`
  font-size: large;
  font-weight: 600;
  color: ${({ $status }) => {
    switch ($status) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return 'inherit';
    }
  }};
`;

const Title = styled.h2`
  margin-bottom: 16px;
`;

type Status = 'success' | 'warning' | 'error';
type StatusItem = { text: string, status: Status };

export interface StatusProps {}

const Status: React.FC<StatusProps> = () => {
  const { isConnected, lampState, hasError } = usePetalGlowMqtt();

  const mqttStatus: StatusItem =
    isConnected
      ? { text: 'Connected', status: 'success' }
      : hasError
        ? { text: 'Error', status: 'error' }
        : { text: 'Disconnected', status: 'error' };

  const lampStatus: StatusItem = {
    'CONNECTED': { text: 'Connected', status: 'success' as const },
    'DISCONNECTED': { text: 'Disconnected', status: 'error' as const },
    'NONE': { text: 'Unknown', status: 'warning' as const },
  }[lampState.state];

  const dbm = lampState.dbm || -100;
  const dbmStatus = dbm > -50 ? 'success' : dbm > -70 ? 'warning' : 'error';

  return (
    <Container>
      <Title>Connection Status</Title>
      
      <StatusItem>
        <StatusLabel>MQTT</StatusLabel>
        <StatusValue $status={mqttStatus.status}>{mqttStatus.text}</StatusValue>
        <StatusLabel>QoS:</StatusLabel>
        <StatusValue $status={mqttStatus.status}>{isConnected ? 2 : 0}</StatusValue>
      </StatusItem>
      
      <StatusItem>
        <StatusLabel>Lamp:</StatusLabel>
        <StatusValue $status={lampStatus.status}>{lampStatus.text}</StatusValue>
        <StatusLabel>Strength:</StatusLabel>
        <StatusValue $status={dbmStatus}>{lampState?.dbm ? `${lampState?.dbm}dBm` : 'NA'}</StatusValue>
        <StatusLabel>WiFi:</StatusLabel>
        <StatusValue>{lampState?.ssid || 'NA'}</StatusValue>
        <StatusLabel>IP:</StatusLabel>
        <StatusValue>{lampState?.ip || 'NA'}</StatusValue>
      </StatusItem>
    </Container>
  );
};

export default Status;
