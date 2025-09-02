import { redirect } from '@sveltejs/kit'

export function load() {
    // TODO: not hardcode the redirect Discord OAuth2 link
    redirect(307, 'https://discord.com/oauth2/authorize?client_id=1041286108971016232&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fsubmit&scope=identify')
}