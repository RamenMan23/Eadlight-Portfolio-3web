// components/PageGuide.tsx
// import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PageGuide = () => {
  const { scrollYProgress } = useScroll();

  const lineHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );

    // 各セクションの色を制御するための値を作成
    const topColor = useTransform(
        scrollYProgress,
        [0, 0], // スクロール位置の範囲
        ["rgba(255, 255, 255, 0.6)", "rgb(249, 115, 22)"]// 白からオレンジへ
      );
    
      const galleryColor = useTransform(
        scrollYProgress,
        [0.4, 0.5],
        ["rgba(255, 255, 255, 0.6)", "rgb(249, 115, 22)"]
      );
    
      const contactColor = useTransform(
        scrollYProgress,
        [0.85, 1],
        ["rgba(255, 255, 255, 0.6)", "rgb(249, 115, 22)"]
      );


        // テキストの色を制御するための値を作成
  const topTextColor = useTransform(
    scrollYProgress,
    [0, 0],
    ["rgba(255, 255, 255, 0.6)", "rgb(249, 115, 22)"]  // 半透明の白からオレンジへ
  );

  const galleryTextColor = useTransform(
    scrollYProgress,
    [0.4, 0.5],
    ["rgba(255, 255, 255, 0.6)", "rgb(249, 115, 22)"]
  );

  const contactTextColor = useTransform(
    scrollYProgress,
    [0.9, 1],
    ["rgba(255, 255, 255, 0.6)", "rgb(249, 115, 22)"]
  );

    

// 各セクションのスクロール位置を調整
const scrollTo = (position: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const isMobile = window.innerWidth < 768; // モバイルかどうかを判定
  
    // スクロール位置の値を画面サイズによって調整
    let adjustedPosition = position;
    if (isMobile) {
      // モバイル用のスクロール位置を微調整
      if (position === 0) adjustedPosition = 0;
      if (position === 0.5) adjustedPosition = 0.48; // ギャラリーセクションの位置
      if (position === 1) adjustedPosition = 0.95;  // コンタクトセクションの位置
    }
  
    window.scrollTo({
      top: totalHeight * adjustedPosition,
      behavior: "smooth"
    });
  };


  return (
    <>
      {/* デスクトップ表示用 */}
      <div className="fixed right-[8%] top-1/2 -translate-y-1/2 z-10 hidden md:block">
        {/* 既存のガイドライン表示コード */}
        <div className="relative h-[300px] md:h-[450px] flex items-center">
        {/* 背景のライン */}
        <div className="w-[1px] h-full bg-zinc-800" />
        
        {/* プログレスライン */}
        <motion.div 
          className="absolute top-0 left-0 w-[1px] bg-gradient-to-b from-orange-500 to-orange-400 rounded-full origin-top"
          style={{ height: lineHeight }}
        />

        {/* マーカーとラベル */}
        <div className="absolute -top-4 -left-2 flex items-center">
          <motion.button 
            onClick={() => scrollTo(0)}
            className="group flex items-center"
            whileHover="hover"
          >
            <motion.div 
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white flex items-center justify-center"
              style={{ backgroundColor: topColor }}
              variants={{
                hover: { scale: 1.5, backgroundColor: "#f97316" }
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-1 h-1 bg-black rounded-full"
                
                variants={{
                  hover: { scale: 2 }
                }}
              />
            </motion.div>
            <motion.span 
      className="hidden md:inline-block ml-3 text-sm font-medium transition-all duration-200"
      style={{ color: topTextColor }}
    >
      Top
    </motion.span>
          </motion.button>
        </div>

        <div className="absolute top-1/2 -left-2 -translate-y-1/2 flex items-center">
          <motion.button 
            onClick={() => scrollTo(0.5)}
            className="group flex items-center"
            whileHover="hover"
          >
            <motion.div 
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-500 flex items-center justify-center"
              style={{ backgroundColor: galleryColor }}
              variants={{
                hover: { scale: 1.5 }
              }}
              transition={{ duration: 0.2 }}
             >
            <motion.div 
                className="w-1 h-1 bg-black rounded-full"
                variants={{
                  hover: { scale: 2 }
                }}
              />
            </motion.div>
            <motion.span 
                className="hidden md:inline-block ml-3 text-sm font-medium transition-all duration-200"
                style={{ color: galleryTextColor }}
                >
               Gallery
            </motion.span>
          </motion.button>
        </div>

        <div className="absolute -bottom-4 -left-2 flex items-center">
          <motion.button 
            onClick={() => scrollTo(1)}
            className="group flex items-center"
            whileHover="hover"
          >
            <motion.div 
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white flex items-center justify-center"
              style={{ backgroundColor: contactColor }}
              variants={{
                hover: { scale: 1.5, backgroundColor: "#f97316" }
              }}
              transition={{ duration: 0.2 }}
            >
            <motion.div 
                className="w-1 h-1 bg-black rounded-full"
                variants={{
                  hover: { scale: 2 }
                }}
              />
            </motion.div>
            <motion.span 
                className="hidden md:inline-block ml-3 text-sm font-medium transition-all duration-200"
                style={{ color: contactTextColor }}
               >
              Contact
            </motion.span>
          </motion.button>
        </div>
      </div>
      </div>

{/* モバイル表示用 */}
<div className="fixed bottom-10 left-0 w-full z-10 md:hidden">
  <div className="flex flex-col items-center">
    {/* プログレスラインとボタンを重ねるためのコンテナ */}
    <div className="relative w-64 flex justify-center">
      {/* プログレスライン */}
      <div className="absolute top-[6px] w-[calc(100%-30px)] h-[1px] mx-3 ml-1" > {/* 両端に12pxずつマージンを追加 */}
        {/* 背景のライン */}
        <div className="absolute w-full h-full bg-zinc-800" />
    
        {/* プログレスライン */}
        <motion.div 
          className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full origin-left"
          style={{ width: lineHeight }}
        />
       </div>
       <div className="flex justify-between items-center w-full relative"> 
          {/* Top */}
          <motion.button 
            onClick={() => scrollTo(-0)}
             className="flex flex-col items-center z-10"
            whileHover="hover"
          >
            <motion.div 
              className="w-3 h-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: topColor }}
              variants={{
                hover: { scale: 1.5, backgroundColor: "#f97316" }
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-1 h-1 bg-black rounded-full"
                variants={{
                  hover: { scale: 2 }
                }}
              />
            </motion.div>
            <motion.span 
              className="text-xs font-medium mt-1"
              style={{ color: topTextColor }}
            >
              Top
            </motion.span>
          </motion.button>

          {/* Gallery */}
          <motion.button 
            onClick={() => scrollTo(0.5)}
             className="flex flex-col items-center z-10"
            whileHover="hover"
          >
            <motion.div 
              className="w-3 h-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: galleryColor }}
              variants={{
                hover: { scale: 1.5 }
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-1 h-1 bg-black rounded-full"
                variants={{
                  hover: { scale: 2 }
                }}
              />
            </motion.div>
            <motion.span 
              className="text-xs font-medium mt-1"
              style={{ color: galleryTextColor }}
            >
              Gallery
            </motion.span>
          </motion.button>

          {/* Contact */}
          <motion.button 
            onClick={() => scrollTo(1)}
             className="flex flex-col items-center z-10"
            whileHover="hover"
          >
            <motion.div 
              className="w-3 h-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: contactColor }}
              variants={{
                hover: { scale: 1.5 }
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-1 h-1 bg-black rounded-full"
                variants={{
                  hover: { scale: 2 }
                }}
              />
            </motion.div>
            <motion.span 
              className="text-xs font-medium mt-1"
              style={{ color: contactTextColor }}
            >
              Contact
            </motion.span>
          </motion.button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};


export default PageGuide;