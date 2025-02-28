import bcrypt from 'bcrypt';

export const hash = async(key,SALT_ROUNDES)=>{
    return bcrypt.hashSync(key, Number(SALT_ROUNDES))
}