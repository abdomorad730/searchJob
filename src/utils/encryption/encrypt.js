import CryptoJS from "crypto-js";
export const encrypt = async(text , SECRET_KEY=process.env.SECRET_KEY)=>{
    return CryptoJS.AES.encrypt(text,SECRET_KEY).toString()
}