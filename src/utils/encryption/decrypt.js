import CryptoJS from "crypto-js";
export const decrypt = async(text , SECRET_KEY=process.env.SECRET_KEY)=>{
    return CryptoJS.AES.decrypt(text,SECRET_KEY).toString(CryptoJS.enc.Utf8)
}