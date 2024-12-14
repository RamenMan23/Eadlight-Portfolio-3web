//App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import {  ScrollControls } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import {  Suspense } from 'react'
import ScrollScene from './components/ScrollScene'
import MainSection from './components/MainScetion'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ContactForm from './components/ContactForm'
import Header from './components/Header';
import PageGuide from './components/PageGuide'
import WorksPage from './pages/WorksPage'
import { useState } from 'react'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<WorksPage />} />
      </Routes>
    </Router>
  );
}


function Home() {
  const { scrollYProgress } = useScroll();
  const [isDragging, setIsDragging] = useState(false);

  const wrapperZIndex = useTransform(
    scrollYProgress,
    (value: number) => value >= 0.9 ? 20 : -1
  );

  return (
    <div className="relative w-full bg-black">
      <div className="fixed inset-0 z-0">
        <Canvas 
          className="w-full h-full"
          gl={{ 
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: false
          }}
           >
          <color attach="background" args={['#000000']} />

          
          {/* スクロールコントロール */}
          <ScrollControls   pages={0}       // 4ページ分のスクロール領域
            damping={0.2}   // スムーズなスクロール
            distance={1.5}  // スクロール距離を少し延長
            enabled={!isDragging}
          >
            <Suspense fallback={null}>
              <ScrollScene scrollProgress={scrollYProgress} onDragStart={() => setIsDragging(true)} onDragEnd={() => setIsDragging(false)} />
            </Suspense>
          </ScrollControls>

          
          {/* <pointLight position={[10, 10, 10]} /> */}
           <ambientLight intensity={1} />
           <directionalLight 
            intensity={1.5} 
            position={[5, 5, 5]} 
            castShadow
          />  
          
          {/* Postprocessing */}
         <EffectComposer enableNormalPass>
            <Bloom luminanceThreshold={0.6} mipmapBlur luminanceSmoothing={0.3} intensity={0.4}  /> 
            {/* <DepthOfField target={[0, 0, 13]} focalLength={0.3} bokehScale={15} height={700} /> */}
          </EffectComposer>  
          
        </Canvas>
      </div>

        {/* HTMLコンテンツ */}
        <div className="fixed inset-0 z-10 pointer-events-none">
        <MainSection scrollProgress={scrollYProgress} />
      </div>

      <div className="fixed top-0 left-0 w-full z-30 flex flex-col text-white">
        <Header />
      </div>

          {/* PageGuide - z-indexを20に設定して他の要素の上に表示 */}
     <div className="pointer-events-auto pr-20">
        <PageGuide />
      </div>
        {/* ContactForm追加 */}
        <motion.div 
        className="fixed inset-0"
        style={{ zIndex: wrapperZIndex }}
        >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full pointer-events-auto">
            <ContactForm />
          </div>
        </div>
      </motion.div>


      {/* スクロール用の空要素を一番下に移動 */}
      <div className="w-full h-[1000vh]" aria-hidden="true" />
    </div>
  );
}

export default App;