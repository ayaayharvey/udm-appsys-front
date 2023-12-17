import Cookies from "js-cookie"
export const getToken = () => {
    try {
        const token = Cookies.get('jwtToken');
        if (!token) {
            throw new Error ('token is missing');
        }
        return token
    } catch (err) {
        console.error(err);
    }
}