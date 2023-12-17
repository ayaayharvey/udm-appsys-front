import { domain } from "@/constants/constans";
import Cookies from "js-cookie";

export function userLogin(data: object): Promise<object> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${domain}/api/login-authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const { token } = result;
        // check if profile is complete.
        Cookies.set("jwtToken", token);
        resolve(result);
      } else {
        const result = await response.json();
        reject(new Error(result?.status));
      }
    } catch (err: any) {
      reject(new Error(err?.message));
    }
  });
}
