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

// 增加用户
router.post('/doAdd', async ctx => {
    const {username, password, confirmPassword} = ctx.request.body;
    if (password !== confirmPassword) {
        // 两次密码不一样
        await ctx.render('admin/error', {
            message: '两次输入密码不一样',
            redirect: `${ctx.state.__HOST__}/admin/manager/add`
        });
        return;
    }
    // 查数据库中有没有同样用户名
    const res = await DB.find('admin', {username: username});
    if (res.length > 0) {
        await ctx.render('admin/error', {
            message: '用户名已存在',
            redirect: `${ctx.state.__HOST__}/admin/manager/add`
        });
    } else {
        // 新增
        const addUser = await DB.insert('admin', {
            username: username,
            password: password,
            last_time: new Date(),
            status: 1
        });
        if (addUser.result.ok === 1) {
            await ctx.redirect(`${ctx.state.__HOST__}/admin/manager`);
        } else {
            await ctx.render('admin/error', {
                message: '添加用户失败',
                redirect: `${ctx.state.__HOST__}/admin/manager/add`
            })
        }
    }
})


router.get('/edit',async ctx => {
    await ctx.render('admin/manager/edit');
})

router.get('/delete',async ctx => {
    ctx.body='编辑用户';
})

module.exports=router.routes();
