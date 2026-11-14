import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Avatar Component - Hand-drawn sketch style character
 *
 * Plays avatar2_720.mp4: the same hand-drawn figure, waving, filmed on a
 * pure-black background. The black is keyed out in the fragment shader
 * (smoothstep on luminance) so only the line art remains - visually the
 * same as the transparent avatar_corridor.webp it replaces, but moving.
 *
 * - playbackRate 0.65 calms the 60fps source down to a smooth, slightly
 *   slow wave (the 2.27s loop stretches to ~3.49s).
 * - avatar2_720.mp4 is a 720x1280 re-encode of avatar(2).mp4 (136 frames
 *   @ 60fps, 2.27s loop, kept untouched). Uploading full-size frames every
 *   video frame cost ~46fps of the corridor's budget (33fps with a 4K
 *   source vs 79fps without the avatar); the 720p source keeps the
 *   corridor smooth. The re-encode kept the background pure black
 *   (measured: max luminance 0 outside the figure, far below the 0.010
 *   key floor) and the loop seam intact (frame 135 -> 0 diff is smaller
 *   than a typical mid-animation change).
 * - The video is loaded imperatively rather than through drei's
 *   useVideoTexture: that hook suspends, and the corridor has no Suspense
 *   boundary between it and the App-level one, so suspending would blank
 *   the whole scene while the metadata loads.
 * - Plane size and offsets reproduce the old static texture's layout, so
 *   the figure's feet and centre stay exactly where they were.
 */

const VIDEO_SRC = '/textures/corridor/avatar_anim/avatar2_720.mp4';
const PLAYBACK_RATE = 0.65;

// Plane sizing reproduces the old static texture's layout:
// - avatar_corridor.webp was 1024x1024 on a 2.3x2.3 plane; its figure
//   (bbox y 76..1012) stood 2.10 units tall, feet at local y -1.123,
//   centre at local x +0.126.
// - The video is 720x1280 (9:16) with its figure (bbox y 134..1864 of
//   1920, fill 0.901 - the same framing as the static texture) filling
//   0.9 of the frame height, so a 2.336-tall plane matches the old
//   figure's height; MESH_OFFSET then lands the feet/centre on the old
//   figure's spots (relative to the group passed in by CorridorSegment).
const PLANE_HEIGHT = 2.336;
const MESH_OFFSET = [0.1015, -0.023, 0];

// The video background is pure black (measured: avatar(2) border samples
// exactly 0). Key it to alpha 0 over a very narrow band so the
// anti-aliased edges of the white line art stay soft.
// Luminance is read from the raw sRGB sample, BEFORE three's inline
// DECODE_VIDEO_TEXTURE transfer, so the thresholds match the measured
// frame values.
const KEY_BLACK_TO_ALPHA = /* glsl */ `
#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	float keyLuma = dot( sampledDiffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
	sampledDiffuseColor.a *= smoothstep( 0.010, 0.050, keyLuma );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif
`;

const applyBlackKey = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', KEY_BLACK_TO_ALPHA);
};

const Avatar = ({ position = [10, -20, 30] }) => {
    const [texture, setTexture] = useState(null);
    const [size, setSize] = useState([1, 1]);
    const textureRef = useRef(null);

    useEffect(() => {
        const video = document.createElement('video');
        video.src = VIDEO_SRC;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.playbackRate = PLAYBACK_RATE;

        const onReady = () => {
            const tex = new THREE.VideoTexture(video);
            tex.colorSpace = THREE.SRGBColorSpace;
            // Mipmaps stay OFF (three's VideoTexture default): the texture
            // re-uploads on every presented video frame, and regenerating
            // the mipmap chain each time costs extra on every frame. The
            // plane draws close to 1:1 with the 720p source, so plain
            // bilinear keeps the line art clean without shimmer.
            textureRef.current = tex;
            setSize([(video.videoWidth / video.videoHeight) * PLANE_HEIGHT, PLANE_HEIGHT]);
            setTexture(tex);
            video.play().catch(() => {});
        };

        video.addEventListener('loadeddata', onReady, { once: true });
        return () => {
            video.removeEventListener('loadeddata', onReady);
            video.pause();
            video.removeAttribute('src');
            video.load(); // release the buffered stream
            textureRef.current?.dispose();
            textureRef.current = null;
            setTexture(null);
        };
    }, []);

    if (!texture) return null;

    return (
        <group position={position}>
            <mesh position={MESH_OFFSET}>
                <planeGeometry args={[size[0], size[1]]} />
                <meshBasicMaterial
                    color="#ffffff"
                    map={texture}
                    transparent={true}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    onBeforeCompile={applyBlackKey}
                />
            </mesh>
        </group>
    );
};

export default Avatar;
