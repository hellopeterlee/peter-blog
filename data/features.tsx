import Translate, { translate } from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import OpenSourceSvg from '@site/static/svg/undraw_open_source.svg'
import SpiderSvg from '@site/static/svg/undraw_spider.svg'
import WebDeveloperSvg from '@site/static/svg/undraw_web_developer.svg'

export type FeatureItem = {
  title: string | React.ReactNode
  description: string | React.ReactNode
  header: React.ReactNode
  icon?: React.ReactNode
}

const FEATURES: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.feature.developer',
      message: 'TypeScript 全栈工程师',
    }),
    description: (
      <Translate>
        作为一名 TypeScript 全栈工程师，秉着能用 TS 绝不用 JS 的原则，为项目提供类型安全的保障，提高代码质量和开发效率。
      </Translate>
    ),
    header: <WebDeveloperSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="logos:typescript-icon" className="size-4 text-neutral-500" />,
  },
  {
    title: translate({
      id: 'homepage.feature.code',
      message: '熟练掌握市面流行的多种语言',
    }),
    description: (
      <Translate>
        PHP,JAVA,Node,Golang,Python,这些都都有丰富的实际项目经验，也能够继续现有项目进行深度二次开发。
        微信小程序，公众号也有丰富的实际项目经验
      </Translate>
    ),
    header: <SpiderSvg className="h-auto w-full" height={150} role="img" />,
  },
  {
    title: translate({
      id: 'homepage.feature.app',
      message: '移动应用开发',
    }),
    description: (
      <Translate>
        能开发原生andoird应用,或者基于UniApp,ReactNative,Flutter开发各种跨平台应用。擅长解决各种疑难杂症
      </Translate>
    ),
    header: <OpenSourceSvg className="h-auto w-full" height={150} role="img" />,
  },
]

export default FEATURES
