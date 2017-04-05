import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import userType from '../../types/User/User';
import UserModel from '../../../model/User.model';

export default {
  type: userType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(root, params, ctx, options) {
    return UserModel.findById(params.id).exec();
  }
};