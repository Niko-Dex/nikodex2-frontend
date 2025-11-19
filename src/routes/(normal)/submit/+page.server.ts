import { env } from "$env/dynamic/private";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
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

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    data.get("file");
    const res = await fetch(`${env.API_SERVER_URL}/submissions`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      console.log(`backend error! ${res.status}: ${text}`);
      return fail(res.status, { msg: text, error: true });
    }

    return { success: true };
  },
} satisfies Actions;
