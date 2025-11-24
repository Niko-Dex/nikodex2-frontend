import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

interface TokenValidateResponse {
  "error-codes": string[];
  success: boolean;
  action: string;
  cdata: string;
}

async function validateToken(token: string, secret: string) {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        response: token,
        secret: secret,
      }),
    },
  );

  const data: TokenValidateResponse = await response.json();

  return {
    success: data.success,
    error: data["error-codes"]?.length ? data["error-codes"][0] : null,
  };
}

export const actions = {
  default: async ({ fetch, request, getClientAddress }) => {
    const formData = await request.formData();

    const token = formData.get("cf-turnstile-response");
    const { success, error } = await validateToken(
      token?.toString() ?? "",
      env.TURNSTILE_SECRET_KEY,
    );
    if (!success) {
      return fail(401, {
        error: error || "Failed to sign up! Captcha failure.",
      });
    }

    const { username, password, confirm_password } =
      Object.fromEntries(formData);
    if (password != confirm_password) {
      return fail(401, {
        error: "Passwords don't match!",
      });
    }

    const response = await fetch("/api/user/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return fail(401, await response.json());
    return { success: true };
  },
} satisfies Actions;
