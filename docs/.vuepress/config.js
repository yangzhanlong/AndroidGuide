module.exports = {
  title: 'AndroidGuide',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/avatar.png' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  themeConfig: {
    logo: '/avatar.png',  // 左上角logo
    nav:[ // 导航栏配置
      {text: 'tigger', link: 'https://www.laohu8.com/personal/3444504177139447' },
      {text: '投资见解', link: 'https://www.yuque.com/nieyulin/ahod2h' },
      {text: '投资文章', link: 'https://www.yuque.com/invest/gi5ot6'},
      {text: '前端面试题', link: 'https://www.yuque.com/nieyulin/lunpyu'},
      {text: 'github', link: 'https://github.com/nieyulin112/'}
    ],
    sidebar: 'auto', // 侧边栏配置
  }
};