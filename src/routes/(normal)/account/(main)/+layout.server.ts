import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../$types";
import { relogin } from "./helper";
export const load = (async (event) => {
  try {
    const token = event.cookies.get("token") ?? "";
    const res = await fetch(`${env.API_SERVER_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      relogin(event.url.pathname);
    }
    return await res.json();
  } catch {
    relogin(event.url.pathname);
  }
}) satisfies PageServerLoad;
