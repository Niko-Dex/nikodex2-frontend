import type { User } from "$lib/types/user";
import type { LayoutServerLoad } from "./$types";
import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";

export const load: LayoutServerLoad = async ({ fetch, depends, cookies }) => {
  depends("app:auth");
  try {
    const token = cookies.get("token") ?? "";
    jwt.verify(token, env.JWT_SECRET ?? "");
  } catch {
    return undefined;
  }
  const authorizationMessage = await fetch(`/api/user/me`);
  let currentUser: User | undefined = undefined;
  if (authorizationMessage.ok) {
    currentUser = await authorizationMessage.json();
  }

  return {
    currentUser,
  };
};
