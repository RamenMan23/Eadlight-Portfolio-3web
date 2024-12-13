// components/Footer.tsx

import { motion } from 'framer-motion';
import { Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
    const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
    const youtubeUrl = import.meta.env.VITE_YOUTUBE_URL;

  return (
    <motion.footer 
      className="w-full py-6 px-1 md:px-40 z-0" // fixed bottom の設定を削除
      initial={{ y: -100, opacity: 0 }} // アニメーションの方向を上から下に変更
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        duration: 1,
        delay: 0.8,
        stiffness: 130
      }}
    >
      <div className="flex justify-center gap-3 md:gap-8">
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
        {/* Email Link */}
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
      </div>
    </motion.footer>
  );
};

export default Footer;