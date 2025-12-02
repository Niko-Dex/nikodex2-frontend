import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";

export async function DELETE({ cookies, request, fetch }) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get("id");
    const beforeDeletion = await fetch(
      `${env.API_SERVER_URL}/posts/?id=${postId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      },
    ).then((r) => r.json());

    const deletionFetchMessage = await fetch(
      `${env.API_SERVER_URL}/posts?id=${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      },
    );

    // Audit the deletion

    const formData = new FormData();
    formData.append("title", "A Post was deleted!");
    formData.append("msg", "A post was deleted");
    formData.append("fields[n]", "4");
    formData.append("fields[0]", `Post ID;${beforeDeletion.id}`);
    formData.append("fields[1]", `Title;${beforeDeletion.title}`);
    formData.append("fields[2]", `Content;${beforeDeletion.content}`);
    formData.append("fields[3]", `Author;${beforeDeletion.user.username}`);

    const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
      method: "POST",
      body: formData,
    });

    if (!b_res.ok) {
      console.log(
        `Error while trying to audit the action.. ${await b_res.text()}`,
      );
    }

    return deletionFetchMessage;
  } catch (err) {
    return errSrv(err);
  }
}
