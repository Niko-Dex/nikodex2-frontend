import type { Niko } from "$lib/types/nikosona";
import { parseISO } from "date-fns";

export const load = async ({ fetch }) => {
  let cnt = "";

  const cntRes = await fetch(`/api/data/count`);
  cnt = await cntRes.text();

  const notdRes = await fetch("/api/data/random_notd");
  const notdRefreshAt = parseISO(notdRes.headers.get("x-refreshat") ?? "");
  const notdJSON = await notdRes.json();
  const notd: Niko = {
    name: notdJSON["name"],
    author_name: notdJSON["author_name"],
    full_desc: notdJSON["full_desc"],
    description: notdJSON["description"],
    abilities: notdJSON["abilities"],
    id: notdJSON["id"],
    is_blacklisted: notdJSON["is_blacklisted"],
    author_id: notdJSON["author_id"],
  };

  return {
    cnt,
    notd,
    notdRefreshAt,
  };
};
