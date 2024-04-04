import userResolvers from "./resolvers/user.resolvers";
import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";

const typeDefs = gql`
 # user Graphlql

  type User {
    name: String
    age: Int
    email: String
    password: String
    status: String
    _id: String

  }

  input UserInput {
    name: String
    age: Int
    email: String
    password: String
    status: String
  }
  type Authentication {
    user: User!
  }

  type Query {
    #User
    getUser(_id: String!): User
    
 
  }

  type Mutation {
    #User
    registerUser(user: UserInput!): Authentication
    login(email: String, password: String): Authentication
    updateUser(_id: String!, params:UserInput):User
    deleteUser(_id: String!):User
    
  }
`;

export const resolvers = merge(userResolvers);
export const executableSchema = makeExecutableSchema({
  resolvers: { ...resolvers },
  typeDefs,
});
