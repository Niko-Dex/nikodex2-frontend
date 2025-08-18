import { redirect } from '@sveltejs/kit';

export async function GET({ request, fetch, cookies }) {
    cookies.delete("token", { path: "/" })

    return redirect(307, "/admin/login")
}