import apiClient from "./api-client";
import User from "./user-service";
interface IPhoto{
    url:string
}
const token=User.getUser().accessToken!

const uploadPhoto = async (photo:File) =>{
    const formData = new FormData();
    formData.append("file", photo);
    return new Promise<string>((resolve,reject)=>{apiClient(token).post<IPhoto>("file?file="+photo+".jpeg", formData,
        {
      headers:{
        "Content-Type":"image/jpeg"
      }
    
    }).then((response)=>{
        console.log(response);
        resolve(response.data.url);
      }).catch((error)=>{
        console.log(error)
        reject(error);});
})
}
export default uploadPhoto;