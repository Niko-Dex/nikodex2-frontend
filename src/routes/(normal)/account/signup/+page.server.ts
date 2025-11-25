import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const actions = {
  default: async ({ fetch, request, getClientAddress }) => {
    const formData = await request.formData();
    const token = formData.get("cf-turnstile-response");

    const { username, password, confirm_password } =
      Object.fromEntries(formData);
    if (password != confirm_password) {
      return fail(400, {
        error: "Passwords don't match!",
      });
    }

    const response = await fetch("/api/user/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "X-Turnstile-Token": token?.toString() ?? ""
      }
    });
    if (!response.ok) return fail(response.status, {
      error: (await response.json())["error"],
    });
    return { success: true };
  },
} satisfies Actions;
