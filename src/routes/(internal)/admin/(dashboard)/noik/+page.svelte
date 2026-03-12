<script lang="ts">
    import { onMount } from "svelte";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import PageChanger from "$lib/components/PageChanger.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import type { Niko } from "$lib/types/nikosona";
    import { api, performAction } from "$lib/helper/helper";
    import PopupBox from "$lib/components/PopupBox.svelte";
    import type { User } from "$lib/types/user";
    import toast from "svelte-french-toast";

    let apiData: Niko[] = $state([]);
    let maxPages = $state(0);
    let currentPage = $state(1);
    let dataErr = $state(false);
    let totalCnt = $state(0);

    let editMode: Record<number, boolean> = $state({});
    let oldData: Record<number, Niko> = {};

    let editAbilitiesRow: Niko | null = $state(null);
    let editImage: Record<number, HTMLInputElement> = $state({});
    let markedDeletionAbilities: Set<number> = new SvelteSet<number>();

    let editNikosonaAuthor: number = $state(NaN);
    let usernameToSearchFor = $state("");
    let currentUsers: User[] = $state([]);

    function startEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = true;
        oldData[row.id] = { ...row };
    }

    async function saveEdit(row: (typeof apiData)[number]) {
        const { author_id, description, full_desc, id, is_blacklisted, name } = row;
        const promise = api(`/api/data?id=${id}`, "PUT", {
            name,
            description,
            full_desc,
            author_id,
            is_blacklisted,
        }).then(() => {
            delete oldData[row.id];
            editMode[row.id] = false;
        });

        if (!editImage[row.id]) return;
        const imageList = editImage[row.id].files;
        if (imageList && imageList.length > 0) {
            const formData = new FormData();
            formData.append("file", imageList[0]);
            const promiseImage = api(`/api/image?id=${row.id}`, "POST", formData);
            await performAction(promiseImage, {
                loading: "Updating Nikosona's image...",
                success: "Updated!",
                error: "Error while updating Nikosona's image",
            });
        }

        await performAction(promise, {
            loading: "Updating Nikosona...",
            success: "Updated!",
            error: "Error while updating Nikosona",
        });
    }

    function cancelEdit(row: Niko) {
        editMode[row.id] = false;

        const old = oldData[row.id];
        if (old) {
            for (let i in row) {
                const k = i as keyof Niko;
                //@ts-expect-errors SHUT UP
                row[k] = oldData[row.id][k];
            }
        }
        delete oldData[row.id];
    }

    async function getMaxPages() {
        try {
            dataErr = false;
            const res = await fetch(`/api/data/count`);
            const data = await res.text();
            totalCnt = Number.parseInt(data);
            maxPages = Math.ceil(Number.parseFloat(data) / 14.0);
        } catch (err) {
            console.log(err);
            dataErr = true;
        }
    }

    async function saveAbilitiesEdit() {
        if (!editAbilitiesRow) return;

        const action = async () => {
            const savePromises = (editAbilitiesRow?.abilities ?? []).map((ability) => {
                const isNew = isNaN(ability.id);
                const url = isNew ? `/api/data/abilities` : `/api/data/abilities?id=${ability.id}`;
                const method = isNew ? "POST" : "PUT";

                return api(url, method, {
                    name: ability.name,
                    niko_id: ability.niko_id,
                });
            });

            const deletePromises = [...markedDeletionAbilities]
                .filter((id) => !isNaN(id))
                .map((id) => api(`/api/data/abilities?id=${id}`, "DELETE"));

            // Execute all requests (you can use Promise.all for speed if the API supports it)
            await Promise.all([...savePromises, ...deletePromises]);

            editAbilitiesRow = null;
            await getData();
        };

        await performAction(action(), {
            loading: "Saving Nikosona's abilities...",
            success: `Saved!`,
            error: "Error while saving Nikosona's abilities",
        });
    }

    async function getData() {
        const url = `/api/data/page?page=${currentPage}&sort_by=oldest_added`;

        const promise = api(url).then((data) => {
            apiData = data;
        });

        await performAction(promise, {
            loading: "Loading Nikosonas...",
            success: "Loaded!",
            error: "Error while loading Nikosonas",
        });
    }

    async function deleteData(row: Niko) {
        if (!confirm(`Are you sure you want to delete "${row.name}"?`)) return;

        const promise = api(`/api/data?id=${row.id}`, "DELETE").then(() => {
            apiData = apiData.filter((v) => v.id !== row.id);
            delete oldData[row.id];
            editMode[row.id] = false;
        });

        await performAction(promise, {
            loading: "Deleting Nikosona...",
            success: "Deleted!",
            error: "Error while deleting Nikosona",
        });
    }

    async function createData(ev: MouseEvent) {
        const btn = ev.currentTarget as HTMLButtonElement;
        btn.disabled = true;

        const data = {
            name: "placeholder",
            full_desc: "placeholder",
            description: "placeholder",
            author_id: null,
            is_blacklisted: false,
        };

        const url = `/api/data?page=${currentPage}&sort_by=oldest_added`;
        const promise = api(url, "POST", data).then(getMaxPages).then(getData);

        await performAction(promise, {
            loading: "Creating Nikosona...",
            success: "Created!",
            error: "Error while creating Nikosona",
        });

        btn.disabled = false;
    }

    async function getCurrentUsers() {
        const apiDataCurrent = fetch(
            `/api/data/user/search?username=${usernameToSearchFor}&page=${currentPage}`
        )
            .then((r) => r.json())
            .then((r) => {
                currentUsers = r;
            });
        await performAction(apiDataCurrent, {
            loading: "Loading",
            success: "Loaded search data!",
            error: "Error while searching user",
        });
    }

    onMount(async () => {
        await getMaxPages();
        await getData();
    });
</script>

<div class="xl:px-8 p-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Noik Entries</h2>
    <p>Database currently holding {totalCnt} entires.</p>
    <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
        <table
            class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full"
        >
            <thead
                class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-3 py-2">ID</th>
                    <th class="px-3 py-2">Name</th>
                    <th class="px-3 py-2">Image</th>
                    <th class="px-3 py-2">Author</th>
                    <th class="px-3 py-2">Short Description</th>
                    <th class="px-3 py-2">Full Description</th>
                    <th class="px-3 py-2">Abilities</th>
                    <th class="px-3 py-2">Non-pattable?</th>
                    <th class="px-3 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each apiData as noik (noik.id)}
                    <tr
                        class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                    >
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ID:</span>
                            <span>{noik.id}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Name:</span>
                            <input
                                type="text"
                                disabled={!editMode[noik.id]}
                                bind:value={noik.name}
                                class="w-full min-w-[80px]"
                            />
                        </td>
                        <td class="px-3 py-2 flex flex-col gap-2">
                            <span class="lg:hidden">Image:</span>
                            <FileUpload
                                disabled={!editMode[noik.id]}
                                accept="image/*"
                                bind:elm={editImage[noik.id]}
                                min_width={200}
                            />
                            <a href="/api/image?id={noik.id}" target="_blank" class="btn w-fit"
                                >View image</a
                            >
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Author:</span>
                            <button
                                class="btn min-w-32"
                                disabled={!editMode[noik.id]}
                                onclick={() => {
                                    editNikosonaAuthor = noik.id;
                                }}>Edit</button
                            >
                            <p>
                                <b
                                    >{noik.author_name == "" ? "Unknown" : noik.author_name}
                                    {noik.author_id == undefined
                                        ? ""
                                        : "(id " + noik.author_id + ")"}</b
                                >
                            </p>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Short description</span>
                            <input
                                type="text"
                                disabled={!editMode[noik.id]}
                                bind:value={noik.description}
                                class="w-full min-w-[100px]"
                            />
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Long description</span>
                            <textarea
                                disabled={!editMode[noik.id]}
                                bind:value={noik.full_desc}
                                class="w-full min-w-[400px]"
                            ></textarea>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Abilities:</span>
                            <button
                                class="btn min-w-20"
                                disabled={!editMode[noik.id]}
                                onclick={() => {
                                    editAbilitiesRow = JSON.parse(JSON.stringify(noik));
                                }}>Edit</button
                            >
                            <p>({noik.abilities.length} abilities)</p>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Non-pattable?</span>
                            <input
                                type="checkbox"
                                disabled={!editMode[noik.id]}
                                bind:checked={noik.is_blacklisted}
                            />
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Actions:</span>
                            <div class="flex flex-wrap gap-2">
                                {#if !editMode[noik.id]}
                                    <button
                                        class="btn min-w-20"
                                        onclick={() => {
                                            startEdit(noik);
                                        }}>Edit</button
                                    >
                                    <button
                                        class="btn min-w-20"
                                        onclick={async () => {
                                            await deleteData(noik);
                                        }}>Delete</button
                                    >
                                {:else}
                                    <button
                                        class="btn min-w-20"
                                        onclick={async () => {
                                            await saveEdit(noik);
                                        }}>Save</button
                                    >
                                    <button
                                        class="btn min-w-20"
                                        onclick={() => {
                                            cancelEdit(noik);
                                        }}>Cancel</button
                                    >
                                {/if}
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <button
            class="btn lg:w-60 sticky left-0"
            onclick={async (ev) => {
                await createData(ev);
            }}>Add Entry</button
        >
    </div>
    <PageChanger
        {maxPages}
        onupdate={async (page) => {
            currentPage = page;
            await getData();
        }}
        disabled={dataErr}
    />
</div>

{#if editAbilitiesRow != null}
    <PopupBox expanded={true}>
        <div class="flex justify-between items-center gap-4">
            <p>
                Editing {editAbilitiesRow?.name ?? "[unknown]"}'s Abitilies
            </p>
            <div>
                <button
                    class="btn min-w-20"
                    onclick={async () => {
                        await saveAbilitiesEdit();
                    }}>Save</button
                >
                <button
                    class="btn min-w-20"
                    onclick={() => {
                        editAbilitiesRow = null;
                    }}>Cancel</button
                >
            </div>
        </div>
        <div class="overflow-x-auto flex flex-col gap-4">
            <table
                class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full max-w-[1200px]"
            >
                <thead
                    class="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                    <tr>
                        <th class="px-3 py-2">Abilities</th>
                        <th class="px-3 py-2 w-[128px] max-w-[128px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each editAbilitiesRow?.abilities ?? [] as ability, idx (idx)}
                        <tr
                            class="text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                        >
                            <td class="px-3 py-2">
                                <input type="text" bind:value={ability.name} class="w-full" />
                            </td>
                            <td class="px-3 py-2">
                                <button
                                    class="hover:cursor-pointer hover:text-red-500"
                                    onclick={async () => {
                                        markedDeletionAbilities.add(
                                            editAbilitiesRow?.abilities.splice(
                                                editAbilitiesRow.abilities.findIndex(
                                                    (v) => v.id == ability.id
                                                ),
                                                1
                                            )[0].id ?? NaN
                                        );
                                    }}>[Delete]</button
                                >
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <button
                class="btn lg:w-60 sticky left-0"
                onclick={async () => {
                    editAbilitiesRow?.abilities.push({
                        id: NaN,
                        name: "",
                        niko_id: editAbilitiesRow.id,
                    });
                }}>Add Ability</button
            >
        </div>
    </PopupBox>
{/if}

{#if !isNaN(editNikosonaAuthor)}
    <PopupBox expanded={true}>
        <div class="flex justify-between items-center gap-4">
            <p>
                Changing {apiData[editNikosonaAuthor].name ?? "[unknown]"}'s ownership
            </p>
            <div>
                <button
                    class="btn min-w-20"
                    onclick={() => {
                        editNikosonaAuthor = NaN;
                    }}>Cancel</button
                >
            </div>
        </div>
        <p>Select a user to change the ownership.</p>
        <div class="overflow-x-auto flex flex-col gap-4">
            <div class="w-full flex flex-row gap-4">
                <input
                    bind:value={usernameToSearchFor}
                    class="w-full"
                    placeholder="Search user by username..."
                    onchange={async () => {
                        await getCurrentUsers();
                    }}
                />
                <button class="btn">Search..</button>
            </div>
            {#each currentUsers as user (user.id)}
                <button
                    class="flex flex-row items-center gap-4 no-underline btn group p-3"
                    onclick={() => {
                        let idx = apiData.findIndex((u) => u.id === editNikosonaAuthor);
                        if (idx !== -1) {
                            apiData[idx].author_id = user.id;
                            apiData[idx].author_name = user.username;
                            editNikosonaAuthor = NaN;
                        } else {
                            toast.error("Failed to update author! No ID found for selected user.");
                        }
                    }}
                >
                    <img
                        src={`/api/data/user/pfp?id=${user.id}`}
                        alt="Loading"
                        class="w-8 h-8 non-pixelated group-hover:outline-2 group-hover:outline-white"
                        draggable="false"
                        fetchpriority="low"
                    />
                    <h1 class="w-fit break-all">
                        {user.username}
                    </h1>
                </button>
            {:else}
                <p class="text-center"><em>start searching to see users!</em></p>
            {/each}
        </div>
    </PopupBox>
{/if}
