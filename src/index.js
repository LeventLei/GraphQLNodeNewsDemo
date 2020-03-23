const { prisma } = require('./generated/prisma-client') // 引入prisma客户端实例
const { GraphQLServer } = require('graphql-yoga')
const Query = require('./resolves/Query')
const Mutation = require('./resolves/Mutation')
const User = require('./resolves/User')
const Link = require('./resolves/Link')

const resolvers = {
	Query,
	Mutation,
	User,
	Link
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: request => {
		return {
			...request,
			prisma
		}
	}
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
