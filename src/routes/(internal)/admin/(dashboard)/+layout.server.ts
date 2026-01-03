import type { ServerLoadEvent } from "@sveltejs/kit";
import type { User } from "$lib/types/user";
import { relogin } from "../helper";

export const load = async (event: ServerLoadEvent) => {
  if (event.url.pathname.startsWith("/admin/login")) return;
  const data = await event.parent();
  const user = data.currentUser as User | undefined;
  if (!user || !user?.is_admin) relogin(event.url.pathname);
};
