
function getUser(){
const username=localStorage.getItem('username')
const email=localStorage.getItem('email')
const userImg=localStorage.getItem('imgUrl')
const accessToken=localStorage.getItem('accessToken')
const refreshToken=localStorage.getItem('refreshToken')



    return {
        username:username,
        email:email,
        userImg:userImg,
        accessToken:accessToken,
        refreshToken:refreshToken

    }
}




export default {getUser}
