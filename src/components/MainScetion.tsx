// MainSection.tsx
import { motion,  useTransform, MotionValue } from 'framer-motion';

interface MainSectionProps {
  scrollProgress: MotionValue<number>;
}

const MainSection = ({ scrollProgress }: MainSectionProps) => {
  // スクロールに基づいたメインセクションの透明度
  // const mainSectionOpacity = useTransform(
  //   scrollProgress,
  //   [0, 0.3, 0.4],
  //   [1, 1, 0]
  // );

  //   // z-indexの変換を追加
  //   const zIndex = useTransform(
  //     scrollProgress,
  //     [0.4, 0.41],
  //     [-1, 1]
  //   );


  return (
    <div className="fixed inset-0 w-full h-full">
      {/* メインセクション (0-40%) */}
      <motion.section 
        className="flex flex-col  w-full h-screen items-center justify-center max-w-7xl mx-auto px-8 gap-y-8 md:gap-8"
        style={{
          opacity: useTransform(scrollProgress, [0.0, 0.4, 0.45, 0.46], [1, 1, 0.3, 0]),
          y: useTransform(scrollProgress, [0, 0.4, 0.45], [0, 0, -750]),
          
        }}
      >
        <motion.h1 
          className=" w-full  justify-center  text-4xl md:text-9xl font-playfair mb-40 text-white"
          initial={{y:-100, x:0, opacity:0}}
          animate={{y:0, opacity:1}}
          transition={{
            type: "spring",
            duration: 0.5,
            delay:0.6,
            stiffness:130
          }}
        >
          VISUAL  
  {/* motion.divで包んでアニメーションを独立させる */}
  <motion.div 
    className="inline-block"
    initial={{y:-600, opacity:0}}
    animate={{y:0, opacity:1}}
    transition={{
      type: "spring",
      duration: 0,
      delay: 2,
      stiffness:130
    }}
  >
    <span className='text-orange-500'>&</span>
  </motion.div>
          <br /> DEVELOPMENT
        </motion.h1>
        
        <div className="flex w-full items-center justify-between gap-3 md:gap-6 text-white">
          <motion.ul 
            className='flex-1 text-base md:text-5xl font-playfair'
            initial={{x:100, opacity:0}}
            animate={{x:0, opacity:1}}
            transition={{
              type: "spring",
              duration: 4,
              delay:0.6,
              stiffness:70,
            }}
          >
            <motion.li className='mb-4'style={{x: useTransform(scrollProgress, [0, 0.05, 0.1], [-50, -30,0])}}>Product Animation</motion.li>
            <motion.li className='mb-4'style={{x: useTransform(scrollProgress, [0.1, 0.15, 0.2], [-50, -30,0])}}>ArchiViz</motion.li>
            <motion.li className='mb-8'style={{x: useTransform(scrollProgress, [0.2, 0.23, 0.25], [-50, -30,0])}}>Development</motion.li>
          </motion.ul>
          
          <motion.button 
            className='pointer-events-auto mr-6 px-6 py-3 text-1xl md:text-4xl border-2 
              border-orange-500 text-orange-500 font-playfair hover:translate-y-1 duration-150'
            initial={{y:100, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{
              type: "spring",
              duration: 1,
              delay:1,
              stiffness:150,
            }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgb(249, 115, 22)",
              color: "white",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          > 
            <a href="/works" className=" block w-full h-full ">Works</a>
          </motion.button>
        </div>
      </motion.section>

    {/* スクロールテキストアニメーション (40%以降) */}
    <motion.div 
  className="fixed  md:bottom-12 bottom-24 left-1/2 -translate-x-1/2 z-10" 
  style={{ 
    opacity: useTransform(scrollProgress, [0.45, 0.5, 0.67, 0.85, 0.9], [0, 1, 1, 1, 0]),
  }}>
  <motion.h2
    className="text-2xl md:text-7xl font-playfair text-white"
  >
            Works Gallery
          </motion.h2> 





        {/* Product Animation テキスト */}
        
        {/* <motion.h2
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-playfair text-orange-500"
          style={{
            opacity: useTransform(scrollProgress, [0.45, 0.46, 0.55, 0.56], [0, 1, 1, 0]),
            y: useTransform(scrollProgress, [0.45, 0.46], [200, 200]),
            x: useTransform(scrollProgress, [0.45, 0.46], [-600, -450])
          }}
        >
          Product Animation
        </motion.h2> */}
        

        {/* Architect Visualization テキスト */}
        {/* <motion.h2
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-playfair text-white"
          style={{
            opacity: useTransform(scrollProgress, [0.6, 0.61, 0.7, 0.71], [0, 1, 1, 0]),
            y: useTransform(scrollProgress, [0.6, 0.61], [200, 200]),
            x: useTransform(scrollProgress, [0.6, 0.61], [-600, -450])
          }}
        >
          Architect Visualization
        </motion.h2> */}

        {/* Development テキスト */}
        {/* <motion.h2
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-playfair text-white"
          style={{
            opacity: useTransform(scrollProgress, [0.75, 0.76, 0.85, 0.86], [0, 1, 1, 0]),
            y: useTransform(scrollProgress, [0.75, 0.76], [200, 200]),
            x: useTransform(scrollProgress, [0.75, 0.76], [-600, -450])
          }}
        >
          Development
        </motion.h2> */}

        {/* Contact テキスト */}
        {/* <motion.h2
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-playfair text-white"
          style={{
            opacity: useTransform(scrollProgress, [0.91, 0.95, 1 ], [0, 1, 1]),
            y: useTransform(scrollProgress, [0.85, 0.96], [200, -400]),
            x: useTransform(scrollProgress, [0.85, 0.96], [-100, -150])
          }}
        >
          Contact
        </motion.h2> */}


      </motion.div>
    </div>
  );
};

export default MainSection;