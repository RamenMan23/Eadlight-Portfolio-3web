// components/Header.tsx

import { motion } from 'framer-motion';
import { Instagram, Youtube, Mail } from 'lucide-react';

const Header = () => {
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/eadlight.visual/';
  const youtubeUrl = import.meta.env.VITE_YOUTUBE_URL || 'https://www.youtube.com/@eadlightvisuals1670';
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'eadlightvisual@gmail.com';

  return (
    <motion.header 
      className="flex items-center justify-between h-16 px-4 md:px-40"
      initial={{y:-100, opacity:0}}
      animate={{y:0, opacity:1}}
      transition={{
        type: "spring",
        duration: 0.2,
        delay:0.5,
        stiffness:130
      }}
    >
      {/* ロゴ */}
      <span className="font-bold text-1xl md:text-3xl font-playfair"> <a href="/">EadLights</a></span>
      
      {/* SNSアイコン */}
      <motion.div 
        className="flex gap-3 md:gap-16 pointer-events-auto"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
        }}
      >
        <motion.a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          whileHover={{ 
            scale: 1.8,
            color: "rgb(249, 115, 22)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Instagram className="w-6 h-6 md:w-8 md:h-8" />
        </motion.a>
        <motion.a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          whileHover={{ 
            scale: 1.8,
            color: "rgb(249, 115, 22)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Youtube className="w-6 h-6 md:w-8 md:h-8" />
        </motion.a>
        <motion.a
          href={`mailto:${contactEmail}`}
          className="text-white"
          whileHover={{ 
            scale: 1.8,
            color: "rgb(249, 115, 22)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail className="w-6 h-6 md:w-8 md:h-8" />
        </motion.a>
      </motion.div>
      
      {/* ナビゲーション */}
      <nav className="pointer-events-auto">
        <ul className="flex items-center gap-4 md:gap-10 md:text-2xl font-playfair">
          <motion.li
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/">Home</a>
          </motion.li>
          <motion.li
            whileHover={{ 
              scale: 1.1,
              color: "rgb(249, 115, 22)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/works">Works</a>
          </motion.li>
        </ul>
      </nav>
    </motion.header>
  );
};

export default Header;