import { usePreview } from "@/lib/preview";

const files = import.meta.glob("../videos/*.{mp4,vtt,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function fileFor(id: string, ext: string, preview: boolean) {
  return (
    files[`../videos/${id}.${ext}`] ?? (preview ? files[`../videos/${id}-test.${ext}`] : undefined)
  );
}

export type SignVideo = { src: string; poster?: string | undefined; captions?: string | undefined };

export function useSignVideo(id: string): SignVideo | null {
  const preview = usePreview();
  const src = fileFor(id, "mp4", preview);
  if (!src) return null;
  return { src, poster: fileFor(id, "jpg", preview), captions: fileFor(id, "vtt", preview) };
}
