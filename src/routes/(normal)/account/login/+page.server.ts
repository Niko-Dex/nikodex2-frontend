import type { Actions } from "./$types";
import { goto } from "$app/navigation";
import { fail, redirect } from "@sveltejs/kit";

// TODO: Add signUpRequest.

export const actions = {
  loginRequest: async ({ request, fetch }) => {
    const formData = await request.formData();

    const { username, password, value } = Object.fromEntries(formData);
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return fail(401, { error: "Failed to sign-in! Incorrect username or password." });
    redirect(303, "/account");
  },
} satisfies Actions;
