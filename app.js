// 基础
const Koa = require('koa'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      path = require('path'),
      static = require('koa-static'),
      session = require('koa-session'),
      bodyParse = require('koa-bodyparser'),
      sillTime = require('silly-datetime'),
      jsonp = require('koa-jsonp');

// 实例
const app = new Koa();

// 引入路由
const index = require('./routes/index'),
      admin = require('./routes/admin'),
      api = require('./routes/api');

// 配置post
app.use(bodyParse());

// 配置jsonp
app.use(jsonp());

// 配置session
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 1000 * 60 * 30,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep manager logged in. (default is false)*/
};

app.use(session(CONFIG, app));

// 配置koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = function(date) {  // 管道只能使用函数表达式的形式
        return sillTime.format(new Date(date), 'YYYY-MM-DD hh:mm:ss');
    }
});

// 配置静态资源
app.use(static(__dirname + '/public'));

// 后台管理
router.use('/admin', admin);

// 接口
router.use('/api', api);

// 配置路由
router.use(index);


app.use(router.routes())
    .use(router.allowedMethods());

// 监听端口
app.listen(3001, () => {
    console.log('服务已启动');
});
