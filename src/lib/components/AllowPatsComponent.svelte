<script lang="ts">
    let { is_blacklisted = $bindable() }: { is_blacklisted: boolean } =
        $props();
</script>

<div>
    <div class="flex flex-row items-center gap-5">
        <input
            name="is_blacklisted"
            class="chckbox"
            type="checkbox"
            bind:checked={is_blacklisted}
        />
        <p>Do Not Allow Pats?</p>
    </div>
    <p>
        <em>This will not allow any user to pat your Noik.</em>
    </p>
</div>
