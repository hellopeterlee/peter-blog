/*
 * @Author: peirenlei peirenlei@163.com
 * @Date: 2025-05-09 14:26:42
 * @LastEditors: peirenlei peirenlei@163.com
 * @LastEditTime: 2025-05-13 22:20:16
 * @FilePath: /peter_blog/data/social.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
export type Social = {
    github?: string
    x?: string
    juejin?: string
    qq?: string
    wx?: string
    cloudmusic?: string
    zhihu?: string
    email?: string
    discord?: string
}

type SocialValue = {
    href?: string
    title: string
    icon: string
    color: string
}

const social: Social = {
    github: 'https://github.com/hellopeterlee',
    // x: 'https://twitter.com/kuizuo',
    // juejin: 'https://juejin.cn/user/1565318510545901',
    wx: '/img/wechat.jpg',
    // qq: 'https://img.kuizuo.me/qq.png',
    // zhihu: 'https://www.zhihu.com/people/kuizuo',
    // cloudmusic: 'https://music.163.com/#/user/home?id=1333010742',
    email: 'mailto:peirenlei@163.com',
    // discord: 'https://discord.gg/M8cVcjDxkz',
}

const socialSet: Record<keyof Social | 'rss', SocialValue> = {
    github: {
        href: social.github,
        title: 'GitHub',
        icon: 'ri:github-line',
        color: '#010409',
    },
    juejin: {
        href: social.juejin,
        title: '掘金',
        icon: 'simple-icons:juejin',
        color: '#1E81FF',
    },
    x: {
        href: social.x,
        title: 'X',
        icon: 'ri:twitter-x-line',
        color: '#000',
    },
    wx: {
        href: social.wx,
        title: '微信',
        icon: 'ri:wechat-2-line',
        color: '#07c160',
    },
    zhihu: {
        href: social.zhihu,
        title: '知乎',
        icon: 'ri:zhihu-line',
        color: '#1772F6',
    },
    discord: {
        href: social.discord,
        title: 'Discord',
        icon: 'ri:discord-line',
        color: '#5A65F6',
    },
    qq: {
        href: social.qq,
        title: 'QQ',
        icon: 'ri:qq-line',
        color: '#1296db',
    },
    email: {
        href: social.email,
        title: '邮箱',
        icon: 'ri:mail-line',
        color: '#D44638',
    },
    cloudmusic: {
        href: social.cloudmusic,
        title: '网易云',
        icon: 'ri:netease-cloud-music-line',
        color: '#C20C0C',
    },
    rss: {
        href: '/blog/rss.xml',
        title: 'RSS',
        icon: 'ri:rss-line',
        color: '#FFA501',
    },
}

export default socialSet
