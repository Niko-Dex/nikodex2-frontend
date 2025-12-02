import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { resolve } from "$app/paths";
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
      redirect(307, resolve("/(normal)/account/login"));
    }
    return await res.json();
  } catch {
    redirect(307, resolve("/(normal)/account/login"));
  }
}) satisfies PageServerLoad;
