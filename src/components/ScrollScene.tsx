import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import Eagle from './Eagle'
import { MotionValue, useTransform } from 'framer-motion'
import SpiralGallery from './SpiralGallery'


interface ScrollSceneProps {
  scrollProgress: MotionValue<number>;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const ScrollScene = ({ scrollProgress, onDragStart, onDragEnd }: ScrollSceneProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const timeoutRef = useRef<number>()  
  // Eagleの表示制御
  const eagleVisibility = useTransform(scrollProgress, [0, 0.3, 0.4], [1, 1, 0])


  useEffect(() => {
    // スムーズにスクロールを先頭に戻す
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // コンポーネントの表示を遅延させる
    timeoutRef.current = window.setTimeout(() => {
      setIsInitialized(true)
    }, 100)

    // クリーンアップ
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 初期化前は何も表示しない
  if (!isInitialized) return null

  return (
    <group ref={groupRef}>
      <Eagle visible={eagleVisibility.get() > 0} />
      <SpiralGallery 
        fadeOut={true}
        scrollProgress={scrollProgress}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </group>
  )
}

export default ScrollScene