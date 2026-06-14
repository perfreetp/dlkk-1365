export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/explore/index',
    'pages/routes/index',
    'pages/favorites/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/route-detail/index',
    'pages/checkin/index',
    'pages/search/index',
    'pages/feedback/index',
    'pages/create-route/index',
    'pages/checkin-list/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF7A45',
    navigationBarTitleText: '城市散步宝藏',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F5'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF7A45',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/explore/index',
        text: '探索'
      },
      {
        pagePath: 'pages/routes/index',
        text: '路线'
      },
      {
        pagePath: 'pages/favorites/index',
        text: '收藏'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
