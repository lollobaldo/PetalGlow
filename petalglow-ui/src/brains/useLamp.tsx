
import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { usePetalGlowMqtt } from './usePetalGlowMqtt';
import { HexColor, hexToHsva, hsvaToHsv } from '@uiw/color-convert';
import { compose, scaleAndRound } from './utils';
import { presets } from './presets';

export const FLOWER_COUNT = 3;

export interface FlowerState {
  color: HexColor;
  brightness: number;
}

export interface SolidColorState {
  colors: FlowerState[];
}

export interface AnimationState {
  colors: HexColor[];
  speed: number; // 1-255 10th of a second to shift one color
  start: number; // unix millis of animation start
}

export interface GlobalState {
  isAnimating: boolean;
  singleColor: boolean;
  setSingleColor: (newValue: boolean) => void;
  flowersBrightness: number;
  setFlowersBrightness: (newValue: number) => void;
  stemsBrightness: number;
  setStemsBrightness: (newValue: number) => void;
}

export interface LampState {
  solidColorState: SolidColorState;
  animationState: AnimationState;
  globalState: GlobalState;
  selectedFlowerIdx: number;
}

// Add the functions to the context interface
export interface LampContextType extends LampState {
  setSelectedFlowerIdx: (index: number) => void;
  updateSelectedFlower: (newState: Partial<FlowerState>) => void;
  startAnimation: (colors: HexColor[], speed: number) => void;
  setAnimationSpeed: (speed: number) => void;
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

const defaultSolid = {
  colors: defaultFlowers,
};

const defaultAnimation = {
  speed: 4,
  colors: presets[0].colors,
  start: Date.now(),
};

const toApiColor = (color: HexColor) => {
  const hsv = compose(hexToHsva, hsvaToHsv)(color);
  return {
    h: scaleAndRound(hsv.h, 360, 255),
    s: scaleAndRound(hsv.s, 100, 255),
    v: scaleAndRound(hsv.v, 100, 255),
  };
};

const buildSolidColorsPayload = (solidColorState: SolidColorState, stemsBrightness: number) => ({
  mode: 'SOLID',
  stemBrightness: scaleAndRound(stemsBrightness, 7, 255),
  params: {
    colors: solidColorState.colors.map(flower => flower.color).map(toApiColor),
  }
});

const buildPresetPayload = (animationState: AnimationState, stemsBrightness: number) => ({
  mode: 'FADE',
  stemBrightness: scaleAndRound(stemsBrightness, 7, 255),
  params: {
    colors: animationState.colors.map(toApiColor),
    speed: animationState.speed,
    start: animationState.start,
  }
});

export const LampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Flower states
  const [solidColorState, setSolidColorState] = useState(defaultSolid);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(defaultAnimation);
  
  // Selected flower index
  const [selectedFlowerIdx, setSelectedFlowerIdx] = useState(0);
  
  // Global states
  const [singleColor, _setSingleColor] = useState(false);
  const [flowersBrightness, setFlowersBrightness] = useState(6);
  const [stemsBrightness, setStemsBrightness] = useState(2);

  // Initialize MQTT connection
  const { sendMqttData, isConnected } = usePetalGlowMqtt();

  const sendSolidColors = useCallback(() => {
    if (!isConnected) return;
    const payload = buildSolidColorsPayload(solidColorState, stemsBrightness);
    sendMqttData(JSON.stringify(payload));
  }, [isConnected, stemsBrightness, solidColorState, sendMqttData]);

  const sendPreset = useCallback(() => {
    if (!isConnected) return;
    const payload = buildPresetPayload(animationState, stemsBrightness);
    sendMqttData(JSON.stringify(payload));
  }, [isConnected, stemsBrightness, animationState, sendMqttData]);

  const startAnimation = useCallback((colors: HexColor[], speed: number) => {
    setIsAnimating(true);
    setAnimationState({
      speed,
      start: Date.now(),
      colors: colors,
    });
  }, []);

  const setAnimationSpeed = useCallback((speed: number) => {
    setAnimationState((prevState) => ({ ...prevState, speed }));
  }, []);

  // Send MQTT update whenever relevant state changes
  useEffect(() => {
    !isAnimating && sendSolidColors();
  }, [isAnimating, sendSolidColors]);
  useEffect(() => {
    isAnimating && sendPreset();
  }, [isAnimating, sendPreset]);

  // Function to update a specific flower's state
  const updateFlower = useCallback((index: number, newState: Partial<FlowerState>) => {
    setSolidColorState(prevState => {
      const newFlowers = [...prevState.colors];
      newFlowers[index] = { ...newFlowers[index], ...newState };
      return { colors: newFlowers };
    });
  }, []);

  const updateAllFlowers = useCallback((newState: Partial<FlowerState>) => {
    setSolidColorState(prevState => ({
      colors: prevState.colors.map(flower => ({ ...flower, ...newState }))
    }));
  }, []);

  // Function to update the selected flower
  const updateSelectedFlower = useCallback((newState: Partial<FlowerState>) => {
    if (singleColor) {
      updateAllFlowers(newState);
    } else {
      updateFlower(selectedFlowerIdx, newState);
    }
  }, [singleColor, selectedFlowerIdx, updateFlower, updateAllFlowers]);

  const setSingleColor = useCallback((newState: boolean) => {
    if (newState) {
      updateAllFlowers(solidColorState.colors[0]);    
    }
    _setSingleColor(newState);
  }, [solidColorState, updateAllFlowers]);

  // Create the context value
  const contextValue: LampContextType = {
    solidColorState,
    animationState,
    selectedFlowerIdx,
    globalState: {
      isAnimating,
      singleColor,
      setSingleColor,
      flowersBrightness,
      setFlowersBrightness,
      stemsBrightness,
      setStemsBrightness,
    },
    setSelectedFlowerIdx,
    updateSelectedFlower,
    startAnimation,
    setAnimationSpeed,
  };

  return (
    <LampContext.Provider value={contextValue}>
      {children}
    </LampContext.Provider>
  );
};

// Create the context with a default undefined value
const LampContext = createContext<LampContextType | undefined>(undefined);

// Custom hook to use the lamp context
export const useLamp = () => {
  const context = useContext(LampContext);
  
  if (context === undefined) {
    throw new Error('useLamp must be used within a LampProvider');
  }
  
  return context;
};
