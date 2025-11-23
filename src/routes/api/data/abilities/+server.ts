import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../../helper.js";

async function auditAbility(jsonObj: any, title: string) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("msg", title);
  if (jsonObj.id) {
    formData.append("fields[n]", "3");
    formData.append("fields[0]", `ID;${jsonObj.id}`);
    formData.append("fields[1]", `Name;${jsonObj.name}`);
    formData.append("fields[2]", `Niko ID;${jsonObj.niko_id}`);
  } else {
    formData.append("fields[n]", "2");
    formData.append("fields[0]", `Name;${jsonObj.name}`);
    formData.append("fields[1]", `Niko ID;${jsonObj.niko_id}`);
  }

  const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
    method: "POST",
    body: formData,
  });
  if (!b_res.ok) {
    console.log(`Error while auditing.. ${await b_res.text()}`);
  }
}

export async function POST({ request, fetch, cookies }) {
  try {
    const reqText = await request.text();
    const res = await fetch(`${env.API_SERVER_URL}/abilities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: reqText,
    });

    if (res.ok) {
      const reqJson = JSON.parse(reqText);
      await auditAbility(reqJson, "An ability was created");
    }

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}

export async function PUT({ request, fetch, cookies }) {
  try {
    const reqText = await request.text();
    const url = new URL(request.url);
    const res = await fetch(
      `${env.API_SERVER_URL}/abilities?id=${url.searchParams.get("id")}`,
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
      await auditAbility(reqJson, "An ability got updated!");
    }

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}

export async function DELETE({ request, fetch, cookies }) {
  try {
    const url = new URL(request.url);
    const res = await fetch(
      `${env.API_SERVER_URL}/abilities?id=${url.searchParams.get("id")}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.ok) {
      const resJson = await res.json();
      await auditAbility(resJson, "An ability got deleted!");
    }

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}
