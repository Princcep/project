import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/* =========================
   WARNING HALO EFFECT
========================= */
const WarningHalo = ({ position, sensorData, isWarning, isCritical }) => {
  const haloRef = useRef();

  useFrame(({ clock }) => {
    if (haloRef.current) {
      const time = clock.getElapsedTime();
      if (isCritical) {
        // Critical: rapid pulsing + rotation
        haloRef.current.scale.set(
          1 + Math.sin(time * 8) * 0.3,
          1 + Math.sin(time * 8) * 0.3,
          1 + Math.sin(time * 8) * 0.3
        );
        haloRef.current.rotation.z = time * 3;
      } else if (isWarning) {
        // Warning: slow pulsing
        haloRef.current.scale.set(
          1 + Math.sin(time * 4) * 0.2,
          1 + Math.sin(time * 4) * 0.2,
          1 + Math.sin(time * 4) * 0.2
        );
      }
    }
  });

  return (
    <mesh ref={haloRef} position={position}>
      <sphereGeometry args={[0.6, 8, 8]} />
      <meshBasicMaterial
        color={isCritical ? "#ff3b30" : "#ff9500"}
        opacity={0.15}
        transparent={true}
        wireframe={false}
      />
    </mesh>
  );
};

/* =========================
   SENSOR POINT COMPONENT
========================= */
const SensorPoint = ({ position, sensorData, sensorType, onSensorClick }) => {
  const meshRef = useRef();
  
  // Determine color and status based on sensor value and threshold
  const getStatus = () => {
    const { value, threshold } = sensorData;
    if (value > threshold) return { color: "#ff3b30", status: "critical", label: "🔴" };
    if (value > threshold * 0.7) return { color: "#ff9500", status: "warning", label: "🟡" };
    return { color: "#34c759", status: "normal", label: "🟢" };
  };

  const { color, status, label } = getStatus();
  const isCritical = status === "critical";
  const isWarning = status === "warning";

  useFrame(({ clock }) => {
    if (meshRef.current && (isCritical || isWarning)) {
      const time = clock.getElapsedTime();
      const pulseFactor = isCritical ? 6 : 3; // Critical pulses faster
      const pulseAmount = isCritical ? 0.15 : 0.1;
      
      meshRef.current.scale.set(
        1 + Math.sin(time * pulseFactor) * pulseAmount,
        1 + Math.sin(time * pulseFactor) * pulseAmount,
        1 + Math.sin(time * pulseFactor) * pulseAmount
      );
    }
  });

  const handleClick = () => {
    onSensorClick({ ...sensorData, sensorType, position, status });
  };

  return (
    <group>
      {/* Warning/Critical Halo */}
      {(isCritical || isWarning) && (
        <WarningHalo position={position} sensorData={sensorData} isWarning={isWarning} isCritical={isCritical} />
      )}

      {/* Main Sensor Point */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
        onPointerEnter={() => {
          if (meshRef.current && status === "normal") {
            meshRef.current.scale.set(1.3, 1.3, 1.3);
          }
        }}
        onPointerLeave={() => {
          if (meshRef.current && status === "normal") {
            meshRef.current.scale.set(1, 1, 1);
          }
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isCritical ? 1 : isWarning ? 0.8 : 0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

/* =========================
   TRUSS SECTION
========================= */
const TrussSection = ({ position }) => {
  return (
    <group position={position}>
      {/* Vertical Beam */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.25, 4, 0.25]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* X Bracing */}
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 2, 0]}>
        <boxGeometry args={[0.2, 4.8, 0.2]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.8} />
      </mesh>

      <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 2, 0]}>
        <boxGeometry args={[0.2, 4.8, 0.2]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.8} />
      </mesh>
    </group>
  );
};

/* =========================
   BRIDGE STRUCTURE
========================= */
const BridgeStructure = ({ riskScore = 0, vibration, load, crack, temperature, onSensorClick, onlyShowGreen = false }) => {
  const bridgeRef = useRef();
  const sections = 8;
  const spacing = 4;

  const bridgeColor =
    riskScore > 75
      ? "#ff3b30"
      : riskScore > 50
      ? "#ff9500"
      : "#90a4ae";

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (bridgeRef.current) {
      bridgeRef.current.position.y =
        Math.sin(time * 4) * (riskScore / 300);
    }
  });

  return (
    <group ref={bridgeRef}>
      {/* Bottom Beam */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[sections * spacing, 0.5, 2]} />
        <meshStandardMaterial
          color={bridgeColor}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Deck */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[sections * spacing, 0.3, 2.5]} />
        <meshStandardMaterial color="#607d8b" />
      </mesh>

      {/* Top Beam */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[sections * spacing, 0.4, 0.4]} />
        <meshStandardMaterial color="#eceff1" />
      </mesh>

      {/* Side Beams */}
      <mesh position={[0, 2, 1]}>
        <boxGeometry args={[sections * spacing, 0.2, 0.2]} />
        <meshStandardMaterial color="#b0bec5" />
      </mesh>

      <mesh position={[0, 2, -1]}>
        <boxGeometry args={[sections * spacing, 0.2, 0.2]} />
        <meshStandardMaterial color="#b0bec5" />
      </mesh>

      {/* Railings */}
      <mesh position={[0, 4.5, 1.2]}>
        <boxGeometry args={[sections * spacing, 0.15, 0.15]} />
        <meshStandardMaterial color="#ff7043" />
      </mesh>

      <mesh position={[0, 4.5, -1.2]}>
        <boxGeometry args={[sections * spacing, 0.15, 0.15]} />
        <meshStandardMaterial color="#ff7043" />
      </mesh>

      {/* Truss Sections */}
      {Array.from({ length: sections }).map((_, i) => (
        <TrussSection
          key={i}
          position={[
            -((sections - 1) * spacing) / 2 + i * spacing,
            0,
            0,
          ]}
        />
      ))}

      {/* SENSOR POINTS ON BRIDGE */}
      {/* Vibration Sensors - Multiple points along bridge */}
      {(function(){
        const sd = { value: vibration, threshold: 70 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[-8, 2, 0]}
            sensorData={{ value: vibration, threshold: 70, unit: "m/s²" }}
            sensorType="Vibration"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}
      {(function(){
        const sd = { value: vibration, threshold: 70 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[0, 2, 0]}
            sensorData={{ value: vibration, threshold: 70, unit: "m/s²" }}
            sensorType="Vibration"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}
      {(function(){
        const sd = { value: vibration, threshold: 70 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[8, 2, 0]}
            sensorData={{ value: vibration, threshold: 70, unit: "m/s²" }}
            sensorType="Vibration"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}

      {/* Load Stress Sensors - On sidewalls */}
      {(function(){
        const sd = { value: load, threshold: 80 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[-6, 2, 1.3]}
            sensorData={{ value: load, threshold: 80, unit: "MN" }}
            sensorType="Load Stress"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}
      {(function(){
        const sd = { value: load, threshold: 80 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[6, 2, 1.3]}
            sensorData={{ value: load, threshold: 80, unit: "MN" }}
            sensorType="Load Stress"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}

      {/* Temperature Sensors - On deck */}
      {(function(){
        const sd = { value: temperature, threshold: 35 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[-10, 1.2, 0]}
            sensorData={{ value: temperature, threshold: 35, unit: "°C" }}
            sensorType="Temperature"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}
      {(function(){
        const sd = { value: temperature, threshold: 35 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[10, 1.2, 0]}
            sensorData={{ value: temperature, threshold: 35, unit: "°C" }}
            sensorType="Temperature"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}

      {/* Crack Width Sensors - On structural points */}
      {(function(){
        const sd = { value: crack, threshold: 15 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[-4, 4.2, 0]}
            sensorData={{ value: crack, threshold: 15, unit: "mm" }}
            sensorType="Crack Width"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}
      {(function(){
        const sd = { value: crack, threshold: 15 };
        const status = sd.value > sd.threshold ? 'critical' : sd.value > sd.threshold * 0.7 ? 'warning' : 'normal';
        return (!onlyShowGreen || status === 'normal') ? (
          <SensorPoint
            position={[4, 4.2, 0]}
            sensorData={{ value: crack, threshold: 15, unit: "mm" }}
            sensorType="Crack Width"
            onSensorClick={onSensorClick}
          />
        ) : null;
      })()}
    </group>
  );
};

/* =========================
   FINAL MODEL EXPORT
========================= */
const BridgeModel = ({ riskScore, vibration, load, crack, temperature }) => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [18, 10, 18], fov: 50 }}
        style={{ background: "#0b1120" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 20, 10]} intensity={1.2} />

        <gridHelper args={[100, 100, "#1e293b", "#1e293b"]} />

        <BridgeStructure
          riskScore={riskScore}
          vibration={vibration}
          load={load}
          crack={crack}
          temperature={temperature}
          onSensorClick={handleSensorClick}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Sensor Detail Panel - Bottom Left */}
      {selectedSensor && (
        <div className={`absolute bottom-4 left-4 rounded-lg p-4 shadow-2xl max-w-xs border ${
          selectedSensor.status === 'critical' 
            ? 'bg-gradient-to-br from-red-950 to-red-900 border-red-500'
            : selectedSensor.status === 'warning'
            ? 'bg-gradient-to-br from-yellow-950 to-yellow-900 border-yellow-500'
            : 'bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className={`text-xs font-semibold uppercase ${
                selectedSensor.status === 'critical' ? 'text-red-300' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300' :
                'text-gray-400'
              }`}>
                {selectedSensor.status === 'critical' ? '⚠️ CRITICAL ALERT' : 
                 selectedSensor.status === 'warning' ? '⚡ WARNING STATUS' :
                 '✅ Sensor Data'}
              </p>
              <p className={`text-xl font-bold ${
                selectedSensor.status === 'critical' ? 'text-red-400' : 
                selectedSensor.status === 'warning' ? 'text-yellow-400' :
                'text-blue-400'
              }`}>{selectedSensor.sensorType}</p>
            </div>
            <button
              onClick={() => setSelectedSensor(null)}
              className={`text-lg font-bold ${
                selectedSensor.status === 'critical' ? 'text-red-300 hover:text-red-100' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300 hover:text-yellow-100' :
                'text-gray-400 hover:text-white'
              }`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Sensor Value with Animated Bar */}
            <div className={`rounded-lg p-3 border ${
              selectedSensor.status === 'critical' 
                ? 'bg-red-900 bg-opacity-50 border-red-400 border-opacity-30'
                : selectedSensor.status === 'warning'
                ? 'bg-yellow-900 bg-opacity-50 border-yellow-400 border-opacity-30'
                : 'bg-blue-900 bg-opacity-50 border-blue-400 border-opacity-30'
            }`}>
              <p className="text-xs text-gray-300 mb-2">Current Value</p>
              <p className={`text-2xl font-bold mb-2 ${
                selectedSensor.status === 'critical' ? 'text-red-300' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300' :
                'text-green-300'
              }`}>
                {selectedSensor.value.toFixed(1)}{selectedSensor.unit}
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-black bg-opacity-50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    selectedSensor.status === 'critical' ? 'bg-red-500' : 
                    selectedSensor.status === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((selectedSensor.value / selectedSensor.threshold) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Threshold */}
            <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 border border-purple-500 border-opacity-20">
              <p className="text-xs text-gray-400 mb-1">Safe Threshold</p>
              <p className="text-lg font-bold text-purple-300">
                {selectedSensor.threshold}{selectedSensor.unit}
              </p>
            </div>

            {/* Status Badge */}
            <div className={`rounded-lg p-3 border animate-pulse ${
              selectedSensor.status === 'critical'
                ? 'bg-red-900 bg-opacity-50 border-red-400 border-opacity-50'
                : selectedSensor.status === 'warning'
                ? 'bg-yellow-900 bg-opacity-50 border-yellow-400 border-opacity-50'
                : 'bg-green-900 bg-opacity-50 border-green-400 border-opacity-20'
            }`}>
              <p className="text-xs text-gray-300 mb-1">Status</p>
              <p className={`text-lg font-bold ${
                selectedSensor.status === 'critical' ? 'text-red-300' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300' :
                'text-green-300'
              }`}>
                {selectedSensor.status === 'critical' ? '🔴 CRITICAL' :
                 selectedSensor.status === 'warning' ? '🟡 WARNING' :
                 '🟢 NORMAL'}
              </p>
            </div>

            {/* Position */}
            <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 border border-orange-500 border-opacity-20">
              <p className="text-xs text-gray-400 mb-1">3D Position</p>
              <p className="text-sm text-orange-300 font-mono">
                ({selectedSensor.position[0].toFixed(1)}, {selectedSensor.position[1].toFixed(1)}, {selectedSensor.position[2].toFixed(1)})
              </p>
            </div>

            {/* Recommendation */}
            <div className={`rounded-lg p-3 border ${
              selectedSensor.status === 'critical'
                ? 'bg-red-900 bg-opacity-50 border-red-400 border-opacity-30'
                : selectedSensor.status === 'warning'
                ? 'bg-yellow-900 bg-opacity-50 border-yellow-400 border-opacity-30'
                : 'bg-indigo-900 bg-opacity-50 border-indigo-400 border-opacity-20'
            }`}>
              <p className="text-xs text-gray-300 mb-1">Action Required</p>
              <p className={`text-sm font-bold ${
                selectedSensor.status === 'critical' ? 'text-red-300' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300' :
                'text-indigo-300'
              }`}>
                {selectedSensor.status === 'critical'
                  ? "🚨 IMMEDIATE inspection needed! Stop traffic 24/7 monitoring enabled"
                  : selectedSensor.status === 'warning'
                  ? "📋 Schedule maintenance within 24 hours to prevent failure"
                  : "✅ Operating normally - routine monitoring"}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">Click ✕ to close or select another sensor</p>
        </div>
      )}

      {/* Instructions - Top Right */}
      <div className="absolute top-4 right-4 bg-slate-900 bg-opacity-80 border border-blue-500 border-opacity-30 rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-xs text-gray-400 mb-2"><strong>🎯 Interactive Bridge Model</strong></p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>🖱️ <strong>Click sensors</strong> to view details</li>
          <li>🔴 Red = Critical | 🟡 Orange = Warning | 🟢 Green = Normal</li>
          <li>🔍 <strong>Drag to rotate</strong> | <strong>Scroll to zoom</strong></li>
          <li>📍 8 total sensors across bridge</li>
        </ul>
      </div>
    </div>
  );
};

export default BridgeModel;