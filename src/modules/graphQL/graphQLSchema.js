import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { adminDashboard } from './fields.js';
export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
       
            ...adminDashboard

        }
    }), 
})