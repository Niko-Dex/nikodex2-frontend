import os from "os";
import { fail, type Actions } from "@sveltejs/kit";
import { relogin } from "../helper";
import type { User } from "$lib/types/user";
import type { Banner } from "$lib/types/banner";

export async function load({ fetch }) {
  const me_res = await fetch("/api/user/me");
  const me: User = await me_res.json();
  const banner_res = await fetch("/api/banner");
  const banner: Banner = await banner_res.json();
  return {
    server_info: {
      frontend_nodejs_ver: process.versions.node,
      frontend_nodejs_module: process.versions.modules,
      frontend_running_for: process.uptime(),
      frontend_mem_usage: Math.round(process.memoryUsage().rss / 1024 / 1024),
      server_uptime: os.uptime(),
      server_mem_usage: Math.round(
        (os.totalmem() - os.freemem()) / 1024 / 1024,
      ),
      server_mem_total: Math.round(os.totalmem() / 1024 / 1024),
    },
    me: me,
    banner,
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
  update_banner: async ({ request, fetch }) => {
    const data = await request.formData();
    try {
      await fetch("/api/banner", {
        method: "POST",
        body: JSON.stringify({
          title: data.get("title") ?? "",
          content: data.get("content") ?? "",
          banner_color: data.get("banner_color") ?? "#ffffff",
          is_dismissable: data.get("is_dismissable") ? true : false,
        }),
      });
    } catch {
      relogin();
    }
  },
} satisfies Actions;
