import mongoose from "mongoose"

export const testConnection = async ()=>{
    await mongoose.connect(process.env.URI).then(()=>{
        console.log('db are connect');   
    }).catch((err)=>{
        console.log('fail to connect');
    })
}