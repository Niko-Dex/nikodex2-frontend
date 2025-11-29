import type { Niko } from "$lib/types/nikosona";
import toast from "svelte-french-toast";
import { writable } from "svelte/store";

// this function was carried over to here
// to make it better and more re-usable for the public profile pages
export async function fetchNikos(id: number, apiData: Niko[]) {
  const fetchNoiks = fetch(`/api/user/nikos?id=${id}`)
    .then((res) => res.json())
    .then((res) => {
      for (const noik of res) {
        apiData.push({
          name: noik["name"],
          author: noik["author_name"],
          full_desc: noik["full_desc"],
          description: noik["description"],
          abilities: noik["abilities"],
          id: noik["id"],
          author_id: noik["author_id"],
          is_blacklisted: noik["is_blacklisted"],
        });
      }
    });

  await toast.promise(fetchNoiks, {
    success: "Data loaded!",
    loading: "Loading",
    error: (e) => `Problem while loading data! ${e}`,
  });
}
export const beforePage = writable("/");
