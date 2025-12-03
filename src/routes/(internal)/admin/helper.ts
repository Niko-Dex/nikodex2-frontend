import { resolve } from "$app/paths";
import { redirect } from "@sveltejs/kit";

export function relogin(return_to?: string) {
  const url = new URL(
    resolve("/(internal)/admin/(auth)/login"),
    "https://dummy",
  );
  if (return_to) {
    url.searchParams.set("return_to", return_to);
  }
  throw redirect(303, url.pathname + url.search);
}
