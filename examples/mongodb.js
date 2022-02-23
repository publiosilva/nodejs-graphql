import prisma from '@prisma/client'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const { PrismaClient } = prisma

/** Define schema */

const schema = buildSchema(`
  type User {
    id: ID
    name: String
    repo: String
    age: Int
  }
  type Query {
    user(id: ID!): User
    users: [User]
  }
  type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
  }
`)

/** Define resolvers */

const prismaClient = new PrismaClient()

const resolvers = {
  async user ({ id }) {
    return prismaClient.user.findUnique({ where: { id } })
  },
  async users () {
    return prismaClient.user.findMany()
  },
  async createUser ({ name, repo, age }) {
    const user = await prismaClient.user.create({
      data: {
        name,
        repo,
        age
      }
    })

    return user
  }
}

/** Setup server */

const app = express()
const port = process.env.PORT || 3000

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
