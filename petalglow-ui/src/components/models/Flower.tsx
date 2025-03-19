import React, { useState, useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface FlowerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  brightness: number;
  onClick: () => void;
  onBrightnessChange?: (brightness: number) => void;
  onColorChange?: (color: string) => void;
}

const Flower: React.FC<FlowerProps> = ({ 
  position, 
  rotation, 
  color, 
  brightness, 
  onClick,
}) => {
  const ref = useRef<Group>(null);
  const tulip = useLoader(OBJLoader, '/tulip.obj');
  const [clonedTulip] = useState(() => tulip?.clone());
  
  useEffect(() => {
    if (clonedTulip) {
      clonedTulip.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new MeshStandardMaterial({ 
            color: color,
            roughness: 0.7,
            emissive: color,
            emissiveIntensity: brightness,
            toneMapped: false, // Helps with bloom effect
          });
        }
      });
    }
  }, [clonedTulip, color, brightness]);
  
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
        <group position={[0, 1, 0]} scale={0.025}>
          <primitive object={clonedTulip} onClick={onClick} />
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

export default Flower;