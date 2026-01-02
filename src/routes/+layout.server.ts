import type { User } from "$lib/types/user";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, depends }) => {
  depends("app:auth");
  const authorizationMessage = await fetch(`/api/user/me`);
  let currentUser: User | undefined = undefined;
  if (authorizationMessage.ok) {
    currentUser = await authorizationMessage.json();
  }

  return {
    currentUser,
  };
};
