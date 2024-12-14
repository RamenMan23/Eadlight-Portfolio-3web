//WorksPage.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import { WorkItem } from '../data/works'
import works from '../data/works'


interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: WorkItem;
}

const VideoModal = ({ isOpen, onClose, work }: VideoModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  if (work.type === 'image' && work.images) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative max-w-7xl w-full" onClick={e => e.stopPropagation()}>
          <img
            src={work.images[currentImageIndex]}
            alt={work.title}
            className="w-full h-full object-contain"
          />
          {work.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : work.images!.length - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => (prev < work.images!.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-xl p-2"
          >
            ✕
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-7xl ${work.type === 'youtube-vertical' ? 'max-h-[80vh] aspect-[412/732]' : 'aspect-video'}`}
        onClick={e => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${work.youtubeId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-[-40px] right-0 text-white text-xl p-2"> ✕
        </button>
      </div>
    </motion.div>
  );
};

const WorksPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${e.currentTarget.src}`);
  };
  
  const tabs = [
    { id: 'all', label: 'すべて' },
    { id: 'animation', label: 'アニメーション' },
    { id: 'product', label: 'プロダクト' },
    { id: 'architecture', label: 'アーキテクチャ' },
    { id: 'development', label: '開発' }
  ]

  const filteredWorks = activeTab === 'all' 
    ? works 
    : works.filter(work => work.categories.includes(activeTab))

  return (
    <>
   <div className="fixed top-0 left-0 w-full z-10 px-2 text-white">
  <Header /> 
</div>

      <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-16 md:pt-20" // 上部のスペースを増やして、ヘッダーとフッターの下に content を表示
      >
          <div className="flex justify-center mb-8 px-2">
            <div className="w-full max-w-xl overflow-x-auto scrollbar-hide">
              <div className="flex flex-nowrap space-x-2 md:space-x-4 p-2 bg-gray-900 rounded-lg min-w-min">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap px-3 py-2 rounded-md transition-all text-sm md:text-base
                      ${activeTab === tab.id
                        ? 'bg-orange-500 text-white font-medium'
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
      >
      {filteredWorks.map(work => (
        <motion.div
          key={work.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            relative group cursor-pointer
            ${work.type === 'youtube-vertical' ? 'row-span-2' : 'row-span-1'}
          `}
          onClick={() => setSelectedWork(work)}
        >
        <div className={`
        relative overflow-hidden rounded-lg h-full
        ${work.type === 'youtube-vertical' 
          ? 'max-w-[412px] mx-auto' 
          : 'w-full aspect-video'
        }
      `}>
  {work.type === 'image' && work.images ? (
    <img
      src={work.images[0]}
      alt={work.title}
      onError={handleImageError}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <img
      src={`https://img.youtube.com/vi/${work.youtubeId}/maxresdefault.jpg`}
      alt={work.title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  )}
  {/* タイトルを常時表示 */}
  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
    <p className="text-white text-sm md:text-base font-medium text-center">{work.title}</p>
  </div>
  {/* ホバー時のプレイボタン */}
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
  </div>
</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
      </div>

      <AnimatePresence>
        {selectedWork && (
          <VideoModal
            isOpen={true}
            onClose={() => setSelectedWork(null)}
            work={selectedWork}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default WorksPage