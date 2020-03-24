const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

// 注册
async function signup(parent, args, context, info) {
	//1
	const password = await bcrypt.hash(args.password, 10)
	//2
	const user = await context.prisma.createUser({ ...args, password })
	//3
	const token = jwt.sign({ userId: user.id }, APP_SECRET)
	//4
	return {
		token,
		user
	}
}

// 登录
async function login(parent, args, context, info) {
	//1
	const user = await context.prisma.user({ email: args.email })
	if (!user) {
		throw new Error('用户不存在，请前往注册')
	}
	// 2
	const valid = await bcrypt.compare(args.password, user.password)
	if (!valid) {
		throw new Error('用户密码错误，请重新尝试')
	}
	// 3
	const token = jwt.sign({ userId: user.id }, APP_SECRET)
	// 4
	return {
		token,
		user
	}
}

async function vote(parent, args, context, info) {
	// 1
	const userId = getUserId(context)
	// 2
	const linkExist = await context.prisma.$exists.vote({
		user: { id: UserId },
		link: { id: args.linkId }
	})
	// 3
	if (linkExist) {
		throw new Error(`您已经点过赞了:${args.linkId}`)
	}
	// 4
	return context.prisma.createVote({
		user: { connect: { id: userId } },
		link: { connect: { id: args.linkId } }
	})
}

function post(parent, args, context, info) {
	const userId = getUserId(context)
	return context.prisma.createLink({
		url: args.url,
		description: args.description,
		postedBy: { connect: { id: userId } }
	})
}

module.exports = {
	signup,
	login,
	post,
	vote
}
