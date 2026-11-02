import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Avatar Component - Hand-drawn sketch style character
 * 
 * Photo-traced sketchy avatar with WOW effects:
 * - Parallax depth effect on scroll
 * - Hand-drawn line style matching entrance
 * - Dodges when camera approaches
 * - Frame-by-frame animation: choreographed wave
 *   (rest -> build-up -> double wave-bounce -> back to rest)
 */
// Choreography: build-up (rest -> raise), double wave-bounce with holds,
// then lower back to rest. Per-step duration in seconds.
// f = frame index (0-6 -> 1.webp-7.webp), d = duration in seconds
const SEQUENCE = [
    { f: 0, d: 0.95 }, // rest: hand in pocket, noticing the visitor
    { f: 1, d: 0.15 }, // fast build-up
    { f: 2, d: 0.15 },
    { f: 3, d: 0.17 }, // arm reaching up (small hold)
    { f: 4, d: 0.12 }, // wave: up
    { f: 5, d: 0.10 }, // mid
    { f: 6, d: 0.15 }, // high peak (hold)
    { f: 5, d: 0.10 },
    { f: 4, d: 0.12 },
    { f: 5, d: 0.10 }, // second bounce
    { f: 6, d: 0.20 }, // high peak (longer hold)
    { f: 5, d: 0.10 },
    { f: 4, d: 0.13 },
    { f: 3, d: 0.13 }, // lowering back down
    { f: 2, d: 0.13 },
    { f: 1, d: 0.14 },
];

const Avatar = ({ position = [10, -20, 30] }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 1.2, height: 2.4 });
    const { camera } = useThree();

    // Dodge state
    const dodgeX = useRef(0);
    const targetDodgeX = useRef(0);
    const worldPosVec = useRef(new THREE.Vector3());

    // --- FRAME-BY-FRAME ANIMATION (CHOREOGRAPHED SEQUENCE) ---
    // 7 poses: 1=hand-in-pocket(rest) 2=hand at chest 3=arm extended
    //          4=hand-to-face(raise) 5=wave-up 6=wave-mid 7=wave-high
    const TOTAL_FRAMES = 7;
    const framePaths = Array.from({ length: TOTAL_FRAMES }, (_, i) => `/textures/corridor/avatar_anim/${i + 1}.webp`);

    // Load all texture frames
    const textures = useTexture(framePaths);

    // Animation control refs
    const seqIndex = useRef(0);
    const seqTimer = useRef(0);

    // Apply color space and calculate dimensions once
    useEffect(() => {
        textures.forEach(tex => tex.colorSpace = THREE.SRGBColorSpace);

        if (textures[0] && textures[0].image) {
            const aspectRatio = textures[0].image.width / textures[0].image.height;
            const baseHeight = 2.3; // Fixed size
            setDimensions({
                width: baseHeight * aspectRatio,
                height: baseHeight
            });
        }

        // Set initial texture to avoid white flash, but don't bind it declaratively 
        // to prevent React from overwriting our useFrame mutations
        if (meshRef.current && textures[SEQUENCE[0].f]) {
            meshRef.current.material.map = textures[SEQUENCE[0].f];
            meshRef.current.material.needsUpdate = true;
        }
    }, [textures]);

    // Main animation loop
    useFrame((state, delta) => {
        if (!groupRef.current || !meshRef.current) return;

        // === DODGE LOGIC ===
        groupRef.current.getWorldPosition(worldPosVec.current);
        const distance = camera.position.z - worldPosVec.current.z;

        const DODGE_START = 3;
        const DODGE_PEAK = 0;
        const DODGE_END = -2;
        const DODGE_AMOUNT = -1.5;

        if (distance > DODGE_PEAK && distance < DODGE_START) {
            const t = (DODGE_START - distance) / (DODGE_START - DODGE_PEAK);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else if (distance <= DODGE_PEAK && distance > DODGE_END) {
            const t = (distance - DODGE_END) / (DODGE_PEAK - DODGE_END);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else {
            targetDodgeX.current = 0;
        }

        dodgeX.current = THREE.MathUtils.lerp(dodgeX.current, targetDodgeX.current, 0.08);

        groupRef.current.position.x = position[0] + dodgeX.current;
        groupRef.current.position.y = position[1];

        // === FRAME ANIMATION LOGIC (CHOREOGRAPHED SEQUENCE) ===
        // Using delta for consistent speed regardless of monitor Hz
        seqTimer.current += delta;

        if (seqTimer.current >= SEQUENCE[seqIndex.current].d) {
            seqTimer.current = 0;
            seqIndex.current = (seqIndex.current + 1) % SEQUENCE.length;

            meshRef.current.material.map = textures[SEQUENCE[seqIndex.current].f];
            meshRef.current.material.needsUpdate = true;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh ref={meshRef}>
                <planeGeometry args={[dimensions.width, dimensions.height]} />
                <meshBasicMaterial color="#ffffff"
                    transparent={true}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

// Easing function
const easeOutQuad = (t) => t * (2 - t);

export default Avatar;
