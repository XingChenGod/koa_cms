const router = require('koa-router')();

const tools = require('../../module/tools'),
      DB = require('../../module/DB/db');

// 验证码模块
const svgCaptcha = require('svg-captcha');

router.get('/', async ctx => {
   await ctx.render('admin/login');
});

router.post('/', async ctx => {
   const userinfo = ctx.request.body;
   // 如果数据库中密码MD5加密
   // const ps = tools.md5(userinfo.password);
   if (userinfo.code.toLowerCase() !== ctx.session.code.toLowerCase()) {
      console.log('验证码错误');
      ctx.render('admin/error', {
         message: '验证码错误！',
         redirect: ctx.state.__HOST__ + '/admin/login'
      });
      return;
   }
   try {
      const res = await DB.find('admin', {username: userinfo.username, password: userinfo.password});
      if (res.length > 0) {
         // 登录成功
         ctx.session.userinfo = res[0];
         await ctx.redirect('/admin');
      } else {
         // 用户名或者密码错误
         // ctx.body = '用户名或密码错误';
         ctx.render('admin/error', {
            message: '用户名或密码错误',
            redirect: ctx.state.__HOST__ + '/admin/login'
         });
      }
   } catch (err) {
      console.log(err);
      ctx.render('admin/error', {
         message: err,
         redirect: ctx.state.__HOST__ + '/admin/login'
      });
   }
});

// 生成验证码
router.get('/code', async ctx => {
   const captcha = svgCaptcha.create({
      size: 4,
      fontSize:50,
      width: 110,
      height: 34,
   });
   ctx.session.code = captcha.text;
   console.log(captcha.text);
   // 设置响应头
   ctx.response.type = 'image/svg+xml';
   ctx.body = captcha.data;
});

module.exports = router.routes();
