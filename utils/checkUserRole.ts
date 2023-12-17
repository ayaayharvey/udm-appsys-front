import jwt, { JwtPayload } from 'jsonwebtoken';
import { getToken } from './getAuthToken';

interface Token extends JwtPayload {
    user_role: string;
}

export function checkUserRole(): string | undefined {
    const token = getToken();
    let decoded: Token;

    if (token) {
        try {
            decoded = jwt.decode(token) as Token;
            return decoded?.user_role;
        } catch (err: any) {
            throw new Error(err);
        }
    }

   
}