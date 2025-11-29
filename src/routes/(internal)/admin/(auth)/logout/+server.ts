import { redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
  cookies.delete("token", { path: "/" });

  return redirect(307, "/admin/login");
}
