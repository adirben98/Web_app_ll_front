import apiClient from '../Services/api-client';


export interface IUser {
    email: string;
    imgUrl: string;
    username: string;
    password: string;
    accessToken?:string;
  }
  const token=process.env.REACT_APP_ACCESS_TOKEN!
  
export const registrUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {

        apiClient(token).post("/auth/register", user).then((response) => {
            console.log(response)
            const data=response.data;
            resolve(data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}