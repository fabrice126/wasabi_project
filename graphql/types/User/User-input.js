import {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType
} from 'graphql';

export default new GraphQLInputObjectType({
    name: 'UserInput',
    description: "This represent a User",
    fields: {
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