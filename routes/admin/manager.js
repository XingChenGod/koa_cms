/*用户的增加修改删除*/

const router = require('koa-router')();

const DB = require('../../module/DB/db');

router.get('/',async ctx => {
    const res = await DB.find('admin');
    await ctx.render('admin/manager/list', {
        list: res
    });
})

router.get('/add',async ctx => {
    await ctx.render('admin/manager/add');
})


router.get('/edit',async ctx => {
    await ctx.render('admin/manager/edit');
})

router.get('/delete',async ctx => {
    ctx.body='编辑用户';
})

module.exports=router.routes();
