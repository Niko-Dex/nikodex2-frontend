import type { Banner } from "$lib/types/banner";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
  const banner_res = await fetch("/api/banner");
  const banner: Banner = await banner_res.json();
  return {
    banner,
  };
};
