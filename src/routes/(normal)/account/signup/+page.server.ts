import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ fetch, request }) => {
    const formData = await request.formData();
    const token = formData.get("cf-turnstile-response");

    const { username, password, confirm_password, agree_tok } =
      Object.fromEntries(formData);
    if (password != confirm_password) {
      return fail(400, {
        error: "Passwords don't match!",
      });
    }
    if (agree_tok != "on") {
      return fail(400, {
        error: "Please agree to be a good kbity!",
      });
    }

    const response = await fetch("/api/user/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "X-Turnstile-Token": token?.toString() ?? "",
      },
    });
    if (!response.ok)
      return fail(response.status, {
        error: (await response.json())["error"],
      });
    return { success: true };
  },
} satisfies Actions;
