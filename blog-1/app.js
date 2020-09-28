const querystring = require('querystring');
const handleBlogServer = require('./src/router/blog');
const handleUserServer = require('./src/router/user');
const { access } = require('./src/utils/log');
const { set, get } = require('./src/db/redis');
const getCookieExpires = () => {
	const now = new Date();
	now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
	console.log('shijian', now.toGMTString());
	return now.toGMTString();
};
// const SESSION_DATA = {}
//用于处理postData
const getPostData = (req) => {
	const promise = new Promise((resolve, reject) => {
		if (req.method !== 'POST') {
			resolve({});
			return;
		}
		if (req.headers['content-type'] !== 'application/json') {
			resolve({});
			return;
		}
		let postData = '';
		req.on('data', (chunk) => {
			postData += chunk.toString();
		});
		req.on('end', () => {
			// console.log('zheli',postData)
			if (!postData) {
				resolve({});
				return;
			}
			resolve(JSON.parse(postData));
		});
	});
	return promise;
};
const serverHandle = (req, res) => {
	//记录accessaccesslog
	access(`${req.method} -- ${req.url}  --  ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);
	//设置返回格式
	res.setHeader('Content-type', 'application/json');
	const url = req.url;
	req.path = url.split('?')[0];
	// console.log('req',req,'res',res)
	// console.log('eeeee',url.split('?'))
	//解析query
	req.query = querystring.parse(url.split('?')[1]);

	//解释cookie
	req.cookie = {};
	const cookieStr = req.headers.cookie || '';

	cookieStr.split(';').forEach((item) => {
		if (!item) {
			return;
		}
		const valueArr = item.split('=');
		const key = valueArr[0].trim();
		const value = valueArr[1].trim();
		req.cookie[key] = value;
	});

	console.log('这是服务器获取到的cookie', req.cookie);

	// let needSetCookie = false
	// let userId = req.cookie.userid;
	// if (userId) {
	//     if (!SESSION_DATA[userId]) {
	//         SESSION_DATA[userId] = {}
	//     }
	// } else {
	//     needSetCookie = true
	//     userId = `${Date.now()}_${Math.random()}`
	//     SESSION_DATA[userId] = {}
	// }
	// req.session = SESSION_DATA[userId]
	//解释session 使用redis
	let needSetCookie = false;
	let userId = req.cookie.userid;
	if (!userId) {
		needSetCookie = true;
		userId = `${Date.now()}_${Math.random()}`;
		//初始化id
		set(userId, {});
	}
	//获取sessionid
	req.sessionId = userId;
	get(req.sessionId)
		.then((sessionData) => {
			if (sessionData == null) {
				set(req.sessionId, {});
				req.session = {};
			} else {
				req.session = sessionData;
			}
			console.log('看看reqsesion', req.session);
			//处理postData对象
			return getPostData(req);
		})
		.then((postData) => {
			// console.log('====',postData)
			req.body = postData;
			// const blogData = handleBlogServer(req, res)
			// if (blogData) {
			//     res.end(JSON.stringify(blogData))
			//     return
			// }
			const blogDate = handleBlogServer(req, res);
			if (blogDate) {
				blogDate.then((result) => {
					if (needSetCookie) {
						//操作cookie
						res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`);
					}
					res.end(JSON.stringify(result));
				});
				return;
			}
			//处理user路由
			const userData = handleUserServer(req, res);
			if (userData) {
				userData.then((result) => {
					if (needSetCookie) {
						//操作cookie
						res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`);
					}
					res.end(JSON.stringify(result));
				});
				return;
			}
			//
			//未命中路由，返回404
			res.writeHead(404, { 'Content-type': 'text/plain' });
			res.write('404 not found weiyuan\n');
			res.end();
		});
	//处理blog路由
};

module.exports = serverHandle;
// env:process.env.NODE_ENV
