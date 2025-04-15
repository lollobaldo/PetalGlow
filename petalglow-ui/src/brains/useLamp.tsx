
import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { usePetalGlowMqtt } from './usePetalGlowMqtt';
import { HexColor, hexToHsva, hsvaToHsv } from '@uiw/color-convert';
import { compose, scaleAndRound } from './utils';
import { HsvColor } from 'react-colorful';

export const FLOWER_COUNT = 1;

export interface FlowerState {
  color: HexColor;
  brightness: number;
}

export interface GlobalState {
  singleColor: boolean;
  setSingleColor: (newValue: boolean) => void;
  flowersBrightness: number;
  setFlowersBrightness: (newValue: number) => void;
  stemsBrightness: number;
  setStemsBrightness: (newValue: number) => void;
  length: number;
  setLength: (newValue: number) => void;
  fadeIn: number;
  setFadeIn: (newValue: number) => void;
  fadeOut: number;
  setFadeOut: (newValue: number) => void;
}

export interface LampState {
  flowersState: FlowerState[];
  globalState: GlobalState;
  selectedFlowerIdx: number;
}

// Add the functions to the context interface
export interface LampContextType extends LampState {
  setSelectedFlowerIdx: (index: number) => void;
  updateSelectedFlower: (newState: Partial<FlowerState>) => void;
  updateFlower: (index: number, newState: Partial<FlowerState>) => void;
  updateAllFlowers: (newState: Partial<FlowerState>) => void;
  sendPreset: (colors: HexColor[], speed: number) => void;
}

// Default flower colors and brightness
const defaultFlowers = [
  { color: "#ffb6c1", brightness: 0.8 }, // Light pink
  { color: "#ffd700", brightness: 0.7 }, // Pastel yellow
  { color: "#98fb98", brightness: 0.9 }, // Pale green
  { color: "#add8e6", brightness: 0.6 }, // Light blue
  { color: "#d8bfd8", brightness: 0.8 }, // Thistle (light purple)
  { color: "#f08080", brightness: 0.7 }, // Light coral
  { color: "#ffddaa", brightness: 0.9 }, // Light peach
].slice(0, FLOWER_COUNT) as FlowerState[];

// Create the context with a default undefined value
const LampContext = createContext<LampContextType | undefined>(undefined);

const toApiColor = (color: HexColor) => {
  const hsv = compose(hexToHsva, hsvaToHsv)(color);
  return {
    h: scaleAndRound(hsv.h, 360, 255),
    s: scaleAndRound(hsv.s, 100, 255),
    v: scaleAndRound(hsv.v, 100, 255),
  };
};

export const LampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Flower states
  const [flowersState, setFlowersState] = useState(defaultFlowers);
  
  // Selected flower index
  const [selectedFlowerIdx, setSelectedFlowerIdx] = useState(0);
  
  // Global states
  const [singleColor, _setSingleColor] = useState(false);
  const [flowersBrightness, setFlowersBrightness] = useState(6);
  const [stemsBrightness, setStemsBrightness] = useState(6);
  
  // Add new state variables
  const [length, setLength] = useState(4);
  const [fadeIn, setFadeIn] = useState(5);
  const [fadeOut, setFadeOut] = useState(3);

  // Initialize MQTT connection
  const { sendMqttData, isConnected } = usePetalGlowMqtt();

  // Function to send MQTT updates
  const sendSolidColors = useCallback(() => {
    if (!isConnected) return;

    // Create the MQTT payload
    const payload = {
      mode: 'SOLID',
      params: {
        colors: flowersState.map(flower => flower.color).map(toApiColor),
      }
    };

    // Send the payload as JSON
    sendMqttData(JSON.stringify(payload));
  }, [flowersState, flowersBrightness, isConnected, sendMqttData]);

  const sendPreset = useCallback((colors: HexColor[], speed: number) => {
    if (!isConnected) return;
    const payload = {
      mode: 'FADE',
      params: {
        speed: scaleAndRound(speed, 7, 255),
        colors: colors.map(toApiColor),
      }
    };
    sendMqttData(JSON.stringify(payload));
  }, [flowersState, flowersBrightness, isConnected, sendMqttData]);

  // Send MQTT update whenever relevant state changes
  useEffect(() => {
    sendSolidColors();
  }, [flowersState, flowersBrightness, sendSolidColors]);

  // Function to update a specific flower's state
  const updateFlower = useCallback((index: number, newState: Partial<FlowerState>) => {
    setFlowersState(prevFlowers => {
      const newFlowers = [...prevFlowers];
      newFlowers[index] = { ...newFlowers[index], ...newState };
      return newFlowers;
    });
  }, []);

  const updateAllFlowers = useCallback((newState: Partial<FlowerState>) => {
    setFlowersState(prevFlowers => {
      return prevFlowers.map(flower => ({ ...flower, ...newState }));
    });
  }, []);

  // Function to update the selected flower
  const updateSelectedFlower = useCallback((newState: Partial<FlowerState>) => {
    if (singleColor) {
      updateAllFlowers(newState);
    } else {
      updateFlower(selectedFlowerIdx, newState);
    }
  }, [singleColor, selectedFlowerIdx, updateFlower, updateAllFlowers]);

  // Reset flowers to default state
  const setSingleColor = useCallback((newState: boolean) => {
    if (newState) {
      updateAllFlowers(flowersState[0]);    
    }
    _setSingleColor(newState);
  }, []);

  // Create the context value
  const contextValue: LampContextType = {
    flowersState,
    selectedFlowerIdx,
    globalState: {
      singleColor,
      setSingleColor,
      flowersBrightness,
      setFlowersBrightness,
      stemsBrightness,
      setStemsBrightness,
      // Add new state variables to globalState
      length,
      setLength,
      fadeIn,
      setFadeIn,
      fadeOut,
      setFadeOut,
    },
    setSelectedFlowerIdx,
    updateSelectedFlower,
    updateFlower,
    updateAllFlowers,
    sendPreset,
  };

  return (
    <LampContext.Provider value={contextValue}>
      {children}
    </LampContext.Provider>
  );
};

// Custom hook to use the lamp context
export const useLamp = () => {
  const context = useContext(LampContext);
  
  if (context === undefined) {
    throw new Error('useLamp must be used within a LampProvider');
  }
  
  return context;
};



