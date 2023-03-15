const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]        
    }

    type Auth {
        token: ID!
        user: User
    }

    type Book {
        _id: ID
        bookId: String
        title: String
        authors: [String]
        description: String
        image: String
        link: String
        forSale: String
    }

    type Query {
        me: User
    }

    input SavedBookInput {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String
        link: String
        forSale: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: SavedBookInput): User
        removeBook(bookId: String!): User
    }

`;

// No clue if the above schema will work atm - do more research and test more!!! 
module.exports = typeDefs;