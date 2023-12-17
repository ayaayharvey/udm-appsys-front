import { domain } from "@/constants/constans";
import Cookies from "js-cookie";

export function completeProfile(data: FormData): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const token = Cookies.get('jwtToken');
        
        try {
            if (!token) {
                throw new Error('Unauthorized');
            }
            const response = await fetch(`${domain}/api/user-profile`, {
                method: 'post',
                headers: {Authorization: token},
                body: data
            })

            if (response.ok) {
                resolve(true);
            } else {
                const result = await response.json();
                reject(new Error(result?.status))
            }


        } catch (err) {
            console.error(err);
        }
    });
}   