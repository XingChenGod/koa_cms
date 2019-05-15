const router = require('koa-router')();

const tools = require('../../module/tools'),
      DB = require('../../module/DB/db');

// 验证码模块
const svgCaptcha = require('svg-captcha');

router.get('/', async ctx => {
   await ctx.render('admin/login');
});

// 点击登录
router.post('/doLogin', async ctx => {
   const userinfo = ctx.request.body;
   // 如果数据库中密码MD5加密
   // const ps = tools.md5(userinfo.password);
   if (userinfo.code.toLowerCase() !== ctx.session.code.toLowerCase()) {
      await ctx.render('admin/error', {
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
         console.log(res);
         await ctx.redirect(ctx.state.__HOST__ + '/admin');
         // 更新登录日期
         await DB.update('admin', {"_id": DB.getObjectId(res[0]._id)}, {
            last_time: new Date()
         });
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

// 退出登录
router.get('/loginOut', async ctx => {
   ctx.session.userinfo = null;
   // 该方法体验不好，会出现暂时性空白
   // await ctx.redirect(ctx.state.__HOST__ + 'admin/login');
   await ctx.render('admin/login');
});

module.exports = router.routes();
