import Cookies from "js-cookie";

export const logoutAuth = ()=> {
    Cookies.remove('jwtToken')    
}