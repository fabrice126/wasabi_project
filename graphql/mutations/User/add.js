import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';

import userInputType from '../../types/User/User-input';
import UserModel from '../../../model/User.model';

export default {
  type: GraphQLBoolean,
  description: 'Add an user',
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(userInputType)
    }
  },
  async resolve(root, params, options) {
    const userModel = new UserModel(params.data);
    const newUser = await userModel.save();

    if (!newUser) {
      throw new Error('Error adding new blog post');
    }
    return true;
  }
};