
function getUser(){
const user=localStorage.getItem('username')
    return user
}
function getToken(){
    const token=localStorage.getItem('token')
    return token
}
export default {getUser, getToken}
