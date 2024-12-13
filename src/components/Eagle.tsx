//Eagle.tsx
import { useGLTF, useAnimations} from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useScroll, useTransform, useSpring } from 'framer-motion'

interface EagleProps {
  fadeOut?: boolean
  visible?: boolean
}

function Eagle({ fadeOut = false, visible = true }: EagleProps) {
  const { scene, animations } = useGLTF('/src/assets/gltf/gltf_eagle/scene.gltf')
  const { actions } = useAnimations(animations, scene)
  const { scrollYProgress } = useScroll()

  // スムーズなスクロール値
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 位置とローテーションの制御
  const positionX = useTransform(
    smoothProgress,
    [0, 0.1, 0.15, 0.25, 0.3, 0.35],
    [30, -100, -60, 4, 4, 21]
  );

  const positionY = useTransform(
    smoothProgress,
    [0, 0.1, 0.15, 0.25],
    [25, -20, -15, -6.7]
  );

  const positionZ = useTransform(
    smoothProgress,
    [0, 0.1, 0.15, 0.25],
    [-60, -50, -20, -11]
  );

  const rotationY = useTransform(
    smoothProgress,
    [0, 0.1, 0.15, 0.25],
    [Math.PI * 1.5, Math.PI * 2, Math.PI * 2.2, Math.PI * 2.13]
  );


  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) 
          ? child.material 
          : [child.material]

        materials.forEach((material) => {
          if (material) {
            material.transparent = false
            material.alphaTest = 0.3  // controls.material.alphaTest の代わりに固定値
            material.roughness = 0.62  // controls.material.roughness の代わりに固定値
            material.metalness = 0     // controls.material.metalness の代わりに固定値
            material.depthTest = true
            material.depthWrite = true

            if (material.map) {
              material.map.colorSpace = THREE.SRGBColorSpace
              material.map.minFilter = THREE.LinearMipmapLinearFilter
              material.map.magFilter = THREE.LinearFilter
              material.map.flipY = false
              material.map.generateMipmaps = true
              material.map.premultiplyAlpha = false
            }
            material.needsUpdate = true
          }
        })
      }
    })



    // アニメーションの設定
    const actionKeys = Object.keys(actions)
    if (actionKeys.length > 0) {
      const action = actions[actionKeys[0]]
      if (action) {
        action.setDuration(9)
        action.play()
      }
    }
  }, [actions, scene])


  useFrame(() => {
    if (!scene) return

    // 位置とローテーションの更新
    scene.position.x = positionX.get()
    scene.position.y = positionY.get()
    scene.position.z = positionZ.get()
    scene.rotation.y = rotationY.get()

    // フェードアウト制御
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.Material
        if (material && material.opacity !== undefined) {
          material.opacity = fadeOut ? 1 - (smoothProgress.get() - 0.3) * 5 : 1
        }
      }
    })

    // スケール設定
    const scale = 0.08
    scene.scale.set(scale, scale, scale)
  })

  if (!visible) return null

  return (
    <primitive 
      object={scene} 
      scale={[0.2, 0.2, 0.2]}
      position={[15, -15, -50]}
      rotation={[0, Math.PI * 6, 0]}
    />
  )
}


useGLTF.preload('/src/assets/gltf/gltf_eagle/scene.gltf')

export default Eagle 