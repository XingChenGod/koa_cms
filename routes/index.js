const router = require('koa-router')();

router.get('/', async ctx => {
   await ctx.render('default/index');
});

module.exports = router.routes();
