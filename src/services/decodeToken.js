import userModel from "../DB/models/userModel.js"
import {  tokenTypes } from "./object.js"
import {   verify } from "../utils/index.js"


export const decodeToken = async (authorization, Types, next) => {
    if (!authorization) {
        return next(new Error("login first"))
    }
    const [prefix, token] = authorization.split(' ')
    let secret_key = ''
    let refresh_key = ''
    if (prefix == 'admin') {
        secret_key = process.env.SECRET_KEY_ADMIN
        refresh_key = process.env.REFRESH_KEY_ADMIN
    } else {
        secret_key = process.env.SECRET_KEY_USER
        refresh_key = process.env.REFRESH_KEY_USER

    }

    const decoded = await verify(token, Types == tokenTypes.refresh ? refresh_key : secret_key)
    if (!decoded?.id) {
        return next(new Error("invalid token"))
    }
    let user = await userModel.findById(decoded.id)

    if (!user) {
        return next(new Error("user not found"))
    }
    if (decoded?.iat < parseInt(user?.changedCredentialAt?.getTime()) / 1000) {
        return next(new Error("token is expired", { cause: 401 }))
    }
    if (user?.isDeleted) {
        return next(new Error("user is deleted", { cause: 401 }))

    }
    return user
}
export const decodeTokenGraph = async (authorization, roles = []) => {
    if (!authorization) {
        throw new Error("login first")
    }
    const [prefix, token] = authorization.split(' ')
    let secret_key = ''
    if (prefix == 'admin') {
        secret_key = process.env.SECRET_KEY_ADMIN
    } else {
        secret_key = process.env.SECRET_KEY_USER

    }

    const decoded = await verify(token,  secret_key)
    if (!decoded?.id) {
        throw new Error("invalid token")
    }
    let user = await userModel.findById(decoded.id)

    if (!user) {
        throw new Error("user not found")
    }
    if (decoded?.iat < parseInt(user?.changedCredentialAt?.getTime()) / 1000) {
        throw new Error("token is expired", { cause: 401 })
    }
    if (user?.isDeleted) {
        throw new Error("user is deleted", { cause: 401 })
    }
    if (!roles?.includes(user.role)) {
        throw new Error('access denied', { cause: 403 })
    }
    return user
}

export const decodeTokenSocket = async (socket,types=tokenTypes.access) => {
    if (!socket?.handshake?.auth?.authorization) {
        return {msg:'login frist',statusCode:401}
    }
    const [prefix, token] = socket?.handshake?.auth?.authorization.split(' ')
    let secret_key = ''
    if (prefix == 'admin') {
        secret_key = process.env.SECRET_KEY_ADMIN
    } else {
        secret_key = process.env.SECRET_KEY_USER

    }

    const decoded = await verify(token,  secret_key)
    if (!decoded?.id) {
        return {msg:'inValid Token',statusCode:401}
    }
    let user = await userModel.findById(decoded.id)

    if (!user) {
        return {msg:'user not found',statusCode:404}
    }
    if (decoded?.iat < parseInt(user?.changedCredentialAt?.getTime()) / 1000) {
        return {msg:' Token expired',statusCode:401}
    }
    if (user?.isDeleted) {
        return {msg:'user is deleted',statusCode:401}

    }
    return {user,statusCode:200}
}