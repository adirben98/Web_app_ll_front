function getUser(){
const username=localStorage.getItem('username')
const userImg=localStorage.getItem('userImg')
const accessToken=localStorage.getItem('token')

    return {
        username:username,
        userImg:userImg,
        accessToken:accessToken
    }
}

export default {getUser}
