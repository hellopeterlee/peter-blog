export const Friends: Friend[] = [
  {
    title: 'Peter的小站',
    description: 'Peter的博客',
    website: 'https://zxuqian.cn',
    avatar: '/img/logo_icon.jpg',
  },
  {
    title: '峰华前端工程师',
    description: '致力于帮助你以最直观、最快速的方式学会前端开发',
    website: 'https://zxuqian.cn',
    avatar: '/img/friend/zxuqian.png',
  },
  {
    title: 'Pincman',
    description: '中年老码农,专注于全栈开发与教学',
    website: 'https://pincman.com',
    avatar: '/img/friend/pincman.png',
  },
  {
    title: '纯洁的微笑',
    description: '分享技术，品味人生',
    website: 'http://www.ityouknow.com',
    avatar: '/img/friend/pincman.png',
  },
  {
    title: '程序猿DD',
    description: '程序员、阿里云MVP、腾讯云TVP',
    website: 'https://www.didispace.com/',
    avatar: '/img/friend/didispace.png',
  },
  {
    title: '廖雪峰',
    description: '大神廖雪峰',
    website: 'https://liaoxuefeng.com',
    avatar: 'https://liaoxuefeng.com/static/logo.svg',
  },
  {
    title: 'pixabay',
    description: '精彩的免版税图片和免版税库存',
    website: 'https://pixabay.com/zh/',
    avatar: 'https://pixabay.com/favicon-32x32.png',
  },
  {
    title: 'fakeimg',
    description: 'Fake images please?',
    website: 'https://fakeimg.pl/',
    avatar: 'https://fakeimg.pl/favicon.ico',
  },
  {
    title: 'pexels',
    description: '才华横溢的摄影作者在这里免费分享最精彩的素材图片和视频。',
    website: 'https://www.pexels.com/zh-cn/',
    avatar: 'https://www.pexels.com/assets/static/images/meta/favicon.ico',
  },

  {
    title: 'unsplash',
    description: 'The internet’s source for visuals.Powered by creators everywhere.',
    website: 'https://unsplash.com/',
    avatar: 'https://unsplash.com/favicon.ico',
  },
  {
    title: 'wallhaven',
    description: 'The best wallpapers on the Net!',
    website: 'https://wallhaven.cc/',
    avatar: 'https://wallhaven.cc/favicon.ico',
  },
  {
    title: 'heroicons',
    description: 'Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.',
    website: 'https://heroicons.com/',
    avatar: 'https://heroicons.com/favicon.ico',
  },
]

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: string
}
