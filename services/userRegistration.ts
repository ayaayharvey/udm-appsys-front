import { domain } from "@/constants/constans";

export function userRegistration(data: object): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${domain}/api/register`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(data)
            })
        
            if (response.ok) {
                resolve(true);
            } else {
                const result = await response.json();
                reject(new Error(result?.status));
            }
        } catch (err: any) {
            reject(new Error(err?.message));
        }
    });
}   