// admin中ajax的api接口

const router = require('koa-router')(),
      DB = require('../../module/DB/db');

//配置admin的子路由  层级路由
router.get('/', async ctx => {
    // await ctx.redirect('/admin/login');

    await ctx.render('admin/index');
});

router.get('/changeStatus', async ctx => {
    const {collectionName, attr, id} = ctx.query;
    try {
        // 先查
        const res = await DB.find(collectionName, {_id: DB.getObjectId(id)});
        let json = {};
        if (res.length > 0) {
            // 查到了
            if (res[0][attr] === 1) {
                json = {
                    [attr]: 0
                };
            } else {
                json = {
                    [attr]: 1
                };
            }
        }
        await DB.update(collectionName, {_id: DB.getObjectId(id)}, json);
        ctx.body = {
            message: '修改状态成功！',
            code: 1
        };
    } catch (e) {
        if (e.result.ok * 1 === 1) {
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
    }
})


module.exports = router.routes();
