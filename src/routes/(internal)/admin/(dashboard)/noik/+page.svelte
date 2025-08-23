<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast"

    let apiData: {
        id: number,
        name: string,
        author: string,
        img_link: string,
        short_desc: string,
        description: string,
        abilities: {
            name: string,
            niko_id: number,
            id: number
        }[]
    }[] = $state([])

    let editMode: { [id: number]: boolean } = $state({})
    let oldData: { [id: number]: (typeof apiData)[number] } = {}

    let editAbilitiesRow: (typeof apiData)[number] | null = $state(null)
    let editImage: {  [id: number]: HTMLInputElement } = $state({})
    let markedDeletionAbilities: Set<number> = new Set()

    function startEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = true
        oldData[row.id] = {...row}
    }

    async function saveEdit(row: (typeof apiData)[number]) {
        try {
            let out = await fetch(`/api/data?id=${row.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    "name": row.name,
                    "description": row.short_desc,
                    "author": row.author,
                    "full_desc": row.description
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (out.status == 401) location.reload()
            if (out.status != 200) throw new Error(await out.text())

            if (editImage[row.id]) {
                const imageList = editImage[row.id].files
                console.log(imageList)
                if (imageList && imageList.length > 0) {
                    const formData = new FormData()
                    formData.append("file", imageList[0])
                    out = await fetch(`/api/image?id=${row.id}`, {
                        method: "POST",
                        body: formData
                    })
                }
            }

            if (out.status == 401) location.reload()
            if (out.status != 200) throw new Error(await out.text())

            toast.success("Successfully saved Noiksona!")
            delete oldData[row.id]
            editMode[row.id] = false
        } catch (e) {
            toast.error(`Something has gone wrong while trying to update data! ${e}`)
        }

    }

    function cancelEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = false

        const old = oldData[row.id]
        if (old) {
            for (let i in row) {
                //@ts-ignore
                row[i] = oldData[row.id][i]
            }
        }
        delete oldData[row.id]
    }


    async function saveAbilitiesEdit() {
        try {
            for (let ability of (editAbilitiesRow?.abilities ?? [])) {
                let out = null
                if (isNaN(ability.id)) {
                    out = await fetch(`/api/data/abilities`, {
                        method: "POST",
                        body: JSON.stringify({
                            "name": ability.name,
                            "niko_id": ability.niko_id
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                } else {
                    out = await fetch(`/api/data/abilities?id=${ability.id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            "name": ability.name,
                            "niko_id": ability.niko_id
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                }

                if (out == null) continue
                if (out.status == 401) location.reload()
                if (out.status != 200) throw new Error(await out.text())
            }

            for (let deleteAbility of markedDeletionAbilities) {
                if (isNaN(deleteAbility)) continue
                let out = await fetch(`/api/data/abilities?id=${deleteAbility}`, {
                    method: "DELETE",
                })
                if (out.status == 401) location.reload()
                if (out.status != 200) throw new Error(await out.text())
            }
            toast.success(`Successfully saved ${editAbilitiesRow?.author}'s Abilities!`)
            editAbilitiesRow = null
            await getData()
        } catch (e) {
            toast.error(`Something has gone wrong while trying to update abilities! ${e}`)
        }
    }


    async function getData() {
        try {
            const dataRes = await fetch(`/api/data`)
            const noikData = await dataRes.json()
            apiData = []
            for (let d of noikData) {
                apiData.push({
                    id: d["id"],
                    name: d["name"],
                    author: d["author"],
                    description: d["full_desc"],
                    short_desc: d["description"],
                    abilities: d["abilities"],
                    img_link: d["image"]
                })
            }
        } catch (e) {

        }
    }

    async function deleteData(row: (typeof apiData)[number]) {
        if (!confirm(`Are you sure you want to delete "${row.name}" entries?`)) return
        try {
            const out = await fetch(`/api/data?id=${row.id}`, {
                method: "DELETE",
            })

            if (out.status == 401) location.reload()
            if (out.status != 200) throw new Error(await out.text())
            toast.success(`Successfully deleted ${row.name}'s Noiksona!`)
            delete oldData[row.id]
            apiData = apiData.filter((v) => v.id != row.id)
            editMode[row.id] = false
        } catch (e) {
            toast.error(`Something has gone wrong while trying to delete data! ${e}`)
        }
    }

    async function createData(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const btn = ev.target as HTMLButtonElement
        btn.disabled = true
        const data = {
            name: "placeholder",
            author: "placeholder",
            full_desc: "placeholder",
            description: "placeholder",
        }

        try {
            const out = await fetch("/api/data", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (out.status == 401) location.reload()
            if (out.status != 200) throw new Error(await out.text())
            toast.success("Successfully created a new entry!")
            await getData()
        } catch (e) {
            toast.error(`Something has gone wrong while trying to create data! ${e}`)
        }
        btn.disabled = false
    }

    onMount(async () => {
        await getData()
    })
</script>

<svelte:head>
    <title>admin :3</title>
</svelte:head>

<div class="xl:px-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Noik Entries</h2>
    <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
        <table class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full">
            <thead class="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-3 py-2">Name</th>
                    <th class="px-3 py-2">Image</th>
                    <th class="px-3 py-2">Author</th>
                    <th class="px-3 py-2">Short Description</th>
                    <th class="px-3 py-2">Full Description</th>
                    <th class="px-3 py-2 max-w-[128px]">Abilities</th>
                    <th class="px-3 py-2">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each apiData as noik}
                <tr class="text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                    <td class="px-3 py-2">
                        <input type="text" disabled={!editMode[noik.id]} bind:value={noik.name} class="w-full min-w-[80px]">
                    </td>
                    <td class="px-3 py-2">
                        <label>
                            Upload image by selecting an image file
                            <input type="file" disabled={!editMode[noik.id]} accept="image/*" onchange={(ev) => editImage[noik.id] = (ev.target as HTMLInputElement)}>
                        </label>
                        <br>
                        <button class="hover:cursor-pointer" disabled={!editMode[noik.id]} onclick={() => { if (editImage[noik.id]) editImage[noik.id].value = "" }}>[Clear selected]</button>
                        <a href="/api/image?id={noik.id}" target="_blank">[View image]</a>
                        <!-- <input type="text" disabled={!editMode[noik.id]} bind:value={noik.img_link} class="w-full min-w-[100px]"> -->
                    </td>
                    <td class="px-3 py-2">
                        <input type="text" disabled={!editMode[noik.id]} bind:value={noik.author} class="w-full min-w-[100px]">
                    </td>
                    <td class="px-3 py-2">
                        <input type="text" disabled={!editMode[noik.id]} bind:value={noik.short_desc} class="w-full min-w-[100px]">
                    </td>
                    <td class="px-3 py-2">
                        <textarea disabled={!editMode[noik.id]} bind:value={noik.description} class="w-full min-w-[400px]"></textarea>
                    </td>
                    <td class="">
                        <p>({noik.abilities.length} abilities)</p>
                        <button class="hover:cursor-pointer hover:text-white" onclick={() => { editAbilitiesRow = JSON.parse(JSON.stringify(noik)) }}>[Edit]</button>
                        <!-- <input type="text" disabled value="<to be implemented>"> -->
                    </td>
                    <td class="px-3 py-2">
                        {#if !editMode[noik.id]}
                        <button class="hover:cursor-pointer hover:text-white" onclick={() => { startEdit(noik) }}>[Edit]</button> /
                        <button class="hover:cursor-pointer hover:text-red-500" onclick={async () => { await deleteData(noik) }}>[Delete]</button>
                        {:else}
                        <button class="hover:cursor-pointer hover:text-green-500" onclick={async () => { await saveEdit(noik) }}>[Save]</button> /
                        <button class="hover:cursor-pointer hover:text-red-500" onclick={() => { cancelEdit(noik) }}>[Cancel]</button>
                        {/if}
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
        <button class="btn lg:w-60 sticky left-0" onclick="{async(ev) => { await createData( ev ) }}">Add Entry</button>
    </div>
    {#if editAbilitiesRow != null}
    <div class="fixed top-0 left-0 w-screen h-screen flex justify-center bg-black/65">
        <div class="w-full max-w-[1200px] flex flex-col gap-4 m-8 bg-slate-800 max-h-fit p-4 rounded-md">
            <div class="flex justify-between">
                <p>Editing {editAbilitiesRow?.name ?? "[unknown]"}'s Abitilies</p>
                <div>
                    <button class="hover:cursor-pointer hover:text-green-500" onclick={async () => { await saveAbilitiesEdit()  }}>[Save]</button> /
                    <button class="hover:cursor-pointer hover:text-red-500" onclick={() => { editAbilitiesRow = null }}>[Cancel]</button>
                </div>
            </div>
            <div class="overflow-x-auto flex flex-col gap-4">
                <table class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full max-w-[1200px]">
                    <thead class="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th class="px-3 py-2">Abilities</th>
                            <th class="px-3 py-2 w-[128px] max-w-[128px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each (editAbilitiesRow?.abilities ?? []) as ability}
                        <tr class="text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <td class="px-3 py-2">
                                <input type="text" bind:value={ability.name} class="w-full">
                            </td>
                            <td class="px-3 py-2">
                                <button class="hover:cursor-pointer hover:text-red-500" onclick={
                                    async () => {
                                        markedDeletionAbilities.add(
                                            editAbilitiesRow?.abilities.splice(
                                                editAbilitiesRow.abilities.findIndex(
                                                    v => v.id == ability.id
                                            ), 1)[0].id ?? NaN
                                        )}
                                }>[Delete]</button>
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                <button class="btn lg:w-60 sticky left-0" onclick="{async() => { editAbilitiesRow?.abilities.push({ id: NaN, name: "", niko_id: editAbilitiesRow.id }) }}">Add Ability</button>
            </div>
        </div>
    </div>
    {/if}
</div>