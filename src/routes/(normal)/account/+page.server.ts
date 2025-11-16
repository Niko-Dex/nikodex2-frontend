import { env } from "$env/dynamic/private";
import { json, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import toast from "svelte-french-toast";
import { errSrv } from "../../api/helper";
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
      redirect(307, "account/login");
    }
    return await res.json();
  } catch (err) {
    return redirect(307, "account/login");
  }
}) satisfies PageServerLoad;
