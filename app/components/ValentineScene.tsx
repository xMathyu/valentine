"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo } from "react";

function FloatingHeart({
  position,
  scale,
  speed,
  color,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        initialY + Math.sin(clock.getElapsedTime() * speed + offset) * 0.5;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.3 + offset) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <HeartGeometry />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function HeartGeometry() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 0,
      y = 0;
    s.moveTo(x, y + 0.35);
    s.bezierCurveTo(x, y + 0.35, x - 0.05, y + 0.3, x - 0.25, y + 0.3);
    s.bezierCurveTo(
      x - 0.55,
      y + 0.3,
      x - 0.55,
      y + 0.625,
      x - 0.55,
      y + 0.625,
    );
    s.bezierCurveTo(x - 0.55, y + 0.8, x - 0.35, y + 0.97, x, y + 1.15);
    s.bezierCurveTo(x + 0.35, y + 0.97, x + 0.55, y + 0.8, x + 0.55, y + 0.625);
    s.bezierCurveTo(x + 0.55, y + 0.625, x + 0.55, y + 0.3, x + 0.25, y + 0.3);
    s.bezierCurveTo(x + 0.1, y + 0.3, x, y + 0.35, x, y + 0.35);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    }),
    [],
  );

  return <extrudeGeometry args={[shape, extrudeSettings]} />;
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
      sz[i] = Math.random() * 0.05 + 0.02;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ff69b4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function ValentineScene() {
  const hearts = useMemo(() => {
    const colors = ["#ff1493", "#ff69b4", "#ff6b81", "#e84393", "#fd79a8"];
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        -2 - Math.random() * 5,
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(180deg, #1a0011 0%, #2d0a1e 50%, #0d0015 100%)",
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ff69b4" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#ff1493" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffffff" />

      {hearts.map((heart, i) => (
        <FloatingHeart key={i} {...heart} />
      ))}

      <Particles />
    </Canvas>
  );
}
