import React from 'react';

interface AxisHelperProps {
  length?: number;
}

const AxisHelper: React.FC<AxisHelperProps> = ({ length = 6 }) => {
  return (
    <group>
      {/* X Axis - Red */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshBasicMaterial color="red" />
      </mesh>
      
      {/* Y Axis - Green */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, length, 0.05]} />
        <meshBasicMaterial color="green" />
      </mesh>
      
      {/* Z Axis - Blue */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, length]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
};

export default AxisHelper;