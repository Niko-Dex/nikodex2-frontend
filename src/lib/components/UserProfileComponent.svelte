<script lang="ts">
    import UnmigratedWarningIcon from "$lib/assets/images/page/account/unmigrated_warning_icon.png";
    let {
        username,
        id,
        subtext,
    }: { username: string; id: number; subtext?: string } = $props();
</script>

{#if username}
    <div class="flex flex-row items-center gap-4">
        <a
            class="w-fit no-underline px-1 h-fit mt-auto flex items-center gap-4 transition group"
            href={id != undefined ? "/account/" + username : "#"}
        >
            {#if id >= 0}
                <img
                    src="/api/data/user/pfp?id={id}"
                    class="w-16 h-16"
                    alt="Profile picture of {username}"
                />
            {/if}
            <div class="flex flex-col">
                <span class="underline">{username}</span>

                {#if id == undefined}
                    <span class="flex flex-row items-center gap-2">
                        <img
                            src={UnmigratedWarningIcon}
                            alt="a"
                            class="w-4 h-4"
                        />
                        <em>(Unmigrated account)</em>
                    </span>
                {/if}
                <span class="small-txt-size">{subtext}</span>
            </div>
        </a>
    </div>
{:else}
    <em>Invalid Profile</em>
{/if}
