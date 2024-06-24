function getUser(){
const username=localStorage.getItem('username')
const userImg=localStorage.getItem('userImg')
const accessToken=localStorage.getItem('token')
const email=localStorage.getItem('email')

    return {
        username:username,
        userImg:userImg,
        accessToken:accessToken,
        email:email
    }
}

export default {getUser}
