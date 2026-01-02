<script lang="ts">
    import { onMount } from "svelte";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import PageChanger from "$lib/components/PageChanger.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import type { Niko } from "$lib/types/nikosona";
    import { api, performAction } from "$lib/helper/helper";

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

    function startEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = true;
        oldData[row.id] = { ...row };
    }

    async function saveEdit(row: (typeof apiData)[number]) {
        const { author_id, description, full_desc, id, is_blacklisted, name } =
            row;
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
            const promiseImage = api(
                `/api/image?id=${row.id}`,
                "POST",
                formData,
            );
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

    function cancelEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = false;

        const old = oldData[row.id];
        if (old) {
            for (let i in row) {
                //@ts-expect-error THERE WON'T BE ANY ERROR, ZED!
                row[i] = oldData[row.id][i];
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
            const savePromises = (editAbilitiesRow?.abilities ?? []).map(
                (ability) => {
                    const isNew = isNaN(ability.id);
                    const url = isNew
                        ? `/api/data/abilities`
                        : `/api/data/abilities?id=${ability.id}`;
                    const method = isNew ? "POST" : "PUT";

                    return api(url, method, {
                        name: ability.name,
                        niko_id: ability.niko_id,
                    });
                },
            );

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
            apiData = data.map(
                (d: Omit<Niko, "author"> & { author_name: string }) => ({
                    id: d.id,
                    name: d.name,
                    author: d.author_name,
                    full_desc: d.full_desc,
                    description: d.description,
                    abilities: d.abilities,
                    author_id: d.author_id,
                    is_blacklisted: d.is_blacklisted,
                }),
            );
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
        const promise = api(url, "POST", data).then(getData);

        await performAction(promise, {
            loading: "Creating Nikosona...",
            success: "Created!",
            error: "Error while creating Nikosona",
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
                                min_width={200}
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
                            <button
                                class="btn min-w-20"
                                onclick={() => {
                                    editAbilitiesRow = JSON.parse(
                                        JSON.stringify(noik),
                                    );
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
    {#if editAbilitiesRow != null}
        <div
            class="fixed top-0 left-0 w-screen h-screen flex justify-center bg-black/65 z-10"
        >
            <div
                class="w-full max-w-[1200px] flex flex-col gap-4 m-8 bg-slate-800 max-h-fit p-4 rounded-md"
            >
                <div class="flex justify-between items-center">
                    <p>
                        Editing {editAbilitiesRow?.name ?? "[unknown]"}'s
                        Abitilies
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
                                <th class="px-3 py-2 w-[128px] max-w-[128px]"
                                    >Action</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#each editAbilitiesRow?.abilities ?? [] as ability, idx (idx)}
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
