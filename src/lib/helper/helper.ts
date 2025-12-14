import type { Niko } from "$lib/types/nikosona";
import toast from "svelte-french-toast";
import { fromStore, writable, type Writable } from "svelte/store";

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
// blacklists for pages that redirect back to their original page regardless of any cause
export const origRedirects = ["img_viewer"]

export const beforePage: Writable<Array<string>> = writable(new Array<string>());

export function returnGoBackLink(link: string){
  console.warn(link)
  const currentStoreValue = fromStore(beforePage).current
  return currentStoreValue.findLast((pred) => pred != link)
}