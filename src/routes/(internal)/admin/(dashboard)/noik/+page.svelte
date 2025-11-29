<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import PageChanger from "$lib/components/PageChanger.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import type { Niko } from "$lib/types/nikosona";

    let apiData: Niko[] = $state([]);
    let maxPages = $state(0);
    let currentPage = $state(1);
    let dataErr = $state(false);
    let totalCnt = $state(0);

    let editMode: { [id: number]: boolean } = $state({});
    let oldData: { [id: number]: (typeof apiData)[number] } = {};

    let editAbilitiesRow: Niko | null = $state(null);
    let editImage: { [id: number]: HTMLInputElement } = $state({});
    let markedDeletionAbilities: Set<number> = new SvelteSet<number>();

    function startEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = true;
        oldData[row.id] = { ...row };
    }

    async function saveEdit(row: (typeof apiData)[number]) {
        console.log(row);
        const fetchData = fetch(`/api/data?id=${row.id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: row.name,
                description: row.description,
                full_desc: row.full_desc,
                author_id: row.author_id,
                is_blacklisted: row.is_blacklisted,
            } satisfies Omit<Niko, "id" | "author" | "abilities">),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (out) => {
            const jsonData = await out.json();
            if (out.status == 401) location.reload();
            if (!out.ok) throw new Error(jsonData["error"]);

            if (!editImage[row.id]) return;
            const imageList = editImage[row.id].files;
            if (imageList && imageList.length > 0) {
                const formData = new FormData();
                formData.append("file", imageList[0]);
                let image = await fetch(`/api/image?id=${row.id}`, {
                    method: "POST",
                    body: formData,
                });

                if (image.status == 401) location.reload();
                if (!image.ok) throw new Error((await image.json())["error"]);
            }

            delete oldData[row.id];
            editMode[row.id] = false;
        });

        await toast.promise(fetchData, {
            success: "Updated Noik!",
            loading: "Updating Noik",
            error: (e) => `Error while updating Noik: ${e.message}`,
        });
    }

    function cancelEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = false;

        const old = oldData[row.id];
        if (old) {
            for (let i in row) {
                //@ts-ignore
                row[i] = oldData[row.id][i];
            }
        }
        delete oldData[row.id];
    }

    async function saveAbilitiesEdit() {
        try {
            for (let ability of editAbilitiesRow?.abilities ?? []) {
                let out = null;
                if (isNaN(ability.id)) {
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

            for (let deleteAbility of markedDeletionAbilities) {
                if (isNaN(deleteAbility)) continue;
                let out = await fetch(
                    `/api/data/abilities?id=${deleteAbility}`,
                    {
                        method: "DELETE",
                    },
                );
                if (out.status == 401) location.reload();
                if (out.status != 200) throw new Error(await out.text());
            }
            toast.success(
                `Successfully saved ${editAbilitiesRow?.author}'s Abilities!`,
            );
            editAbilitiesRow = null;
            await getData();
        } catch (e) {
            toast.error(
                `Something has gone wrong while trying to update abilities! ${e}`,
            );
        }
    }

    async function getData() {
        const fetchData = fetch(
            `/api/data/page?page=${currentPage}&sort_by=oldest_added`,
        ).then(async (out) => {
            const jsonData = await out.json();
            if (!out.ok) throw new Error(jsonData["error"]);
            apiData = [];
            for (let d of jsonData) {
                apiData.push({
                    id: d["id"],
                    name: d["name"],
                    author: d["author_name"],
                    full_desc: d["full_desc"],
                    description: d["description"],
                    abilities: d["abilities"],
                    author_id: d["author_id"],
                    is_blacklisted: d["is_blacklisted"],
                });
            }
        });
        await toast.promise(fetchData, {
            success: "Fetched Noiks data!",
            loading: "Fetching Noiks",
            error: (e) => `Error while fetching Noiks: ${e.message}`,
        });
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

    async function deleteData(row: (typeof apiData)[number]) {
        if (!confirm(`Are you sure you want to delete "${row.name}" entries?`))
            return;
        const fetchData = fetch(`/api/data?id=${row.id}`, {
            method: "DELETE",
        }).then(async (out) => {
            const jsonData = await out.json();
            if (out.status == 401) location.reload();
            if (!out.ok) throw new Error(jsonData["error"]);
            delete oldData[row.id];
            apiData = apiData.filter((v) => v.id != row.id);
            editMode[row.id] = false;
            return null;
        });
        await toast.promise(fetchData, {
            success: "Deleted Noik data!",
            loading: "Deleting Noik",
            error: (e) => `Error while deleting Noik: ${e.message}`,
        });
    }

    async function createData(
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        const btn = ev.target as HTMLButtonElement;
        btn.disabled = true;
        const data = {
            name: "placeholder",
            full_desc: "placeholder",
            description: "placeholder",
            author_id: null,
            is_blacklisted: false,
        };

        const fetchData = fetch(
            `/api/data?page=${currentPage}&sort_by=oldest_added`,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        ).then(async (out) => {
            if (out.status == 401) location.reload();
            if (!out.ok) throw new Error(await out.text());
            await getData();
            return null;
        });

        await toast.promise(fetchData, {
            success: "Created Noik!",
            loading: "Creating Noik",
            error: (e) => `Error while creating Noik: ${e.message}`,
        });

        btn.disabled = false;
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
                    <th class="px-3 py-2">Author ID</th>
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
                            />
                            <a
                                href="/api/image?id={noik.id}"
                                target="_blank"
                                class="btn w-fit">View image</a
                            >
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Author:</span>
                            <input
                                type="text"
                                disabled={true}
                                bind:value={noik.author}
                                class="w-full min-w-[100px]"
                            />
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Author ID:</span>
                            <input
                                class="w-full min-w-[100px]"
                                disabled={!editMode[noik.id]}
                                type="number"
                                placeholder="placeholder :<"
                                bind:value={noik.author_id}
                            />
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
                            <p>({noik.abilities.length} abilities)</p>
                            <button
                                class="hover:cursor-pointer hover:text-white"
                                onclick={() => {
                                    editAbilitiesRow = JSON.parse(
                                        JSON.stringify(noik),
                                    );
                                }}>[Edit]</button
                            >
                            <!-- <input type="text" disabled value="<to be implemented>"> -->
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
    {#if editAbilitiesRow != null}
        <div
            class="fixed top-0 left-0 w-screen h-screen flex justify-center bg-black/65 z-10"
        >
            <div
                class="w-full max-w-[1200px] flex flex-col gap-4 m-8 bg-slate-800 max-h-fit p-4 rounded-md"
            >
                <div class="flex justify-between">
                    <p>
                        Editing {editAbilitiesRow?.name ?? "[unknown]"}'s
                        Abitilies
                    </p>
                    <div>
                        <button
                            class="hover:cursor-pointer hover:text-green-500"
                            onclick={async () => {
                                await saveAbilitiesEdit();
                            }}>[Save]</button
                        >
                        /
                        <button
                            class="hover:cursor-pointer hover:text-red-500"
                            onclick={() => {
                                editAbilitiesRow = null;
                            }}>[Cancel]</button
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
                                <th class="px-3 py-2 w-[128px] max-w-[128px]"
                                    >Action</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#each editAbilitiesRow?.abilities ?? [] as ability}
                                <tr
                                    class="text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                                >
                                    <td class="px-3 py-2">
                                        <input
                                            type="text"
                                            bind:value={ability.name}
                                            class="w-full"
                                        />
                                    </td>
                                    <td class="px-3 py-2">
                                        <button
                                            class="hover:cursor-pointer hover:text-red-500"
                                            onclick={async () => {
                                                markedDeletionAbilities.add(
                                                    editAbilitiesRow?.abilities.splice(
                                                        editAbilitiesRow.abilities.findIndex(
                                                            (v) =>
                                                                v.id ==
                                                                ability.id,
                                                        ),
                                                        1,
                                                    )[0].id ?? NaN,
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
            </div>
        </div>
    {/if}
    <PageChanger
        {maxPages}
        onupdate={async (page) => {
            currentPage = page;
            await getData();
        }}
        disabled={dataErr}
    />
</div>
