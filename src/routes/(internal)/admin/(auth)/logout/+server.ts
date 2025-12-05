import { relogin } from "../../helper.js";

export async function GET({ cookies }) {
  cookies.delete("token", { path: "/" });
  throw relogin();
}
