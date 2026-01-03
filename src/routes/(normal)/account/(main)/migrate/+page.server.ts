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

export async function load({ cookies }) {
  const discord_token = cookies.get("discord_token") ?? "";
  const discord_user = await fetchDiscordUser(discord_token);

  let authenticated = false;
  let discord_username = "";
  let discord_id = "";
  if (discord_user) {
    authenticated = true;
    discord_username = discord_user["username"];
    discord_id = discord_user["id"];
  }

  return {
    authenticated,
    discord_username,
    discord_id,
  };
}
