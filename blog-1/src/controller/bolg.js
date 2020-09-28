const { exec } = require('../db/mysql');
const xss = require('xss');
const getList = (author, keyword) => {
	let sql = `select * from blogs where 1=1 `;

	if (author) {
		sql += `and author='${author}' `;
	}
	if (keyword) {
		sql += `and title like '%${keyword}%'`;
	}

	sql += `order by createtime desc`;
	return exec(sql);
};

const getDetail = (id) => {
	let sql = `select * from blogs where id=${id}`;
	return exec(sql).then((data) => {
		return data[0];
	});
};

const newBlog = (data = {}) => {
	// console.log('打印插进来的数据',data)
	const { content, author } = data;
	const title = xss(data.title);
	// title = xss(title)
	const createtime = Date.now();
	console.log('新的博客,data', data);
	let sql = `insert blogs (title,content,createtime,author) values('${title}','${content}',${createtime},'${author}')`;
	return exec(sql).then((result) => {
		console.log('new', result);
		return {
			id: result.insertId
		};
	});
};

const updateBlog = (id, data = {}) => {
	console.log('更新数据', id, data);
	const { title, content } = data;
	let sql = `update blogs set title='${title}', content='${content}' where id=${id}`;
	return exec(sql).then((result) => {
		if (result.affectedRows > 0) {
			return true;
		}
		return false;
	});
};

const deleteBlog = (id, author) => {
	//id就是要删除博客的id

	let sql = `delete from blogs where id=${id} and author='${author}'`;
	return exec(sql).then((result) => {
		if (result.affectedRows > 0) {
			return true;
		}
		return false;
	});
};
module.exports = { getList, getDetail, newBlog, updateBlog, deleteBlog };
