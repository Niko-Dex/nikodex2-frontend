<script lang="ts">
  import { onMount } from "svelte";
  import toast from "svelte-french-toast"
  let currentSubmissions: {
    id: number,
    user_id: number,
    name: string,
    description: string,
    full_desc: string,
    image: string
  }[] = $state([])
  async function getAllPendingSubmissions(){
    const fetchData = fetch("/api/data/submissions")
    .then(async r => {
        const jsonData = await r.json()
        console.log(jsonData)
        currentSubmissions = jsonData;
    })
    await toast.promise(fetchData, {
        loading: "Loading Submissions...",
        success: "Loaded Submissions!",
        error: "Failed to load Submissions!"
    })
  }
  onMount(() => {
    getAllPendingSubmissions()
  })
</script>

<div class="xl:px-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Submissions</h2>
    <p>We currently have {currentSubmissions.length} submissions.</p>
    <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
            <table class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full">
                <thead class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-3 py-2">ID</th>
                        <th class="px-3 py-2">USER ID</th>
                        <th class="px-3 py-2">NAME</th>
                        <th class="px-3 py-2">DESCRIPTION</th>
                    </tr>
                </thead>
                <tbody>
                    {#each currentSubmissions as currentSubmission}
                        <tr class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <td class="px-3 py-2">
                                <span class="lg:hidden">ID:</span>
                                <span>{currentSubmission.id}</span>
                            </td>
                            <td class="px-3 py-2">
                                <span class="lg:hidden">USER ID:</span>
                                <span>{currentSubmission.user_id}</span>
                            </td>
                            <td class="px-3 py-2">
                                <span class="lg:hidden">NAME:</span>
                                <span>{currentSubmission.name}</span>
                            </td>
                            <td class="px-3 py-2">
                                <span class="lg:hidden">DESCRIPTION:</span>
                                <span>{currentSubmission.description}</span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
</div>