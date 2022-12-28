export interface LoginResponse {
    success : boolean
    user : User
    token : string
}
  
export interface User {
    _id : string
    username : string
    password : string
    avatar : string
    isLogged : boolean
}