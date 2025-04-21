/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Group, Mesh, MeshStandardMaterial, Color } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AnimationState } from '../../brains/useLamp';
import { blend, GradientDirection } from '../../brains/colorUtils';
import { hexToHsva, hsvaToHex } from '@uiw/color-convert';

interface FlowerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  // onClick: () => void;
  animationState: AnimationState;
}

const AnimatedFlower: React.FC<FlowerProps> = ({ 
  position,
  rotation,
  animationState,
}) => {
  const ref = useRef<Group>(null);
  const tulip = useLoader(OBJLoader, '/rose.obj');
  const [clonedTulip] = useState(() => tulip?.clone());
  const flowerRef = useRef<typeof clonedTulip>(null);
  const brightness = 0.5;
  const scale = 0.2;

  const currentColor = animationState.colors[0];

  useFrame(() => {
    if (!flowerRef.current) return;
    
    const elapsed = Date.now() - animationState.start;
    const cycleTime = animationState.speed * 100; // Convert to milliseconds
    const totalCycleTime = cycleTime * animationState.colors.length;
    
    // Calculate current position in the color cycle
    const cyclePosition = (elapsed % totalCycleTime) / cycleTime;
    const currentColorIndex = Math.floor(cyclePosition);
    const nextColorIndex = (currentColorIndex + 1) % animationState.colors.length;
    
    // Calculate blend amount between current and next color
    const blendAmount = cyclePosition - currentColorIndex;
    
    // Get current and next colors
    const currentColor = animationState.colors[currentColorIndex];
    const nextColor = animationState.colors[nextColorIndex];
    
    // const blendedColor = nextColor;
    // Blend the colors
    const blendedColor = hsvaToHex(blend(
      hexToHsva(currentColor), 
      hexToHsva(nextColor),
      blendAmount, 
      GradientDirection.SHORTEST_HUES,
    ));

    flowerRef.current.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.color = new Color(blendedColor);
        // Also update emissive color for glow effect
        if (child.material instanceof MeshStandardMaterial) {
          child.material.emissive = new Color(blendedColor);
        }
      }
    });
  });
  
  useEffect(() => {
    if (clonedTulip) {
      clonedTulip.traverse((child) => {
        console.log(child.name);
        if (child instanceof Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Create a new material with lightmap
          child.material = new MeshStandardMaterial({ 
            color: currentColor,
            roughness: 0.7,
            emissive: currentColor,
            emissiveIntensity: brightness,
            toneMapped: false, // Helps with bloom effect
          });
        }
      });
    }
  }, [clonedTulip, currentColor]);
  
  return (
    <group
      rotation={[rotation[0], rotation[1], rotation[2]]}
      {...{position, ref}}
    >
      {/* Stem */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#4a8505" />
      </mesh>
      {clonedTulip && (
        <group position={[0, 1, 0]} scale={scale}>
          <primitive object={clonedTulip} ref={flowerRef} />
        </group>
      )}
      
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.3}
          intensity={brightness}
          radius={0.7}
          mipmapBlur={true}
        />
      </EffectComposer>
    </group>
  );
};

export default AnimatedFlower;
