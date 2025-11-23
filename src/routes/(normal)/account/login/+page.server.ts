import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

async function hCaptchaHandler(fetch: {
    (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
    (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}, formData: FormData, clientAddress: string) {
  const clientResponse = formData.get("h-captcha-response")?.toString();
  const hCaptchaCheck = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      response: clientResponse ?? "",
      secret: env.HCAPTCHA_SECRET_KEY,
      remoteip: clientAddress,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const hCaptchaJson = await hCaptchaCheck.json();
  return hCaptchaJson;
}
export const actions = {
  loginRequest: async ({ request, fetch, getClientAddress }) => {
    const formData = await request.formData();
    if (!(await hCaptchaHandler(fetch, formData, getClientAddress())).success)
      return fail(401, { error: "Failed while log-in! Captcha failure!" });

    const { username, password } = Object.fromEntries(formData);
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok)
      return fail(401, {
        error: "Failed to log-in! Incorrect username or password.",
      });
    redirect(303, "/account");
  },
  signUpRequest: async({fetch, request, getClientAddress}) => {
    const formData = await request.formData()
    if (!(await hCaptchaHandler(fetch, formData, getClientAddress())).success)
      return fail(401, { error: "Failed while sign-in! Captcha failure!" });

    const { username, password } = Object.fromEntries(formData);
    const response = await fetch("/api/user/signup", {
      method: "POST",
      body: JSON.stringify({username, password})
    })
    if (!response.ok)
      return fail(401, await response.json())
    return { sign_up_success: true }
  }
} satisfies Actions;
