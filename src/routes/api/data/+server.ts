import { env } from "$env/dynamic/private";
import type { Niko } from "$lib/types/nikosona";
import { errSrv } from "../helper";

async function auditNiko(jsonObj: Niko, title: string) {
  const formData = new FormData();
  if (jsonObj.id) formData.append("noikId", jsonObj.id.toString());
  formData.append("title", title);
  formData.append("msg", title);
  formData.append("fields[n]", "4");
  formData.append("fields[0]", `Name;${jsonObj.name}`);
  formData.append("fields[1]", `Desc;${jsonObj.description}`);
  formData.append("fields[2]", `Full desc;${jsonObj.full_desc}`);
  formData.append("fields[3]", `Is Pattable;${!jsonObj.is_blacklisted}`);

  const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
    method: "POST",
    body: formData,
  });
  if (!b_res.ok) {
    console.log(`Error while auditing.. ${await b_res.text()}`);
  }
}

export async function GET({ fetch }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/nikos`);
    return res;
  } catch (e) {
    return errSrv(e);
  }
}

export async function POST({ request, fetch, cookies }) {
  try {
    const reqText = await request.text();

    const res = await fetch(`${env.API_SERVER_URL}/nikos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: reqText,
    });

    if (res.ok) {
      const reqJson = JSON.parse(reqText);
      await auditNiko(reqJson, "A Niko was created!");
    }

    return res;
  } catch (e) {
    return errSrv(e);
  }
}

export async function PUT({ request, fetch, cookies }) {
  try {
    const reqText = await request.text();
    const url = new URL(request.url);
    const res = await fetch(
      `${env.API_SERVER_URL}/nikos?id=${url.searchParams.get("id")}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: reqText,
      },
    );

    if (res.ok) {
      const reqJson = JSON.parse(reqText);
      await auditNiko(reqJson, "A Niko got updated!");
    }

    return res;
  } catch (e) {
    return errSrv(e);
  }
}

export async function DELETE({ request, fetch, cookies }) {
  try {
    const url = new URL(request.url);
    const res = await fetch(
      `${env.API_SERVER_URL}/nikos?id=${url.searchParams.get("id")}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      },
    );

    if (res.ok) {
      const clone = res.clone();
      const resJson = await clone.json();
      await auditNiko(resJson, "A Niko got deleted..");
    }

    return res;
  } catch (e) {
    return errSrv(e);
  }
}
