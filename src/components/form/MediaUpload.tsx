import * as React from "react";
import { ImagePlus, TriangleAlert, X } from "lucide-react";
import { formatSize, isTooLarge, prepareUploads } from "@/lib/image";
import { useAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

type Item = { file: File; url: string; portrait: boolean; video: boolean };

/**
 * Multi-file picker for photos AND videos. Thumbnails are laid out in a grid so
 * a partner can see at a glance what is already attached, and any image shot in
 * portrait is flagged — the office needs landscape.
 */
export function MediaUpload({
  files,
  onChange,
  invalid,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  invalid?: boolean;
}) {
  const theme = useAccent();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [items, setItems] = React.useState<Item[]>([]);

  React.useEffect(() => {
    const next = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      portrait: false,
      video: file.type.startsWith("video/"),
    }));
    setItems(next);

    // Measure images so portrait shots can be called out before submission.
    next.forEach((item, i) => {
      if (item.video) return;
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalHeight <= probe.naturalWidth) return;
        setItems((current) =>
          current.map((it, j) => (i === j ? { ...it, portrait: true } : it)),
        );
      };
      probe.src = item.url;
    });

    return () => next.forEach((item) => URL.revokeObjectURL(item.url));
  }, [files]);

  const portraitCount = items.filter((item) => item.portrait).length;
  const oversized = files.filter(isTooLarge);

  return (
    <div className="space-y-2.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={async (e) => {
          const picked = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!picked.length) return;
          setBusy(true);
          // Photos are shrunk; videos are kept as they are.
          onChange([...files, ...(await prepareUploads(picked))]);
          setBusy(false);
        }}
      />

      {items.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2">
          {items.map((item, i) => (
            <li key={`${item.file.name}-${i}`} className="relative">
              {item.video ? (
                <video
                  src={item.url}
                  className="aspect-square w-full rounded-lg object-cover"
                  muted
                />
              ) : (
                <img
                  src={item.url}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover"
                />
              )}
              {item.portrait ? (
                <span className="absolute bottom-1 left-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  VERTICAL
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Remove ${item.file.name}`}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className={cn(
                  "absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-110",
                  theme.fill,
                )}
              >
                <X className="size-3.5" strokeWidth={3} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-[15px] font-bold transition-all active:scale-[.99] dark:border-white/15",
          theme.soft,
          invalid && "border-rose-400",
        )}
      >
        <ImagePlus className="size-5" />
        {busy ? "Preparing…" : items.length ? "Add more" : "Add photos or videos"}
      </button>

      {items.length ? (
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          {items.length} attached
        </p>
      ) : null}

      {oversized.length ? (
        <p className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-[13px] leading-relaxed font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          <TriangleAlert className="mt-px size-4 shrink-0" />
          {oversized.map((f) => `${f.name} (${formatSize(f.size)})`).join(", ")} —{" "}
          {oversized.length === 1 ? "this is" : "these are"} over the 10 MB limit and will
          be rejected. Record a shorter clip or remove it.
        </p>
      ) : null}

      {portraitCount ? (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[13px] leading-relaxed font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
          <TriangleAlert className="mt-px size-4 shrink-0" />
          {portraitCount} {portraitCount === 1 ? "photo is" : "photos are"} vertical.
          Retake them with the phone sideways — the office needs landscape.
        </p>
      ) : null}
    </div>
  );
}
