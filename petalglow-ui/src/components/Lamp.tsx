/* eslint-disable react/no-unknown-property */
import React, { Suspense, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { DirectionalLight } from 'three';
import Flower from './models/Flower';
import Vase from './models/Vase';
import { useTheme } from '../theme/ThemeContext';
import { useLamp } from '../brains/useLamp';
import AnimatedFlower from './models/AnimatedFlower';

const LoadingFallback = () => {
  return (
    <Html center>
      <div style={{
        width: '30px',
        height: '30px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  );
};

const generateFlowerPositions = (nFlowers: number): {
  positions: [number, number, number][], rotations: [number, number, number][]
} => {
  const positions: [number, number, number][] = [];
  const rotations: [number, number, number][] = [];

  // Outer flowers in a circle
  const radius = .5;
  const tiltAngle = 15 * (Math.PI / 180); // 15 degrees in radians
  
  for (let i = 0; i < nFlowers - 1; i++) {
    const angle = (2 * Math.PI / (nFlowers - 1)) * i;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    positions.push([radius * sin, 0, radius * cos]);
    rotations.push([tiltAngle * cos, 0, -tiltAngle * sin]);
  }
  // Center flower
  positions.push([0, 0.2, 0]);
  rotations.push([0, 0, 0 ]);
  return { positions, rotations };
}

const Container = styled.div`
  min-height: 300px;
  height: 350px;
  width: 100%;
  overflow: hidden;
`;

const Lamp: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { theme } = useTheme();
  const { animationState, solidColorState, globalState,
    selectedFlowerIdx, setSelectedFlowerIdx } = useLamp();
  
  // Create light ref to avoid recreating it on every render
  const lightRef = useRef<DirectionalLight>(null);
  if (!lightRef.current) {
    lightRef.current = new DirectionalLight(theme.colors.bg.primary, 0.8);
    lightRef.current.position.set(5, 5, 5);
    lightRef.current.castShadow = true;
  }

  const nFlowers = solidColorState.colors.length;

  const handleFlowerClick = (index: number) => {
    console.log(`Flower ${index} clicked!`);
    // Select the flower for color picker
    setSelectedFlowerIdx(index);
    
    if (index === nFlowers - 1) return; // No rotation for the center flower
    const angle = (2 * Math.PI / (nFlowers - 1)) * index;
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(angle);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    if (selectedFlowerIdx === nFlowers - 1) return; // No rotation for the center flower
    const angle = (2 * Math.PI / (nFlowers - 1)) * selectedFlowerIdx;
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(angle);
      controlsRef.current.update();
    }
  }, [selectedFlowerIdx, nFlowers]);
  
  const { positions, rotations } = generateFlowerPositions(nFlowers);
  const normalisedBrightness = globalState.flowersBrightness / 7;

  return (
    <Container>
      <Canvas
        shadows
        camera={{ position: [0, 10, 0], fov: 30 }}
        onCreated={({ camera, scene }) => {
          camera.add(lightRef.current!);
          scene.add(camera);
        }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />

        <Suspense fallback={<LoadingFallback />}>
          <group position={[0, 0, 0]}>
            <Vase />
            {Array.from({ length: nFlowers }).map((_, index) => (
              globalState.isAnimating
              ? <AnimatedFlower
                key={index}
                animationState={animationState}
                position={positions[index]}
                rotation={rotations[index]}
              />
              : <Flower
                key={index}
                position={positions[index]}
                rotation={rotations[index]}
                color={solidColorState.colors[index].color}
                brightness={normalisedBrightness}
                onClick={() => handleFlowerClick(index)}
              />
            ))}
          </group>
        </Suspense>
        
        <OrbitControls 
          ref={controlsRef}
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 6}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </Container>
  );
};

export default Lamp;
