export interface WorkItem {
    id: string;
    title: string;
    type: 'youtube-landscape' | 'youtube-vertical' | 'image';
    youtubeId?: string;
    images?: string[];
    categories: string[];
    aspectRatio: string;
    thumbnailUrl: string;  // サムネイル用URL追加
}
  

const works: WorkItem[] = [
    {
      id: '1',
      title: "Architectural Visualization  - Resort Hotel Project",
      type: "youtube-landscape",
      youtubeId: "Mv86uOHJDZg",
      categories: ["architecture", "animation"],
      aspectRatio: "16/9",
      thumbnailUrl: "/Images/ArchiViz1.jpg"
    },
    {
        id: '2',
        title: "Tasaki seoul 2024  VFX",
        type: "youtube-vertical",
        youtubeId: "1sFnbILoGPw",
        categories: ["product", "animation"],
        aspectRatio: "412/732",
        thumbnailUrl: "/Images/Tasaki_seoul_2024.jpg"  // 修正: 小文字の "seoul"
      },
      {
        id: '3',
        title: "3D Configurator",
        type: "youtube-landscape",
        youtubeId: "hIm_4968hMc",
        categories: ["development", "product"],
        aspectRatio: "16/9",
        thumbnailUrl: "/Images/3DConfig_suitecase.jpg"  // 修正: 正確なファイル名に
      },
      {
        id: '4',
        title: "SINN PURETE 2024 VFX",
        type: "youtube-vertical",
        youtubeId: "JnVk3jjSINA",
        categories: ["product", "animation"],
        aspectRatio: "412/732",
        thumbnailUrl: "/Images/Siin_VFX_2024.jpg"  // 修正: "Siin" に変更
      },
      {
        id: '5',
        title: "Tasaki Taipei 2024  VFX",
        type: "youtube-vertical",
        youtubeId: "FtBNcAmG9tc",
        categories: ["product", "animation"],
        aspectRatio: "412/732",
        thumbnailUrl: "/Images/Tasaki_Taipei_2024.jpg"  // 正しい
      },
      {
        id: '6',
        title: "Architectural Visualization - room",
        type: "youtube-vertical",
        youtubeId: "P7MTOCvQv6s",
        categories: ["architecture", "animation"],
        aspectRatio: "412/732",
        thumbnailUrl: "/Images/ArchiViz3.jpg"  // 修正: 実際のファイル名に
      },
      {
        id: '7',
        title: "SINN PURETE 2023 Full3DCG",
        type: "youtube-landscape",
        youtubeId: "Z7uyUtsDFj0",
        categories: ["product", "animation"],
        aspectRatio: "16/9",
        thumbnailUrl: "/Images/Siin_Space_2023.jpg"  // 正しい
      },
      {
        id: '8',
        title: "TASAKI paris 2024 VFX",
        type: "youtube-vertical",
        youtubeId: "0KLtVm9yl6Y",
        categories: ["product", "animation"],
        aspectRatio: "412/732",
        thumbnailUrl: "/Images/Tasaki_Paris_2024.jpg"  // 正しい
      },
      {
        id: '9',
        title: "SNIDEL HOME 2024 Full3DCG ",
        type: "youtube-landscape",
        youtubeId: "9vjct4e24fQ",
        categories: ["product", "animation"],
        aspectRatio: "16/9",
        thumbnailUrl: "/Images/SnidelHome_2024.jpg"  // 正しい
      },
      {
        id: '10',
        title: "Ikejiri Architectural Visualization",
        type: "image",
        images: [
          "/Images/ikejiri_archiviz_1.jpeg",
          "/Images/ikejiri_archiviz_2.jpeg"
        ],
        categories: ["architecture"],
        aspectRatio: "16/9",
        thumbnailUrl: "/Images/ikejiri_archiviz_1.jpeg"  // 正しい
      },
      {
        id: '11',
        title: "Tasaki london 2024 VFX",
        type: "youtube-vertical",
        youtubeId: "xABxAE1HOAU",
        categories: ["product", "animation"],
        aspectRatio: "412/732",
        thumbnailUrl: "/Images/Tasaki_london_2024.jpg"  // 正しい
      }
    ]

export default works
