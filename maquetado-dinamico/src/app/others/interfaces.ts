export interface LoginResponse {
    access_token : string
    id_user : string
}

export interface LoginData {
    accessToken : string
    idUser : string
    isLogged : boolean
}

export interface UserPersonalInfo{
    firstname: string|null,
    lastname: string|null,
    dob: string|Date|null,
    phone: string|null,
    about: string|null,
    githubUrl: string|null,
    linkedinUrl: string|null
}

export interface Credentials{
email: string|null
password: string|null
}

export interface DefaultUser {
    userData: User
    work: Array<Work|null>
    education: Array<Education|null>
    project: Array<Project|null>
    skill: Array<Skill|null>
}
  
export interface User {
    id : string|null
    firstname : string|null
    lastname : string|null
    email : string|null
    about : string|null
    phone : string|null
    githubUrl : string|null
    linkedinUrl : string|null
    dob : Date|null
    address : Address|null
    idProfilePicture : Picture|null
    idBannerPicture : Picture|null
}

export interface Work {
    id : string|null
    idUser : string|null
    company : string|null
    job : string|null
    startdate : Date|null
    enddate : Date|null
    idPicture : Picture|null
}

export interface Education {
    id : string|null
    idUser : string|null
    institution : string|null
    degree : string|null
    enddate : Date|null
    idPicture : Picture|null
}

export interface Skill {
    id : string|null
    idUser : string|null
    skillName : string|null
    percentage : number|null
}

export interface Project {
    id : string|null
    idUser : string|null
    name : string|null
    description : string|null
    enddate : Date|null
    linkGithub : string|null
    linkProject : string|null
}

export interface Picture {
    id : string|null
    idUser : string|null
    idEntity : string|null
    publicId : string|null
    filename : string|null
    url : string|null
}

export interface Address {
    id : string|null
    idUser : string|null
    country : Country|null
    city : City|null
    province : Province|null
}

export interface Country {
    id : string|null
    name : string|null
}

export interface City {
    id : string|null
    name : string|null
}

export interface Province {
    id : string|null
    name : string|null
}

