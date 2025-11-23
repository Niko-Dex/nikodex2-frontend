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
    } else {
      const formData = new FormData();
      formData.append("title", "Submission");
      formData.append(
        "msg",
        "A new Niko was submitted! More info on dashboard!",
      );
      formData.append("fields[n]", "3");
      formData.append("fields[0]", `Name;${data.get("name")}`);
      formData.append("fields[1]", `Desc;${data.get("description")}`);
      formData.append("fields[2]", `Full Desc;${data.get("full_desc")}`);

      const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
        method: "POST",
        body: formData,
      });

      if (!b_res.ok) {
        console.log(
          `Error while trying to audit the action.. ${await b_res.text()}`,
        );
      }
    }

    return { success: true };
  },
} satisfies Actions;
