const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // me resolver function returns the user data if there is a context user, otherwise it throws an error
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('You need to be logged in to continue.');
        }
    },
    Mutation: {
        // addUser resolver function creates a new user, signs a token for the user and returns the token and data
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // login resolver function finds a user by email, checks if the password is correct, signs a token for user and returns the token and data
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError('Incorrect account information')
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect account information')
            }
            const token = signToken(user);
            return { token, user };
        },
        // saveBook resolver function updates the user's savedBooks array by adding a new book to the array 
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!')
        },
        // removeBook resolver function updates the user's savedBooks array by removing a book from the array by bookId
        // it returns the updated user data
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You must log in to continue')
        },
    }
};

// No clue if the above resolver will work atm - do more research and test more!!! 
module.exports = resolvers;
