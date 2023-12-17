import { getToken } from "@/utils/getAuthToken";
import jwt from "jsonwebtoken";

export function userAuthentication(): boolean{
    // check if there is token.
    const token = getToken();
    if (!token) {
        return false;
    }

    // decode token if there is data.
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
        return false;
    }

    return true;
}