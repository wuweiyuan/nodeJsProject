const { request } = require('../app');

const router = require('koa-router')();
const {login} = require('../controller/user')
const {SuccessModel,ErrorMpdel}  = require('../model/resModel')
router.prefix('/api/user');

router.post('/login', async function(ctx, next) {
	const { username, password } = ctx.request.body;

	const result = await login(username, password);
	if (result.username) {
		ctx.session.username = result.username;
		ctx.session.realname = result.realname;

		// console.log('看看session',req.session)
		ctx.body = new SuccessModel()
		return;
	}
	ctx.body=new ErrorMpdel('登陆失败');
});

router.get('/session-test', (ctx, next) => {
	if (ctx.session.wwy == null) {
		ctx.session.wwy = 0;
	}
	ctx.session.wwy++;
	ctx.body = {
		error: 0,
		wwy: ctx.session.wwy
	};
});

router.get('/bar', function(ctx, next) {
	ctx.body = 'this is a users/bar response';
});

module.exports = router;
