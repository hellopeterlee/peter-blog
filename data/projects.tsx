export const projects: Project[] = [
  {
    title: '优尾惠微信朋友圈商城',
    description: '🦖 基于微信 iPad 协议深度开发的朋友圈智能数据聚合与电商化解决方案，实现微商内容自动化采集、结构化处理与多端同步分发',
    preview: '/img/project/pyqmall-01.png',
    website: '/blog/pyq-mall',
    source: '/blog/pyq-mall',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: '腾旅e卡通旅游年卡',
    description: '由武汉旅游发展投资集团有限公司和腾讯公司共同出资，省市旅游委（局）大力支持，湖北腾旅科技有限责任公司研发运营的一张手机里的旅游年卡，为全国首张“刷脸”入园的旅游年卡',
    preview: '/img/project/tennv.png',
    website: 'https://www.51ekt.com/',
    source: '/blog/tennv-ekt',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: '广西健康素养测评系统',
    description: '广西健康素养测评系统是为响应国家"健康中国2030"战略规划，落实广西壮族自治区卫生健康委员会关于提升居民健康素养水平的工作要求而开发的综合性测评平台。该系统旨在科学评估广西居民健康素养水平，为卫生健康政策制定提供数据支持，同时帮助居民了解自身健康知识掌握情况。',
    preview: '/img/project/guangxi-health-system-b-04.jpg',
    website: '/blog/guangxi-health-system',
    source: '/blog/guangxi-health-system',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: '攀西人才网',
    description: '攀西人才网 是专注于四川攀枝花市及凉山彝族自治州（攀西地区）的本地化招聘平台，旨在为企业和求职者提供高效、精准的人才对接服务。结合区域经济特点，平台聚焦能源、矿业、旅游、农业等特色产业，助力攀西地区人才流动与经济发展。',
    preview: '/img/project/pxrc-01.png',
    website: 'https://www.pxrc.com.cn/',
    source: '#商业源码保密',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: '喜德人才网',
    description: '喜德人才网 是一个专注于人才招聘与职业发展的在线服务平台，旨在为企业提供高效的人才招聘解决方案，同时帮助求职者快速匹配合适的工作机会。平台结合人工智能和大数据技术，优化招聘流程，提高人岗匹配效率，打造智能化、便捷化的求职招聘生态',
    preview: '/img/project/xiderc-01.png',
    website: 'https://xide.lsqiuzhi.com',
    source: '#商业源码保密',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: 'OliveOffice橄榄办公套件',
    description: '📦 oliveoffice是橄榄科技一款非常不错的移动办公软件有IPONE和android版,最大的特点就是简洁强的,设计初衷充分考虑手机的局限性,力求做到最好的用户体验,支持查看和编辑doc、docpx、xls、xlsx、ppt、pptx、pdf、txt、chm等文件,支持googleDOC、DropBOX。完全免费的移动办公软件!',
    preview: '/img/project/olive-office-01.png',
    website: '/blog/olive-office-suite',
    source: '/blog/olive-office-suite',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: '移动网路巡线',
    description: '📦 湖北省移动公司为了提供行业车辆及人员位置信息服务，加强对线路巡检人员的管理，建设定位 E 路通位置服务系统，并且为各类 SP/CP 发展基于位置信息的各类增值业务提供基础平台。针对网络巡线服务提供商的“网络巡线管理系统”,并实现对网络巡线工作的人员和车辆进行定位和管理等',
    preview: '/img/project/hubei-net-inspecting.bmp',
    website: '/blog/hubei-net-inspecting',
    source: '/blog/hubei-net-inspecting',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
  {
    title: '湖北E路通(北京灵图)',
    description: '📦 湖北省移动公司专门针对车辆的“车务通子系统”,实现对车辆位置进行定位和管理; 实时监控车辆运行信息，实时显示所在位置，并回话历史轨迹; 车辆定位功能，隐私管理，二次鉴权',
    preview: '/img/project/hubei-eroad.png',
    website: '/blog/hubei-eroad',
    source: '/blog/hubei-eroad',
    tags: ['product', 'large', 'favorite'],
    type: 'commerce',
  },
]

export type Tag = {
  label: string
  description: string
  color: string
}

export type TagType = 'favorite' | 'opensource' | 'product' | 'large' | 'personal'

export type ProjectType = 'web' | 'app' | 'commerce' | 'personal' | 'toy' | 'other'

export const projectTypeMap = {
  web: '🖥️ 网站',
  app: '💫 应用',
  commerce: '商业项目',
  personal: '👨‍💻 个人',
  toy: '🔫 玩具',
  other: '🗃️ 其他',
}

export type Project = {
  title: string
  description: string
  preview?: string
  website: string
  source?: string | null
  tags: TagType[]
  type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '我最喜欢的网站，一定要去看看!',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目可以提供灵感!',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  large: {
    label: '大型',
    description: '大型项目，原多于平均数的页面',
    color: '#8c2f00',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce(
  (group, project) => {
    const { type } = project
    group[type] = group[type] ?? []
    group[type].push(project)
    return group
  },
  {} as Record<ProjectType, Project[]>,
)
