export interface LoginResponse {
    access_token : string
    id_user : string
}
  
export interface User {
    id : string
    firstname : string
    lastname : string
    email : string
    about : string
    date : Date
    address : Address
    idProfilePicture : Picture
    idBannerPicture : Picture
}

export interface Work {
    id : string
    idUser : string
    company : string
    job : string
    startDate : Date
    endDate : Date
    idPicture : Picture
}

export interface Education {
    id : string
    idUser : string
    institution : string
    degree : string
    endDate : Date
    idPicture : Picture
}

export interface Skill {
    id : string
    idUser : string
    skillName : string
    percentage : number
}

export interface Project {
    id : string
    idUser : string
    name : string
    description : string
    linkGithub : string
    linkProject : string
}

export interface Picture {
    id : string
    idUser : string
    idEntity : string
    publicId : string
    filename : string
    url : string
}

export interface Address {
    id : string
    idUser : string
    country : Country
    city : City
    province : Province
}

export interface Country {
    id : string
    name : string
}

export interface City {
    id : string
    name : string
}

export interface Province {
    id : string
    name : string
}

