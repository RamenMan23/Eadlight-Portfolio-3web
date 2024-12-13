import { useNavigate } from 'react-router-dom';
import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion'
// import { a as animated, useSpring as useReactSpring } from '@react-spring/three'
import { ThreeEvent } from '@react-three/fiber'
import works from '../data/works'
import { Image } from '@react-three/drei'
import { easing } from 'maath'
import { extend } from '@react-three/fiber'

// 共有ジオメトリのための定数
const SEGMENTS = 10; // セグメント数を削減
const PANEL_WIDTH = 2;
const PANEL_HEIGHT = 3;
const BEND_RADIUS = 8;

// // クロップサイズの定数を追加
// const CROP_SIZE = 2;  // 正方形パネルのサイズ

class CustomBentPlaneGeometry extends THREE.BufferGeometry {
  constructor() {
    super();
    
    // コンストラクタでは基本的な初期化のみを行う
    this.initialize();
  }

  // カスタムメソッドを追加してジオメトリを設定
  initialize(
    width: number = PANEL_WIDTH,
    height: number = PANEL_HEIGHT,
    segments: number = SEGMENTS,
    bendRadius: number = BEND_RADIUS
  ) {
    const planeGeometry = new THREE.PlaneGeometry(width, height, segments, segments);

    
    
    const position = planeGeometry.getAttribute('position');
    const uv = planeGeometry.getAttribute('uv');
    const normal = planeGeometry.getAttribute('normal');
    const index = planeGeometry.getIndex();

    if (position && uv && normal) {
      this.setAttribute('position', position.clone());
      this.setAttribute('uv', uv.clone());
      this.setAttribute('normal', normal.clone());
      
      if (index) {
        this.setIndex(index.clone());
      }
    }

    // 曲処理
    const pos = this.getAttribute('position') as THREE.BufferAttribute;
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = -(x * x) / (2 * bendRadius);
        pos.setXYZ(i, x, y, z);
      }
      
      pos.needsUpdate = true;
      this.computeVertexNormals();
    }

    planeGeometry.dispose(); // メモリ解放
    return this;
  }

  dispose(): void {
    super.dispose();
  }
}

// 共有ジオメトリを作成する関数を追加
const createSharedGeometry = () => {
  const geo = new CustomBentPlaneGeometry();
  return geo.initialize();
};

// アスペクト比調整関数を修正
// const useImageAspect = (url: string, hovered: boolean) => {
//   const [dimensions, setDimensions] = useState({ width: CROP_SIZE, height: CROP_SIZE });

//   useEffect(() => {
//     const img = document.createElement('img');
//     img.onload = () => {
//       // 正方形クロップサイズ（非ホバー時）
//       const squareSize = { width: CROP_SIZE, height: CROP_SIZE };

//       // オリジナルのアスペクト比（ホバー時）
//       const originalAspect = img.width / img.height;
//       const originalSize = originalAspect > 1
//         ? { width: CROP_SIZE * originalAspect, height: CROP_SIZE }
//         : { width: CROP_SIZE, height: CROP_SIZE / originalAspect };

//       // ホバー状態に応じてサイズを設定
//       setDimensions(hovered ? originalSize : squareSize);
//     };
//     img.src = url;

//     return () => {
//       img.onload = null;
//     };
//   }, [url, hovered]);

//   return dimensions;
// };

// テクスチャローダーの設定
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';


// images配列を作成する関数
const getGalleryImages = () => {
  return works.map(work => 
    work.type === 'image' 
      ? work.images![0]
      : work.thumbnailUrl
  );
};

// function CenterSphere() {
//   return (
//     <mesh>
//       <sphereGeometry args={[1, 32, 32]} />
//       <meshStandardMaterial
//         color="#FFD700"
//         metalness={0.5}
//         roughness={0.2}
//         emissive="#FFD700"
//         emissiveIntensity={0.2}
//       />
//     </mesh>
//   )
// }

interface ImagePanelsProps {
  images: string[];
  sharedGeometry: CustomBentPlaneGeometry;  // 型を修正
  onPanelClick: () => void;
}


function ImagePanels({ images,  onPanelClick }: ImagePanelsProps) {
  const radius = 4;  // ここで配置半径を調整可能
  const angleStep = (Math.PI * 2) / images.length;
  
  return (
    <>
      {images.map((imageUrl, index) => {
        const angle = angleStep * index;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const rotationY = Math.atan2(x, z);
        
        return (
          <ImagePanel
            key={index}
            url={imageUrl}
            position={[x, 0, z]}
            rotation={[0, rotationY, 0]}
            scale={2}
            onPanelClick={onPanelClick}
          />
        );
      })}
    </>
  );
}

interface ImagePanelProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number | [number, number];  // scaleの型を修正
  onPanelClick?: () => void;
}

function ImagePanel({ url, onPanelClick, ...props }: ImagePanelProps) {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((_, delta) => {
    if (ref.current) {
      // スケールアニメーションを2次元に修正
      easing.damp3(ref.current.scale, hovered ? [1.2, 1.2, 1] : [1, 1, 1], 0.1, delta)
      
      // マテリアルのエフェクト
      const material = ref.current.material as any
      if (material) {
        easing.damp(material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
        easing.damp(material, 'zoom', hovered ? 1 : 1.2, 0.2, delta)
      }
    }
  })

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(false)
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onPanelClick?.()
      }}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, PANEL_WIDTH, PANEL_HEIGHT, 20, 20]} />
    </Image>
  )
}

// BentPlaneGeometryの型定義を追加
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;  // 必要に応じて適切な型を定義
    }
  }
}

// BentPlaneGeometryの定義
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius: number, width: number, height: number, widthSegments: number, heightSegments: number) {
    super(width, height, widthSegments, heightSegments)
    
    const p = this.parameters
    const hw = p.width * 0.5
    const a = new THREE.Vector2(-hw, 0)
    const b = new THREE.Vector2(0, radius)
    const c = new THREE.Vector2(hw, 0)
    const ab = new THREE.Vector2().subVectors(a, b)
    const bc = new THREE.Vector2().subVectors(b, c)
    const ac = new THREE.Vector2().subVectors(a, c)
    const r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)))
    const center = new THREE.Vector2(0, radius - r * 1) 
    const baseV = new THREE.Vector2().subVectors(a, center)
    const baseAngle = baseV.angle() - Math.PI * 0.5
    const arc = baseAngle * 2
    
    const uv = this.attributes.uv
    const pos = this.attributes.position
    const mainV = new THREE.Vector2()
    
    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i)
      const y = pos.getY(i)
      mainV.copy(c).rotateAround(center, arc * uvRatio)
      pos.setXYZ(i, mainV.x, y, -mainV.y)
    }
    
    pos.needsUpdate = true
  }
}

// @react-three/fiberに登録
extend({ BentPlaneGeometry })

interface SpiralGalleryProps {
  visible: boolean;
  fadeOut?: boolean;
  scrollProgress: MotionValue<number>;
}

export const SpiralGallery = ({ visible, fadeOut = false }: SpiralGalleryProps) => {
  const navigate = useNavigate();
  const groupRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();
  
  // 共有ジオメトリの生成
  const sharedGeometry = useMemo(() => createSharedGeometry(), []);
  
  // ドラッグ状態と慣性の管理
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const [rotationState, setRotationState] = useState({ y: 0, x: 0 });
  const [velocity, setVelocity] = useState({ y: 0, x: 0 });
  const lastUpdateTime = useRef(Date.now());
  
  // スクロール値のスムージング
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 位置とローテーションの制御
  const positionX = useTransform(
    smoothProgress,
    [0.4, 0.45, 0.6, 0.7, 0.9],
    [0, 0, 0, 0, 0]
  );

  const positionY = useTransform(
    smoothProgress,
    [0.4, 0.45, 0.6, 0.7, 0.9],
    [-50, 0, 0, 0, 0]
  );

  const positionZ = useTransform(
    smoothProgress,
    [0.4, 0.45, 0.6, 0.7, 0.9],
    [-10, -4, -3, -3, -3]
  );

  const rotationY = useTransform(
    smoothProgress,
    [0.4, 0.45, 0.6, 0.7, 0.9],
    [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5, Math.PI * 2]
  );

  // マウスダウンハンドラー
  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    setPreviousMousePosition({
      x: event.clientX ?? event.touches?.[0]?.clientX ?? 0,
      y: event.clientY ?? event.touches?.[0]?.clientY ?? 0
    });
    lastUpdateTime.current = Date.now();
  };

// handlePointerMoveの修正部分
const handlePointerMove = (event: PointerEvent | TouchEvent) => {
  if (!isDragging || !groupRef.current) return;

  const currentTime = Date.now();
  const deltaTime = Math.min((currentTime - lastUpdateTime.current) / 1000, 0.1); // deltaTimeに上限を設定
  lastUpdateTime.current = currentTime;

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

  const deltaX = clientX - previousMousePosition.x;
  const deltaY = clientY - previousMousePosition.y;

  const rotationSensitivity = 0.001; // より細かな制御のため減少
  const maxVelocity = 0.3; // 最大速度を制限
  const smoothingFactor = 0.4; // 新旧velocityの補間係数

  // 新しいvelocityの計算
  const targetVelocityY = Math.min(Math.max(deltaX * rotationSensitivity / deltaTime, -maxVelocity), maxVelocity);
  const targetVelocityX = Math.min(Math.max(deltaY * rotationSensitivity / deltaTime, -maxVelocity), maxVelocity);

  // 前回のvelocityと新しいvelocityの補間
  setVelocity(prev => ({
    y: prev.y * (1 - smoothingFactor) + targetVelocityY * smoothingFactor,
    x: prev.x * (1 - smoothingFactor) + targetVelocityX * smoothingFactor
  }));

  let newYRotation = rotationState.y + (deltaX * rotationSensitivity);
  let newXRotation = rotationState.x + (deltaY * rotationSensitivity);
  newXRotation = Math.max(Math.min(newXRotation, Math.PI/6), -Math.PI/6);

  setRotationState({
    y: newYRotation,
    x: newXRotation
  });

  setPreviousMousePosition({
    x: clientX,
    y: clientY
  });
};
  // マウスアップハンドラー
  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent | TouchEvent) => handlePointerMove(e);
    
    window.addEventListener('pointermove', handleMove as (e: PointerEvent) => void);
    window.addEventListener('touchmove', handleMove as (e: TouchEvent) => void);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handleMove as (e: PointerEvent) => void);
      window.removeEventListener('touchmove', handleMove as (e: TouchEvent) => void);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, previousMousePosition]);

// SpiralGalleryコンポーネント内のメモリ解放処理
useEffect(() => {
  return () => {
    if (groupRef.current) {
      // グループ内の全てのメッシュを処理
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshBasicMaterial;
          if (material) {
            if (material.map) {
              material.map.dispose();
            }
            material.dispose();
          }
        }
      });

      // 共有ジオメトリの解放
      if (sharedGeometry instanceof THREE.BufferGeometry) {
        sharedGeometry.dispose();
      }
    }
  };
}, [sharedGeometry]);

  useFrame(() => {
    if (!groupRef.current) return;

    // 位置の更新
    groupRef.current.position.x = positionX.get();
    groupRef.current.position.y = positionY.get();
    groupRef.current.position.z = positionZ.get();

    // ベースとなるスクロール回転
    const baseRotationY = rotationY.get();

    if (!isDragging) {
      const friction = 0.95;
      const minVelocity = 0.001;

      setVelocity(prev => {
        const newVelY = prev.y * friction;
        const newVelX = prev.x * friction;

        return {
          y: Math.abs(newVelY) < minVelocity ? 0 : newVelY,
          x: Math.abs(newVelX) < minVelocity ? 0 : newVelX
        };
      });

      setRotationState(prev => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;

        newX = Math.max(Math.min(newX, Math.PI/36), -Math.PI/36);

        return {
          y: newY,
          x: newX
        };
      });
    }

    // 回転の適用
    groupRef.current.rotation.y = baseRotationY + rotationState.y;
    groupRef.current.rotation.x = rotationState.x;

    // フェードアウト制御
    if (fadeOut) {
      const progress = smoothProgress.get();
      const opacity = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) * 8.67) : 1;
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.Material;
          if (material && 'opacity' in material) {
            material.opacity = opacity;
          }
        }
      });
    }
  });

if (!visible) return null;
  
return (
  <group 
    ref={groupRef} 
    visible={visible}
    onPointerDown={handlePointerDown}
  >
    <ImagePanels 
      images={getGalleryImages()}
      sharedGeometry={sharedGeometry}
      onPanelClick={() => navigate('/works')}  
    />
  </group>
)
}

export default SpiralGallery