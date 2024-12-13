import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useState, useRef } from 'react'; // useRefを追加


const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null); // フォームの参照を作成
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const { scrollYProgress } = useScroll();
  
// ContactForm.tsx内のスクロール制御部分
const opacity = useTransform(
    scrollYProgress,
    [ 0.9, 0.95, 1], // スクロール位置の調整
    [0,  1, 1]           // 透明度の変化
  );

    // フォームの有効/無効状態を制御
    const pointerEvents = useTransform(
        scrollYProgress,
        (value) => value >= 0.9 ? 'auto' : 'none'
      );
  


    // z-indexを動的に制御
    const zIndex = useTransform(
        scrollYProgress,
        (value) => value >= 0.9 ? 40 : -15 // 0.9以上でz-index: 30、それ以外は-1
      );
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus('idle');
      
      try {
        const result = await emailjs.sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          e.currentTarget,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
  
        if (result.status === 200) {
          setSubmitStatus('success');
          formRef.current?.reset(); // リファレンスを使ってフォームをリセット
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };


  return (
<motion.div 
  style={{ 
    opacity,
    pointerEvents,
    zIndex,
  }}
  // max-w-4xlをmax-w-lgに変更し、px-4をpx-6に増やして余白を確保
  className="w-full h-screen md:max-w-6xl max-w-lg mx-auto px-6 flex items-center bg-black"
>
  {/* py-6をpy-8に、mb-10をmb-8に調整 */}
  <div className="w-full py-8 mb-8">
    {/* テキストサイズを調整 */}
    <h2 className="text-3xl md:text-6xl font-bold mb-6 text-white tracking-wider text-center font-playfair">CONTACT</h2>
    
    {/* ソーシャルリンクの余白調整 */}
    <motion.div 
      className="flex justify-center gap-4  flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-zinc-900 text-white hover:bg-zinc-800 
                     transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-5 h-5" />
            <span className="text-sm">Instagram</span>
          </motion.a>

          <motion.a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-zinc-900 text-white hover:bg-zinc-800
                     transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" />
            <span className="text-sm">Email</span>
          </motion.a>
        </motion.div>

        <form 
      ref={formRef}
      onSubmit={handleSubmit}
      // space-y-5をspace-y-6に変更してフィールド間の余白を増やす
      className="space-y-1 md:space-y-9 mb-2"
    >
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium mb-2 text-zinc-400"
            >
              NAME
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800
                       text-white placeholder-zinc-500
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                       transition-all duration-200"
              placeholder="Your name"
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2 text-zinc-400"
            >
              EMAIL
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800
                       text-white placeholder-zinc-500
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                       transition-all duration-200"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium mb-2 text-zinc-400"
            >
              TITLE
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id="title"
              name="title"
              required
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800
                       text-white placeholder-zinc-500
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                       transition-all duration-200"
              placeholder="Message title"
            />
          </div>

          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium mb-2 text-zinc-400"
            >
              MESSAGE
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              id="message"
              name="message"
              required
              rows={3}
              className="w-full p-3 md:p-3 rounded-lg bg-zinc-900 border border-zinc-800
                       text-white placeholder-zinc-500
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                       transition-all duration-200"
              placeholder="Write your message here..."
            />
          </div>

          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? 'bg-orange-400' : 'bg-orange-500'
            } text-white py-2 px-6 rounded-lg
            hover:bg-orange-600 transition-colors duration-200 
            font-medium tracking-wide ${
              isSubmitting ? 'cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
          </motion.button>

          {submitStatus === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-500 text-center mt-2 mb-2"
            >
              メッセージを送信しました!!
            </motion.p>
          )}
          {submitStatus === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center mt-2 mb-2"
            >
              メールの送信に失敗しました。再度お試しください。
            </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;