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
 * - Choreographed wave animation on transforms
 *   (rest -> build-up lean -> double wave-bounce -> back to rest)
 *
 * Single texture (avatar_corridor.webp) laid out on the same 1024x1024
 * canvas as the old frame sequence, so plane size/feet position match.
 */
// Choreography: build-up (lean back), double wave-bounce with holds,
// then settle back to rest. Per-step duration in seconds.
// r = body rotation.z (radians), y = hop offset (units), d = duration.
//
// Amplitudes are deliberately generous: at 191px per world unit a 0.16-unit
// hop is ~30px on screen, which reads as motion from across the room. The
// opening rest is kept short (0.55s) and is covered by IDLE_* below, so the
// figure is never actually frozen.
const SEQUENCE = [
    { r: 0.00, y: 0.000, d: 0.55 }, // brief rest: noticing the visitor
    { r: -0.16, y: 0.010, d: 0.16 }, // fast build-up: lean back
    { r: -0.22, y: 0.045, d: 0.16 },
    { r: 0.10, y: 0.130, d: 0.18 }, // launch up (small hold)
    { r: 0.24, y: 0.065, d: 0.13 }, // wave: up
    { r: -0.04, y: 0.135, d: 0.11 }, // mid
    { r: 0.26, y: 0.085, d: 0.17 }, // high peak (hold)
    { r: -0.04, y: 0.135, d: 0.11 },
    { r: 0.24, y: 0.065, d: 0.13 }, // second bounce
    { r: 0.26, y: 0.100, d: 0.22 }, // high peak (longer hold)
    { r: -0.04, y: 0.135, d: 0.11 },
    { r: 0.24, y: 0.065, d: 0.14 },
    { r: 0.08, y: 0.035, d: 0.14 }, // lowering back down
    { r: -0.06, y: 0.000, d: 0.14 },
    { r: 0.00, y: 0.000, d: 0.16 }, // settle to rest
];

// Continuous idle overlay. Runs on top of every choreography step so the
// figure always has visible life, including during the rest/settle steps.
// Values are in the same units as SEQUENCE (radians / world units).
const IDLE_ROT = 0.055;  // ~11px of head swing at rest
const IDLE_HOP = 0.032;  // ~6px vertical bob at rest
const IDLE_SWAY = 0.020; // ~4px lateral drift at rest

const Avatar = ({ position = [10, -20, 30] }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 1.2, height: 2.4 });
    const { camera } = useThree();

    // Dodge state
    const dodgeX = useRef(0);
    const targetDodgeX = useRef(0);
    const worldPosVec = useRef(new THREE.Vector3());

    // Single waving-figure texture (replaces the old 7-frame sequence)
    const texture = useTexture('/textures/corridor/avatar_corridor.webp');

    // Animation control refs (smooth interpolation between choreography steps)
    const seqIndex = useRef(0);
    const seqTimer = useRef(0);
    const fromR = useRef(SEQUENCE[SEQUENCE.length - 1].r);
    const fromY = useRef(SEQUENCE[SEQUENCE.length - 1].y);

    // Apply color space and calculate dimensions once
    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;

        if (texture.image) {
            const aspectRatio = texture.image.width / texture.image.height;
            const baseHeight = 2.3; // Fixed size
            setDimensions({
                width: baseHeight * aspectRatio,
                height: baseHeight
            });
        }
    }, [texture]);

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

        // === WAVE CHOREOGRAPHY (transform-based, delta-timed) ===
        seqTimer.current += delta;

        const step = SEQUENCE[seqIndex.current];
        if (seqTimer.current >= step.d) {
            fromR.current = step.r;
            fromY.current = step.y;
            seqTimer.current = 0;
            seqIndex.current = (seqIndex.current + 1) % SEQUENCE.length;
        }

        const next = SEQUENCE[seqIndex.current];
        let t = Math.min(seqTimer.current / next.d, 1);
        t = t * t * (3 - 2 * t); // smoothstep between steps
        const waveR = fromR.current + (next.r - fromR.current) * t;
        const waveY = fromY.current + (next.y - fromY.current) * t;

        // Subtle idle breathing so the figure never looks frozen.
        // Combined with the short rest step, this keeps the character in
        // continuous visible motion rather than twitch-then-freeze.
        const time = state.clock.elapsedTime;
        const idleR = Math.sin(time * 1.5) * IDLE_ROT + Math.sin(time * 0.63) * IDLE_ROT * 0.45;
        const idleY = Math.sin(time * 2.15) * IDLE_HOP;
        const idleX = Math.sin(time * 1.05) * IDLE_SWAY;

        meshRef.current.rotation.z = waveR + idleR;
        meshRef.current.position.y = waveY + idleY;
        meshRef.current.position.x = idleX;
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh ref={meshRef}>
                <planeGeometry args={[dimensions.width, dimensions.height]} />
                <meshBasicMaterial color="#ffffff"
                    map={texture}
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
