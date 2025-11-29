import type { ServerLoadEvent } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";

export const load = async (event: ServerLoadEvent) => {
  if (event.url.pathname.startsWith("/admin/login")) return;
  const fetchMessage = await event.fetch(`/api/user/me`);
  const authReply: User = await fetchMessage.json();
  const token = event.cookies.get("token") ?? "";

  try {
    jwt.verify(token, env.JWT_SECRET ?? "");
    if (!authReply.is_admin) redirect(302, "/admin/login");
  } catch (e) {
    redirect(302, `/admin/login`);
  }
};
