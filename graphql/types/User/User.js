import {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType,
    GraphQLID,
    GraphQLObjectType
} from 'graphql';

export default new GraphQLObjectType({
    name: 'User',
    description: "This represent a User",
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        firstname: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastname: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        },
        // role: {
        //     type: new GraphQLEnumType({
        //         name: 'role',
        //         values: {
        //             Client: {
        //                 value: "Client"
        //             },
        //             Admin: {
        //                 value: "Admin"
        //             }
        //         }
        //     })
        // },
        createdAt: {
            type: GraphQLString
        },
        updatedAt: {
            type: GraphQLString
        }
    }
});