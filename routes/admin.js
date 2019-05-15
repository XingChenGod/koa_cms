const router = require('koa-router')();

const index = require('./admin/index'),
      login = require('./admin/login'),
      manager = require('./admin/manager'),
      focus = require('./admin/focus'),
      newsCate = require('./admin/newscate'),
      // node url处理原生模块
      url = require('url');

// 配置中间件设置静态资源正确路径
router.use(async (ctx, next) => {
    // console.log(ctx.request.header.host);
    // 模板引擎配置全局变量
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    const pathName = url.parse(ctx.request.url).pathname.substr(1);
    console.log(pathName);
    const pathArr = pathName.split('/');
    // 设置全局用户名
    ctx.state.G = {
        userInfo: ctx.session.userinfo,
        pathArr: pathArr
    };
    // 检测是否登录
    if (ctx.session.userinfo) {
        // 已经登录
        await next();
    } else {
        // 未登录跳转登录页面
        if (pathName === 'admin/login' || pathName === 'admin/login/code' || pathName === 'admin/login/doLogin') {
            await next();
        } else {
            await ctx.redirect('/admin/login');
        }
    }
});

// api模块
router.use(index);

// 登录模块
router.use('/login', login);

// 管理用户模块
router.use('/manager', manager);

// 轮播图模块
router.use('/focus', focus);

// 新闻模块
router.use('/newscate', newsCate);

module.exports = router.routes();
