import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../helper";

async function auditNiko(jsonObj: any, title: string) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("msg", title);
  if (jsonObj.id) {
    formData.append("fields[n]", "4");
    formData.append("fields[0]", `ID;${jsonObj.id}`);
    formData.append("fields[1]", `Name;${jsonObj.name}`);
    formData.append("fields[2]", `Desc;${jsonObj.description}`);
    formData.append("fields[3]", `Full desc;${jsonObj.full_desc}`);
  } else {
    formData.append("fields[n]", "3");
    formData.append("fields[0]", `Name;${jsonObj.name}`);
    formData.append("fields[1]", `Desc;${jsonObj.description}`);
    formData.append("fields[2]", `Full desc;${jsonObj.full_desc}`);
  }

  const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
    method: "POST",
    body: formData,
  });
  if (!b_res.ok) {
    console.log(`Error while auditing.. ${await b_res.text()}`);
  }
}

export async function GET({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/nikos`);
    return await resWithErrHandling(res);
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

    return await resWithErrHandling(res);
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
      const resJson = await res.json();
      await auditNiko(resJson, "A Niko got deleted..");
    }

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}
