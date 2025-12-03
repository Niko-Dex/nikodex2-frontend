import type { ServerLoadEvent } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";
import type { User } from "$lib/types/user";
import { relogin } from "../helper";

export const load = async (event: ServerLoadEvent) => {
  if (event.url.pathname.startsWith("/admin/login")) return;
  try {
    const fetchMessage = await event.fetch(`/api/user/me`);
    const authReply: User = await fetchMessage.json();
    const token = event.cookies.get("token") ?? "";
    jwt.verify(token, env.JWT_SECRET ?? "");
    if (!authReply.is_admin) relogin(event.url.pathname);

    return {
      user: authReply,
    };
  } catch {
    relogin(event.url.pathname);
  }
};
