const router = require('koa-router')();

router.get('/', async ctx => {
    ctx.body = {'title': 'api'};
})

router.get('/newslist', async ctx => {

    ctx.body={"title":"这是一个新闻接口"};
})

router.get('/focus', async ctx => {

    ctx.body={"title":"这是一个轮播图的api"};
})

module.exports = router.routes();
