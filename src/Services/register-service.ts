import apiClient from '../Services/api-client';
import User from './user-service'


export interface IUser {
    email?: string;
    imgUrl: string;
    username: string;
    password: string;
    accessToken?:string;
  }
  const token=User.getUser().accessToken!
  
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