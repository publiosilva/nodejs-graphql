import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

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

const providers = {
  users: []
}

let id = 0

const resolvers = {
  user ({ id }) {
    return providers.users.find(item => item.id === Number(id))
  },
  users () {
    return providers.users
  },
  createUser ({ name, repo, age }) {
    const user = {
      id: id++,
      name,
      repo,
      age
    }

    providers.users.push(user)

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
