<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: ["admin"] });
</script>

<template>
  <section>
    <h1 class="text-2xl font-black">
      {{ $t("admin_settings_document_title") }}
    </h1>
    <p class="mt-3 text-slate-600">{{ $t("wip_body") }}</p>
  </section>
</template>
