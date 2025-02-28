import bcrypt from 'bcrypt'
export const compare = async(text,hash)=>{
    return  bcrypt.compareSync(text,hash)

}