import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { makeCertificate } from "../textures";
import education, { educationMedia } from "../../data/education";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
const W = 0.3;
const H = 0.22;
const T = 0.015;
const HOOK_ABOVE = 0.15; // the wall hook sits this far above the frame centre
const INNER = { width: W - T * 2 + 0.004, height: H - T * 2 + 0.004 };

/** Loads an image as an sRGB texture without suspending; null until ready or on failure. */
function useImageTexture(url) {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    new THREE.TextureLoader().load(
      url,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = 4;
        setTexture(loaded);
      },
      undefined,
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [url]);
  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

/** Framed certificate 0.30 × 0.22 hanging from the wall hook by a string. Origin = frame centre on the wall. */
export default function Certificate({ name, onSelect, hovered, active, ...props }) {
  const paper = useMemo(() => makeCertificate(education[0]), []);
  const image = useImageTexture(educationMedia.certificateImage);
  const fitted = useMemo(() => {
    const aspect = image?.image ? image.image.width / image.image.height : 1;
    const inset = 0.012;
    const width = Math.min(INNER.width - inset, (INNER.height - inset) * aspect);
    return { width, height: width / aspect };
  }, [image]);
  const wood = <meshStandardMaterial color="#6b4a2f" roughness={0.65} />;
  return (
    <group name={name} {...props}>
      <mesh position={[0, H / 2 - T / 2, 0.006]} castShadow>
        <boxGeometry args={[W, T, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[0, -H / 2 + T / 2, 0.006]} castShadow>
        <boxGeometry args={[W, T, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[-W / 2 + T / 2, 0, 0.006]} castShadow>
        <boxGeometry args={[T, H, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[W / 2 - T / 2, 0, 0.006]} castShadow>
        <boxGeometry args={[T, H, 0.012]} />
        {wood}
      </mesh>
      {image ? (
        <>
          {/* Cream mat, then the image fitted inside it */}
          <mesh position={[0, 0, 0.004]}>
            <planeGeometry args={[INNER.width, INNER.height]} />
            <meshStandardMaterial color="#f3ecdc" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0.0045]}>
            <planeGeometry args={[fitted.width, fitted.height]} />
            <meshStandardMaterial map={image} roughness={0.85} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[INNER.width, INNER.height]} />
          <meshStandardMaterial map={paper} roughness={0.9} />
        </mesh>
      )}
      <PanelAnchor name={name} width={W - T * 2 + 0.004} height={H - T * 2 + 0.004} position={[0, 0, 0.0125]} />
      {/* Hanging string */}
      <Line points={[[0, HOOK_ABOVE, 0.004], [-W / 2 + 0.03, H / 2 - 0.01, 0.004]]} color="#444" lineWidth={1} />
      <Line points={[[0, HOOK_ABOVE, 0.004], [W / 2 - 0.03, H / 2 - 0.01, 0.004]]} color="#444" lineWidth={1} />
    </group>
  );
}
