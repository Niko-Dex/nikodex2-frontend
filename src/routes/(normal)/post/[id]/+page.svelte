<script lang="ts">
  import type { PageProps } from "./$types";
  import Background from "$lib/assets/images/page/user/world_machine.png";
  let { data }: PageProps = $props();
  import CategoryComponent from "$lib/components/CategoryComponent.svelte";
  import { onMount } from "svelte";
  import type { NikodexComment } from "$lib/types/comment";
  import toast from "svelte-french-toast";
  import CommentCard from "$lib/components/CommentCard.svelte";
  import { currentUser, dateFormatter } from "$lib/helper/helper";
  import GoBackButton from "$lib/components/GoBackButton.svelte";
  import UserProfileComponent from "$lib/components/UserProfileComponent.svelte";

  let commentData: NikodexComment[] = $state([]);
  async function getComments() {
    const comments = fetch(`/api/data/comments?post_id=${data.id}`)
      .then((r) => {
        return r.json();
      })
      .then((r) => (commentData = r));

    toast.promise(comments, {
      loading: "Loading comments...",
      success: "Comments Loaded!",
      error: (e) => `Error loading comment: ${e.message}`,
    });
  }

  let inputValue = $state("");
  onMount(async () => {
    await getComments();
  });
</script>

<svelte:head>
  <title>NikoDex - {data.postData.title}</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
    <GoBackButton _class="w-fit">Go Back</GoBackButton>
    <div class="flex flex-col gap-0.5">
      <h1 class="h1-txt-size">{data.postData.title}</h1>
      <UserProfileComponent
        username={data.postData.user.username}
        id={data.postData.user.id}
      ></UserProfileComponent>
      <p>
        Posted on {dateFormatter(data.postData.post_datetime)}
      </p>
    </div>
    <p>{data.postData.content}</p>

    <div class="w-full flex flex-col items-center gap-4">
      <div
        class="lg:max-w-[70%] max-w-full p-4 border-2 border-(--theme-color)"
      >
        <img
          class="non-pixelated"
          alt={`Image of ${data.postData.title}`}
          src="/api/posts/image?id={data.postData.id}"
        />
      </div>
    </div>
    <CategoryComponent categoryName="Comments">
      {#if $currentUser}
        <form
          class="w-full flex gap-2"
          method="POST"
          onsubmit={async (event) => {
            event.preventDefault();

            const form: HTMLFormElement = event.currentTarget;
            const formData = new FormData(form);
            formData.append("post_id", data.id);
            formData.append("username", $currentUser.username);

            const commentPostFetch = fetch(form.action, {
              method: form.method,
              body: formData,
            }).then(async (r) => {
              const response = await r.json();
              const responseJson = JSON.parse(response.data);
              if (response.status != "200") throw responseJson;
              await getComments();
            });

            toast.promise(commentPostFetch, {
              loading: "Commenting...",
              success: "Commented!",
              error: (e) => `${e}`,
            });
          }}
        >
          <input
            type="text"
            maxlength="300"
            class="border-4 w-full p-3"
            placeholder="Type your comment here... Max: 300"
            name="comment"
            bind:value={inputValue}
            required
          />
          <button class="btn">Comment</button>
        </form>
      {:else}
        <em class="mt-5 mb-5">You must have an account to make comments :3</em>
      {/if}

      <section class="max-h-[500px] overflow-auto flex flex-col gap-2">
        {#each commentData as comment, idx (idx)}
          <CommentCard
            deletable={comment.author_id == $currentUser?.id}
            author_id={comment.author_id}
            username={comment.user.username}
            content={comment.content}
            id={comment.id}
            date={dateFormatter(comment.post_date)}
            original_poster={data.postData.user.id == comment.author_id}
            on_comment_delete={async () => {
              await getComments();
            }}
          />{/each}
      </section>
    </CategoryComponent>
    <br />
  </div>
</section>
