import React, { useRef, useState, useEffect } from "react";
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
      /* =========================
         FINAL MODEL EXPORT (SIMPLIFIED)
      ========================= */
      const BridgeModel = ({ riskScore = 0, vibration = 0, load = 0, crack = 0, temperature = 0, lightColor = '#ffffff' }) => {
        const [selectedSensor, setSelectedSensor] = useState(null);
        const [ambientColor, setAmbientColor] = useState('#ffffff');
        const [ambientIntensity, setAmbientIntensity] = useState(0.6);

        useEffect(() => {
          if (lightColor && lightColor !== '#ffffff') {
            setAmbientColor(lightColor);
            setAmbientIntensity(1.2);
            const timer = setTimeout(() => {
              setAmbientColor('#ffffff');
              setAmbientIntensity(0.6);
            }, 2000);
            return () => clearTimeout(timer);
          }
        }, [lightColor]);

        const handleSensorClick = (s) => setSelectedSensor(s);

        return (
          <div className="relative w-full h-full">
            <Canvas camera={{ position: [18, 10, 18], fov: 50 }} style={{ background: '#0b1120' }}>
              <ambientLight intensity={ambientIntensity} color={ambientColor} />
              <directionalLight position={[15, 20, 10]} intensity={1.2} color={ambientColor} />
              <gridHelper args={[100, 100, '#1e293b', '#1e293b']} />

              <BridgeStructure
                riskScore={riskScore}
                vibration={vibration}
                load={load}
                crack={crack}
                temperature={temperature}
                onSensorClick={handleSensorClick}
              />

              <OrbitControls enablePan={false} enableZoom={true} minDistance={10} maxDistance={50} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            {selectedSensor && (
              <div className="mt-4 w-full flex justify-end">
                <div className="rounded-lg p-4 shadow-2xl max-w-md w-full border z-10 bg-slate-900">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-400">{selectedSensor.sensorType}</p>
                      <p className="text-lg font-semibold">{selectedSensor.value}{selectedSensor.unit}</p>
                    </div>
                    <button onClick={() => setSelectedSensor(null)} className="ml-2 px-2 py-1 rounded-md">✕</button>
                  </div>
                  <div className="text-sm text-gray-300">Status: {selectedSensor.status}</div>
                </div>
              </div>
            )}

            <div className="mt-3 w-full flex justify-start">
              <div className="text-xs text-gray-400 bg-slate-900 bg-opacity-40 rounded-md px-3 py-2">🎯 Interactive Bridge — Click a sensor to view details.</div>
            </div>
          </div>
        );
      };

      export default BridgeModel;
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
   FINAL MODEL EXPORT (SIMPLIFIED)
========================= */
const BridgeModel = ({ riskScore = 0, vibration = 0, load = 0, crack = 0, temperature = 0, lightColor = '#ffffff' }) => {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [ambientColor, setAmbientColor] = useState('#ffffff');
  const [ambientIntensity, setAmbientIntensity] = useState(0.6);

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  // flash ambient light when color prop changes
  useEffect(() => {
    if (lightColor && lightColor !== '#ffffff') {
      setAmbientColor(lightColor);
      setAmbientIntensity(1.2);
      const timeout = setTimeout(() => {
        setAmbientColor('#ffffff');
        setAmbientIntensity(0.6);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [lightColor]);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [18, 10, 18], fov: 50 }}
        style={{ background: "#0b1120" }}
      >
        <ambientLight intensity={ambientIntensity} color={ambientColor} />
        <directionalLight position={[15, 20, 10]} intensity={1.2} color={ambientColor} />

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

      {/* Sensor Detail Panel - moved below the model (right side) to avoid covering the 3D view */}
      {selectedSensor && (
        <div className="mt-4 w-full flex justify-end">
          <div className={`rounded-lg p-4 shadow-2xl max-w-md w-full border z-10 ${
            selectedSensor.status === 'critical'
              ? 'bg-gradient-to-br from-red-950 to-red-900 border-red-500'
              : selectedSensor.status === 'warning'
              ? 'bg-gradient-to-br from-yellow-950 to-yellow-900 border-yellow-500'
              : 'bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className={`text-xs font-semibold uppercase ${
                  selectedSensor.status === 'critical' ? 'text-red-300' :
                  selectedSensor.status === 'warning' ? 'text-yellow-300' :
                  'text-gray-400'
                }`}>
                  {selectedSensor.status === 'critical' ? '⚠️ CRITICAL' :
                   selectedSensor.status === 'warning' ? '⚡ WARNING' :
                   '✅ Sensor'}
                </p>
                <p className={`text-lg font-semibold truncate ${
                  selectedSensor.status === 'critical' ? 'text-red-400' :
                  selectedSensor.status === 'warning' ? 'text-yellow-400' :
                  'text-blue-300'
                }`} title={selectedSensor.sensorType}>{selectedSensor.sensorType}</p>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className={`ml-2 px-2 py-1 rounded-md transition-all duration-200 font-semibold text-base hover:scale-110 active:scale-95 ${
                  selectedSensor.status === 'critical' ? 'bg-red-600 bg-opacity-30 text-red-200 hover:bg-opacity-50 border border-red-500 border-opacity-40' :
                  selectedSensor.status === 'warning' ? 'bg-yellow-600 bg-opacity-30 text-yellow-200 hover:bg-opacity-50 border border-yellow-500 border-opacity-40' :
                  'bg-blue-600 bg-opacity-30 text-blue-200 hover:bg-opacity-50 border border-blue-500 border-opacity-40'
                }`}
                title="Close panel"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
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

      {/* Compact instructions placed below the model to avoid covering visualization */}
      <div className="mt-3 w-full flex justify-start">
        <div className="text-xs text-gray-400 bg-slate-900 bg-opacity-40 border border-blue-500 border-opacity-20 rounded-md px-3 py-2">
          <strong>🎯 Interactive Bridge</strong> — Click a sensor to view details. Drag to rotate • Scroll to zoom.
        </div>
      </div>
    </div>
  );
};

export default BridgeModel;