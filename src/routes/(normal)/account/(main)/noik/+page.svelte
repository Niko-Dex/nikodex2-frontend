<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import { fetchNikos } from "$lib/helper/helper";
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import type { Niko } from "$lib/types/nikosona";
    let loaded = $state(false);
    let apiData: Niko[] = $state([]);
    let { data }: PageProps = $props();
    onMount(async () => {
        apiData = await fetchNikos(data.currentUser?.id ?? -1);
        loaded = true;
    });
</script>

<div class="flex flex-col gap-4">
    <h2 class="h2-txt-size">Your Nikosona(s)</h2>
    {#if loaded}
        <CardContainer>
            {#each apiData as data (data.id)}
                <Card
                    abilities={data.abilities}
                    author={data.author}
                    description={data.full_desc}
                    name={data.name}
                    short_desc={data.description}
                    id={data.id}
                    author_id={data.author_id}
                    is_blacklisted={data.is_blacklisted}
                    edit_allow={true}
                    full_expand={true}
                />
            {/each}
        </CardContainer>
    {:else}
        <p><em>loading...</em></p>
    {/if}
</div>
