import {
    GraphQLList
} from 'graphql';

import userType from '../../types/User/User';
import UserModel from '../../../model/User.model';

export default {
    type: new GraphQLList(userType),
    args: {},
    resolve(root, params, ctx, options) {
        return UserModel.find().exec();
    }
};