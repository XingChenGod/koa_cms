// 基础
const Koa = require('koa'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      path = require('path');

// 实例
const app = new Koa();

// 引入路由
const index = require('./routes/index');

// 配置koa-art-template
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

// 配置路由
app.use(index);
// router.get('/', async ctx => {
//     await ctx.render('default/index')
// })

app.use(router.routes())
    .use(router.allowedMethods());

// 监听端口
app.listen(3001, () => {
    console.log('服务已启动');
});
