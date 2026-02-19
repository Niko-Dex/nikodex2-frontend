import type { User } from "$lib/types/user";
import type { LayoutServerLoad } from "./$types";
import { relogin } from "./helper";
export const load = (async (event) => {
  const data = await event.parent();
  const user = data.currentUser as User | undefined;
  if (!user) relogin(event.url.pathname);
}) satisfies LayoutServerLoad;
