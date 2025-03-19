import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Group, Box3, Vector3, Mesh, MeshStandardMaterial } from 'three';

const Vase: React.FC = () => {
  const path = '/vase.obj';
  const ref = useRef<Group>(null);
  const loaded = useRef<boolean>(false);
  const vaseObj = useLoader(OBJLoader, path);

  useEffect(() => {
    if (!vaseObj || loaded.current) return;
    loaded.current = true;
    const scale = 0.025;
    vaseObj.rotation.x = -Math.PI/2;
    vaseObj.scale.set(scale, scale, scale);

    const boundingBox = new Box3().setFromObject(vaseObj);
    const center = new Vector3();
    boundingBox.getCenter(center);
    vaseObj.position.set(-center.x, -2*center.y, -center.z);
    
    vaseObj.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new MeshStandardMaterial({ 
          // color: '#ff0000',
          emissiveIntensity: .6,
          emissive: '#D3B7A7',
          color: '#D3B7A7',
          roughness: .8,
        });
      }
    });
  }, [vaseObj]);
  
  return (
    <group ref={ref}>
      {vaseObj && (
        <primitive object={vaseObj} />
      )}
    </group>
  );
};

export default Vase;