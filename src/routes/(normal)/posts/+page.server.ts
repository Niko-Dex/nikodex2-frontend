import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
  const fetchMessage = await fetch(`/api/user/me`);
  if (!fetchMessage.ok) {
    return {
      authenticated: false,
    };
  }

  return {
    authenticated: true,
    user: await fetchMessage.json(),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ fetch, cookies, request }) => {
    const data = await request.formData();
    const res = await fetch(`/api/posts`, {
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
      formData.append("title", "New Post!");
      formData.append("msg", "A new Post was submitted!");
      formData.append("fields[n]", "3");
      formData.append("fields[0]", `Name;${data.get("title")}`);
      formData.append("fields[1]", `Desc;${data.get("content")}`);
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
