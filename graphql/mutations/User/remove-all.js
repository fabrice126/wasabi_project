import {
  GraphQLBoolean
} from 'graphql';

import User from '../../../model/User.model';

export default {
  type: GraphQLBoolean,
  resolve(root, params, options) {
    return User.remove({}).exec();
  }
};