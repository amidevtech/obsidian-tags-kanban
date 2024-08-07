<script lang="ts">
  export let variable: number;
  export let title: string;
</script>

<h1>{title}</h1>

<div class="number">
  <span>My number is {variable}!</span>
</div>

<style>
  .number {
    color: red;
  }
</style>
