<script lang="ts">
  import toast from "svelte-french-toast";
  import AllowPatsComponent from "./AllowPatsComponent.svelte";
  let {
    open = $bindable(false),
    id = 0,
    name = "",
    description = "",
    full_desc = "",
    author = "",
    is_blacklisted = false,
    author_id = 0,
  } = $props();

  let page = $state("main");
  let at: { id: number; name: string; niko_id: number }[] = $state([]);
  let deletedAbilities: number[] = $state([]);

  function addAbility() {
    at.push({
      id: -1,
      name: "Ability..",
      niko_id: id,
    });
  }

  function removeAbility(idx: number) {
    deletedAbilities.push(at[idx].id);
    at.splice(idx, 1);
  }

  export function setAbilities(
    arr: { id: number; name: string; niko_id: number }[]
  ) {
    at = arr;
  }

  function close() {
    open = false;
  }

  async function submitAbilityEdit() {
    try {
      for (let ability of at ?? []) {
        let out = null;
        if (isNaN(ability.id) || ability.id < 0) {
          out = await fetch(`/api/data/abilities`, {
            method: "POST",
            body: JSON.stringify({
              name: ability.name,
              niko_id: ability.niko_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          out = await fetch(`/api/data/abilities?id=${ability.id}`, {
            method: "PUT",
            body: JSON.stringify({
              name: ability.name,
              niko_id: ability.niko_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        if (out == null) continue;
        if (out.status == 401) location.reload();
        if (out.status != 200) throw new Error(await out.text());
      }

      for (let deleteAbility of deletedAbilities) {
        if (isNaN(deleteAbility) || deleteAbility < 0) continue;
        let out = await fetch(`/api/data/abilities?id=${deleteAbility}`, {
          method: "DELETE",
        });
        if (out.status == 401) location.reload();
        if (out.status != 200) throw new Error(await out.text());
      }

      console.log("Successfully saved abilities!");
    } catch (e) {
      toast.error(
        `Something has gone wrong while trying to update abilities! ${e}`
      );
    }
  }

  async function submitEdit() {
    const reqBody = JSON.stringify({
      name: name,
      description: description,
      author: author,
      full_desc: full_desc,
      author_id: author_id,
      is_blacklisted: is_blacklisted,
    });
    console.log(reqBody);
    const req = fetch(`/api/data?id=${id}`, {
      method: "PUT",
      body: reqBody,
    }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
    });

    await toast.promise(req, {
      loading: "Submitting..",
      error: (e) => `Error submitting! ${e}`,
      success: "Successful edit!",
    });
  }
</script>

{#if open}
  <div
    class="fixed w-full h-screen top-0 left-0 z-10 bg-black/75 flex justify-center"
  >
    <div
      class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 mx-8 my-auto md:w-max w-full"
    >
      <div class="flex flex-col gap-2 md:min-w-3xl w-full">
        <h1>Editing {name} - {page}</h1>
        <div>
          <button
            class={page == "main" ? "active btn w-fit" : "btn w-fit"}
            onclick={() => (page = "main")}>Main Info</button
          >
          <button
            class={page == "abilities" ? "active btn w-fit" : "btn w-fit"}
            onclick={() => (page = "abilities")}>Abilities</button
          >
        </div>
        {#if page == "main"}
          <label>
            <p>Name</p>
            <input class="w-full" type="text" bind:value={name} />
          </label>
          <label>
            <p>Short description</p>
            <input class="w-full" type="text" bind:value={description} />
          </label>
          <AllowPatsComponent bind:is_blacklisted />
          <label>
            <p>Full description</p>
            <textarea class="w-full" bind:value={full_desc}></textarea>
          </label>
        {:else}
          <p>Abilities</p>
          <div class="h-60 max-h-60 overflow-y-auto flex flex-col gap-2">
            {#each at as ability, idx (idx)}
              <div class="flex flex-row gap-2">
                <input class="w-full" type="text" bind:value={at[idx].name} />
                <button class="btn w-fit" onclick={() => removeAbility(idx)}
                  >Remove</button
                >
              </div>
            {/each}
            <button class="btn w-fit" onclick={() => addAbility()}
              >Add Ability</button
            >
          </div>
        {/if}
        <button
          class="btn"
          onclick={async () => {
            await submitEdit();
            await submitAbilityEdit();
          }}>Submit</button
        >
        <button class="btn" onclick={() => close()}>Close</button>
      </div>
    </div>
  </div>
{/if}
