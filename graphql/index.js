import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import mutations from './mutations';
import queries from './queries';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all queries',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root of all mutations',
    fields: mutations
  })
});