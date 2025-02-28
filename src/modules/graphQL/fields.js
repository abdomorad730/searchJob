import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { getAllCompany, getAllUser } from "./resolve.js";

export const adminDashboard = {
    getUser: {
        type: new GraphQLObjectType({
            name: 'getUser',
            fields: {
               msg:{type:GraphQLString},
               data:{type:new GraphQLList(new GraphQLObjectType({
                name: 'allUser',
                fields: {
                    userName: { type: GraphQLString },
                    firstName: { type: GraphQLString },
                    lastName: { type: GraphQLString },
                    DOB: { type: GraphQLString },
                    email: { type: GraphQLString },
                    password: { type: GraphQLString },
                    mobileNumber: { type: GraphQLString },
                    role: { type: GraphQLString },
                    gender: { type: GraphQLString },
                    provider: { type: GraphQLString },
                    confirmed: { type: GraphQLBoolean },
                    isDeleted: { type: GraphQLBoolean },
                    profilePic: {
                        type: new GraphQLObjectType({
                            name: "profilePic",
                            fields: {
                                secure_url: { type: GraphQLString },
                                public_id: { type: GraphQLString },
            
                            }
                        })
                    },
                    _id: { type: GraphQLID },
                }
            })),}
            }
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:getAllUser

    },
    getCompany: {
        type: new GraphQLObjectType({
            name: 'getCompany',
            fields: {
               msg:{type:GraphQLString},
               data:{type:new GraphQLList(new GraphQLObjectType({
                name: 'allCompany',
                fields: {
                    companyName: { type: GraphQLString },
                    describtion: { type: GraphQLString },
                    industry: { type: GraphQLString },
                    address: { type: GraphQLString },
                    companyEmail: { type: GraphQLString },
                    numberOfEmployees: { type: GraphQLInt },
                    createdBy:{ type: GraphQLID },
                    approvedByAdmin:  { type: GraphQLBoolean }, 
                    HRs:{type:new GraphQLList(GraphQLID)},
                    deletedAt: { type: GraphQLString },
                    bannedAt: { type: GraphQLString },
                    imageCover: {
                        type: new GraphQLObjectType({
                            name: "image",
                            fields: {
                                secure_url: { type: GraphQLString },
                                public_id: { type: GraphQLString },
            
                            }
                        })
                    },
                    logo: {
                        type: new GraphQLObjectType({
                            name: "logo",
                            fields: {
                                secure_url: { type: GraphQLString },
                                public_id: { type: GraphQLString },
            
                            }
                        })
                    },
                    legalAttachment: {
                        type: new GraphQLObjectType({
                            name: "legalAttachment",
                            fields: {
                                secure_url: { type: GraphQLString },
                                public_id: { type: GraphQLString },
            
                            }
                        })
                    },
                    _id: { type: GraphQLID },
                }
            })),}
            }
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:getAllCompany

    }
   






}
