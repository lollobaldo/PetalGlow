import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient, IClientPublishOptions } from 'mqtt';

import useUser from './useUser';

const MQTT_SERVER = 'mqtts://mqtt.flespi.io';
const MQTT_PORT = 443;

const generateAppClientId = () => `PetalGlow-app-${Date.now().toString(36)}`;

export type MqttStatus = 'connected' | 'reconnecting' | 'closed' | 'offline' | 'disconnected' | 'error';

export type LampState = {
  state: "CONNECTED" | "DISCONNECTED" | "NONE";
  ssid?: string;
  ip?: string;
  dbm?: number;
};

export const usePetalGlowMqtt = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [status, setStatus] = useState<MqttStatus>('disconnected');
  const [lampState, setLampState] = useState<LampState>({ state: "NONE" });
  const { user } = useUser();

  const base_topic = `petalglow/${user?.clientId}`;
  const conn_topic = `${base_topic}/connectionStatus`;
  const data_topic = `${base_topic}/data`;

  const isConnected = status === 'connected';
  const isAllGood = isConnected && lampState.state === "CONNECTED";
  const hasError = ['closed', 'offline', 'disconnected', 'error'].includes(status);

  useEffect(() => {
    if (!user) {
      console.log("no user");
      return;
    }

    const credentials = {
      clientId: generateAppClientId(),
      username: user.mqttToken,
      port: MQTT_PORT,
    };
    console.log(MQTT_SERVER, credentials);
    const mqttInstance = mqtt.connect(MQTT_SERVER, credentials);
    mqttInstance.on('connect', () => {setStatus
      console.log('connected');
      setStatus('connected');
    });
    mqttInstance.on('reconnect', () => ('reconnecting'));
    mqttInstance.on('close', () => setStatus('closed'));
    mqttInstance.on('disconnect', () => setStatus('disconnected'));
    mqttInstance.on('offline', () => setStatus('offline'));
    mqttInstance.on('error', (e) => {
      console.log(e);
      setStatus('error');
    });

    mqttInstance.on('message', (topic, messageBuffer) => {
      console.log(`New message: ${messageBuffer.toString()}`);
      setLampState(JSON.parse(messageBuffer.toString()) as LampState);
    });

    setClient(mqttInstance);

    return () => {
      mqttInstance?.end();
    };
  }, [user, conn_topic]);

  useEffect(() => {
    if(client && isConnected) {
      console.log(`Subscribing to ${conn_topic}`);
      client.subscribe(conn_topic);
    }
  }, [client, isConnected, conn_topic]);

  const sendMqttData = useCallback((message: string | Buffer) => {
    const opt: IClientPublishOptions = {};
    console.log("Sending mqtt data. Topic: ", data_topic, " msg: ", message);
    status === 'connected' && client?.publish(data_topic, message, { ...opt });
  },[client, status, data_topic]);

  return { isAllGood, isConnected, lampState, hasError, sendMqttData };
};
