const router = require('koa-router')();

const login = require('./admin/login'),
      user = require('./admin/user'),
      focus = require('./admin/focus'),
      newsCate = require('./admin/newscate');

// 配置中间件设置静态资源正确路径
router.use(async (ctx, next) => {
    // console.log(ctx.request.header.host);
    // 模板引擎配置全局变量
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    console.log(ctx.url);
    // 检测是否登录
    if (ctx.session.userinfo) {
        // 已经登录
        await next();
    } else {
        // 未登录跳转登录页面
        if (ctx.url === '/admin/login' || ctx.url === '/admin/login/code') {
            await next();
        } else {
            await ctx.redirect('/admin/login');
        }
    }
});

//配置admin的子路由  层级路由
router.get('/', async ctx => {
    // await ctx.redirect('/admin/login');
    await ctx.render('admin/index');
});

// 登录模块
router.use('/login', login);

// 用户模块
router.use('/user', user);

// 轮播图模块
router.use('/focus', focus);

// 新闻模块
router.use('/newscate', newsCate);

module.exports = router.routes();
