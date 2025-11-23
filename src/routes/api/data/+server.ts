import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../helper";
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
      const formData = new FormData();
      formData.append("title", "A Niko was added!");
      formData.append(
        "msg",
        "A Niko was added to the dex! (Most likely a admin approved a Niko)",
      );
      formData.append("fields[n]", "3");
      formData.append("fields[0]", `Name;${reqJson.name}`);
      formData.append("fields[1]", `Desc;${reqJson.description}`);
      formData.append("fields[2]", `Full desc;${reqJson.full_desc}`);

      const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
        method: "POST",
        body: formData,
      });
      if (!b_res.ok)
        console.log(`Error while auditing.. ${await b_res.text()}`);
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
      console.log(reqJson);
      const formData = new FormData();
      formData.append("title", "A Niko was updated!");
      formData.append(
        "msg",
        "This niko was updated either by the user or an admin",
      );
      formData.append("fields[n]", "4");
      formData.append(`fields[0]`, `ID;${url.searchParams.get("id")}`);
      formData.append("fields[1]", `Name;${reqJson.name}`);
      formData.append("fields[2]", `Desc;${reqJson.description}`);
      formData.append("fields[3]", `Full desc;${reqJson.full_desc}`);

      const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
        method: "POST",
        body: formData,
      });
      if (!b_res.ok) {
        console.log(`Error while auditing.. ${await b_res.text()}`);
      }
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
      const formData = new FormData();
      formData.append("title", "A Niko was deleted!");
      formData.append("msg", "A Niko was deleted..");
      formData.append("fields[n]", "1");
      formData.append("fields[0]", `ID;${url.searchParams.get("id")}`);

      const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
        method: "POST",
        body: formData,
      });
      if (!b_res.ok)
        console.log(`Error while auditing.. ${await b_res.text()}`);
    }

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}
