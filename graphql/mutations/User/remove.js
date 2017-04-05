import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import userType from '../../types/User/User';
import UserModel from '../../../model/User.model';

export default {
  type: userType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(root, params, options) {
    const removedUser = await UserModel.findByIdAndRemove(params._id, {}).exec();

    if (!removedUser) {
      throw new Error('Error removing blog post');
    }

    return removedUser;
  }
};