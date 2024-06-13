import apiClient from "./api-client";
interface IPhoto{
    url:string
}
const token=process.env.REACT_APP_ACCESS_TOKEN!

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