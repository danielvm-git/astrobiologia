export function useStoragePreviewUrl(
  fileId: MaybeRefOrGetter<string>,
  width = 800,
  height = 600
) {
  const config = useRuntimeConfig();

  return computed(() => {
    const id = toValue(fileId);
    if (!id) return "";
    if (id.startsWith("http")) return id;
    const endpoint = config.public.appwriteEndpoint.replace(/\/$/, "");
    const project = config.public.appwriteProjectId;
    const bucket = config.public.storageBucketId;
    return `${endpoint}/storage/buckets/${bucket}/files/${id}/preview?project=${project}&width=${width}&height=${height}`;
  });
}
