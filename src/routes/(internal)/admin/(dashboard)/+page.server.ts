import os from "os";
import { fail, type Actions } from "@sveltejs/kit";
import { relogin } from "../helper";

export async function load() {
  return {
    frontend_nodejs_ver: process.versions.node,
    frontend_nodejs_module: process.versions.modules,
    frontend_running_for: process.uptime(),
    frontend_mem_usage: Math.round(process.memoryUsage().rss / 1024 / 1024),
    server_uptime: os.uptime(),
    server_mem_usage: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
    server_mem_total: Math.round(os.totalmem() / 1024 / 1024),
  };
}

export const actions = {
  change_info: async ({ request, fetch }) => {
    const formData = await request.formData();
    const username = formData.get("new_username");
    const description = formData.get("new_description");
    const password = formData.get("new_password");
    const password2 = formData.get("new_password2");

    if (password != password2) {
      return fail(400, { error: "Password doesn't match!" });
    }
    try {
      await fetch("/api/user/me", {
        method: "PUT",
        body: JSON.stringify({
          new_username: username,
          new_password: password,
          new_description: description,
        }),
      });
      relogin();
    } catch {
      relogin();
    }
  },
} satisfies Actions;
