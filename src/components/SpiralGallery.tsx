import { useNavigate } from 'react-router-dom';
import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
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
  const [isClick, setIsClick] = useState(false)
  const [pressStartTime, setPressStartTime] = useState(0)
  useCursor(hovered)

  // クリックの判定用の定数
  const MOVE_THRESHOLD = 5  // ピクセル単位
  const CLICK_THRESHOLD = 200  // ミリ秒
  const startPos = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    if (ref.current) {
      easing.damp3(ref.current.scale, hovered ? [1.2, 1.2, 1] : [1, 1, 1], 0.1, delta)
      
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
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        startPos.current = { x: e.clientX, y: e.clientY }
        setPressStartTime(Date.now())
        setIsClick(true)
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (!isClick) return
        
        const dx = e.clientX - startPos.current.x
        const dy = e.clientY - startPos.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // 一定以上の移動があった場合はクリックではないと判断
        if (distance > MOVE_THRESHOLD) {
          setIsClick(false)
        }
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        const pressDuration = Date.now() - pressStartTime
        
        // クリックとして扱う条件：
        // 1. isClickがtrueのまま（大きな移動がない）
        // 2. 押下時間が閾値以下
        if (isClick && pressDuration < CLICK_THRESHOLD) {
          e.stopPropagation() // クリック時のみ伝播を止める
          onPanelClick?.()
        }
        
        setIsClick(false)
        setPressStartTime(0)
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(false)
        setIsClick(false)
        setPressStartTime(0)
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

// 速度制限の定数を追加
const MAX_VELOCITY = {
  ROTATION: 1.2,    // 通常の回転の最大速度
  INERTIA: 0.3,     // 慣性による回転の最大速度
  VERTICAL: 0.02    // 垂直方向の最大速度
};

interface SpiralGalleryProps {
  fadeOut?: boolean;
  scrollProgress: MotionValue<number>;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const SpiralGallery = ({  fadeOut = false, onDragStart, onDragEnd }: SpiralGalleryProps) => {
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


  // スクロール制御のための関数を追加
  const preventDefault = useCallback((e: Event) => {
    // ドラッグ中のみイベントをキャンセル
    if (isDragging && e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [isDragging]);

  // スクロール位置を保存するための変数
  const scrollPosition = useRef(0);

  const disableScroll = useCallback(() => {
    // 現在のスクロール位置を保存
    scrollPosition.current = window.scrollY;
    
    // スクロール禁止のスタイルを適用
    document.body.style.overflow = 'hidden';
    document.body.style.top = `-${scrollPosition.current}px`;
    
    // passive: falseでイベントリスナーを追加
    const options = { passive: false };
    window.addEventListener('wheel', preventDefault, options);
    window.addEventListener('touchmove', preventDefault, options);
    window.addEventListener('scroll', preventDefault, options);

    //console.log('🚫 Scroll disabled');
  }, [preventDefault]);

  const enableScroll = useCallback(() => {
    // スクロール制御を解除
    document.body.style.overflow = '';
    document.body.style.top = '';
    
    // 保存していた位置までスクロール
    window.scrollTo(0, scrollPosition.current);
    
    // イベントリスナーを削除
    window.removeEventListener('wheel', preventDefault);
    window.removeEventListener('touchmove', preventDefault);
    window.removeEventListener('scroll', preventDefault);

    //console.log('✅ Scroll enabled');
  }, [preventDefault]);

  // ドラッグ状態の変更を監視
  useEffect(() => {
    if (isDragging) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => {
      // コンポーネントのアンマウントまたはドラッグ状態の変更時に確実にスクロールを有効化
      enableScroll();
    };
  }, [isDragging, enableScroll, disableScroll]);

  // 回転の正規化関数を追加
  const normalizeRotation = (rotation: number): number => {
    const TWO_PI = Math.PI * 2;
    return ((rotation % TWO_PI) + TWO_PI) % TWO_PI;
  };

  // handlePointerMoveの修正
  const handlePointerMove = (event: PointerEvent | TouchEvent) => {
    if (!isDragging || !groupRef.current) return;

    const currentTime = Date.now();
    const deltaTime = Math.min(Math.max((currentTime - lastUpdateTime.current) / 1000, 0.001), 0.1); // 最小値を設定
    lastUpdateTime.current = currentTime;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - previousMousePosition.x;
    const deltaY = clientY - previousMousePosition.y;

    // 速度計算と制限
    const rawVelocityY = deltaX * 0.003 / deltaTime;
    const rawVelocityX = deltaY * 0.001 / deltaTime;

    // 速度を制限（NaNチェックを追加）
    const targetVelocityY = isNaN(rawVelocityY) ? 0 : 
      Math.min(Math.max(rawVelocityY, -MAX_VELOCITY.ROTATION), MAX_VELOCITY.ROTATION);
    const targetVelocityX = isNaN(rawVelocityX) ? 0 : 
      Math.min(Math.max(rawVelocityX, -MAX_VELOCITY.VERTICAL), MAX_VELOCITY.VERTICAL);

    setVelocity(prev => ({
      y: isNaN(prev.y) ? targetVelocityY : prev.y * 0.8 + targetVelocityY * 0.2,
      x: isNaN(prev.x) ? targetVelocityX : prev.x * 0.8 + targetVelocityX * 0.2
    }));

    // 回転の更新と正規化
    let newYRotation = normalizeRotation(rotationState.y + deltaX * 0.003);
    let newXRotation = Math.max(Math.min(rotationState.x + deltaY * 0.001, Math.PI/12), -Math.PI/12);

    setRotationState({
      y: newYRotation,
      x: newXRotation
    });

    setPreviousMousePosition({ x: clientX, y: clientY });
  };

  // イベントの型定義を追加
  type PointerEvent3D = ThreeEvent<PointerEvent>;
  type TouchEvent3D = ThreeEvent<TouchEvent>;


// handlePointerDownの型を修正
const handlePointerDown = (event: PointerEvent3D | TouchEvent3D) => {
  event.stopPropagation();
  setIsDragging(true);
  onDragStart();  // ドラッグ開始を通知
  //console.log('👇 Pointer down - Starting drag');
  setVelocity({ x: 0, y: 0 });

  const clientX = 'touches' in event.nativeEvent 
    ? event.nativeEvent.touches[0].clientX 
    : event.nativeEvent.clientX;
  const clientY = 'touches' in event.nativeEvent 
    ? event.nativeEvent.touches[0].clientY 
    : event.nativeEvent.clientY;

  setPreviousMousePosition({
    x: clientX,
    y: clientY
  });
  
  lastUpdateTime.current = Date.now();
  disableScroll();
};

  // マウスアップハンドラーの修正
  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();  // ドラッグ終了を通知
      enableScroll();
    }
  }, [isDragging, enableScroll, onDragEnd]);

  const handleTouchEnd = () => {
    if (isDragging) {
      //console.log('👆 Touch end - Ending drag');
      setIsDragging(false);
      enableScroll();
    }
  };

useEffect(() => {
  const handleMove = (e: PointerEvent | TouchEvent) => {
    if (isDragging) {
      handlePointerMove(e);
    }
  };

  if (isDragging) {
    const options = { passive: false };
    window.addEventListener('touchmove', handleMove as (e: TouchEvent) => void, options);
    window.addEventListener('pointermove', handleMove as (e: PointerEvent) => void);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('pointerleave', handlePointerUp);
    window.addEventListener('touchcancel', handleTouchEnd);
  }

  return () => {
    if (isDragging) {
      window.removeEventListener('touchmove', handleMove as (e: TouchEvent) => void);
      window.removeEventListener('pointermove', handleMove as (e: PointerEvent) => void);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('pointerleave', handlePointerUp);
      window.removeEventListener('touchcancel', handleTouchEnd);
      enableScroll();
    }
  };
}, [isDragging, handlePointerUp, enableScroll]);

// SpiralGalleryコンポーネント内のメモリ解放処理
useEffect(() => {
  return () => {
    //console.log('🧹 Cleanup - Ensuring scroll is enabled');
    enableScroll();
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
        const newVelY = isNaN(prev.y) ? 0 : prev.y * friction;
        const newVelX = isNaN(prev.x) ? 0 : prev.x * friction;

        const limitedVelY = Math.min(Math.max(newVelY, -MAX_VELOCITY.INERTIA), MAX_VELOCITY.INERTIA);
        const limitedVelX = Math.min(Math.max(newVelX, -MAX_VELOCITY.VERTICAL), MAX_VELOCITY.VERTICAL);

        return {
          y: Math.abs(limitedVelY) < minVelocity ? 0 : limitedVelY,
          x: Math.abs(limitedVelX) < minVelocity ? 0 : limitedVelX
        };
      });

      setRotationState(prev => ({
        y: normalizeRotation(prev.y + velocity.y),
        x: Math.max(Math.min(prev.x + velocity.x, Math.PI/36), -Math.PI/36)
      }));
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


  
return (
  <group 
    ref={groupRef} 
    onPointerDown={handlePointerDown}
>
    <ImagePanels 
      images={getGalleryImages()}
      sharedGeometry={sharedGeometry}
      onPanelClick={() => navigate('/works')}  
    />
  </group>
);
}

export default SpiralGallery