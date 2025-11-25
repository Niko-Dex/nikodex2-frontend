import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const token = formData.get("cf-turnstile-response");

    const { username, password } = Object.fromEntries(formData);
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "X-Turnstile-Token": token?.toString() ?? ""
      }
    });
    if (!response.ok)
      return fail(response.status, {
        error: (await response.json())["error"],
      });
    redirect(303, "/account");
  },
} satisfies Actions;
