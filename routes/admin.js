var router=require('koa-router')();

const user = require('./admin/user'),
      focus = require('./admin/focus'),
      newsCate = require('./admin/newscate');

//配置admin的子路由  层级路由
router.get('/', async ctx => {
    ctx.body='后台管理系统首页';
})

// 用户模块
router.use('/user', user);

// 轮播图模块
router.use('/focus', focus);

// 新闻模块
router.use('/newscate', newsCate);

module.exports = router.routes();
