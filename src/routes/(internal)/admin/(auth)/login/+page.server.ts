import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, fetch, url }) => {
    const return_to = url.searchParams.get("return_to");
    const formData = await request.formData();
    const username = formData.get("username") ?? "";
    const password = formData.get("password") ?? "";

    const response = await fetch(`/api/admin/auth`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    if (!response.ok) {
      return fail(response.status, body);
    }
    if (return_to && return_to.startsWith("/")) {
      throw redirect(303, return_to);
    }
    throw redirect(303, "/admin");
  },
} satisfies Actions;
