export default defineNuxtRouteMiddleware(async () => {
  const localePath = useLocalePath();

  try {
    await $fetch("/api/me", { method: "GET" });
    return;
  } catch {
    return navigateTo(localePath("/admin/login"));
  }
});
