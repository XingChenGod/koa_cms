// admin中ajax的api接口

const router = require('koa-router')(),
      DB = require('../../module/DB/db');

//配置admin的子路由  层级路由
router.get('/', async ctx => {
    // await ctx.redirect('/admin/login');

    await ctx.render('admin/index');
});

router.get('/changeStatus', async ctx => {
    const {collectionName, status, id} = ctx.query;
    const res = await DB.update(collectionName, {_id: DB.getObjectId(id)}, {
        status: Number(!Boolean(status * 1))
    });
    if (res.result.ok * 1 === 1) {
        ctx.body = {
            message: '修改状态成功！',
            code: 1
        };
    } else {
        ctx.body = {
            message: '修改状态失败！',
            code: 0
        };
    }
})


module.exports = router.routes();
