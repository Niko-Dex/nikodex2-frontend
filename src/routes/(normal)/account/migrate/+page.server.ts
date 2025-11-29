import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

async function fetchDiscordUser(discord_token: string) {
  const disc = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${discord_token}`,
    },
  });

  if (disc.ok) {
    return await disc.json();
  } else {
    return null;
  }
}

async function fetchUser(token: string) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      redirect(307, "/account/login");
    }
    return await res.json();
  } catch {
    return redirect(307, "/account/login");
  }
}

export async function load({ cookies }) {
  const discord_token = cookies.get("discord_token") ?? "";
  const token = cookies.get("token") ?? "";
  const discord_user = await fetchDiscordUser(discord_token);
  const user = await fetchUser(token);

  let authenticated = false;
  let discord_username = "";
  let discord_id = "";
  let user_id = 0;
  let user_username = "";
  if (discord_user) {
    authenticated = true;
    discord_username = discord_user["username"];
    discord_id = discord_user["id"];
  }

  if (user) {
    user_id = user["id"];
    user_username = user["username"];
  }

  return {
    authenticated,
    discord_username,
    discord_id,
    user_id,
    user_username,
  };
}
