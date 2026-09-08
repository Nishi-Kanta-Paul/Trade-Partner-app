import * as React from "react";
import { ImagePlus, RotateCcw, TriangleAlert, X } from "lucide-react";
import { compressImage } from "@/lib/image";
import { useAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

/**
 * Single-photo upload.
 *
 * Deliberately no `capture` attribute: it forces the camera app, and several
 * Android browsers then offer no gallery at all or hand back nothing. Without
 * it the OS shows its own sheet — camera, gallery, files — which is both more
 * reliable and closer to how crews work, shooting as they go and uploading
 * afterwards.
 *
 * The office needs landscape shots, so the picked image is measured and the
 * partner is told straight away if the phone was held upright.
 */
export function PhotoUpload({
  file,
  onChange,
  invalid,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  invalid?: boolean;
}) {
  const theme = useAccent();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [portrait, setPortrait] = React.useState(false);

  React.useEffect(() => {
    if (!file) {
      setPreview(null);
      setPortrait(false);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);

    const probe = new Image();
    probe.onload = () => setPortrait(probe.naturalHeight > probe.naturalWidth);
    probe.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="space-y-2.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const input = e.target;
          const picked = input.files?.[0];
          if (!picked) return;

          setBusy(true);
          // Shrink before it goes anywhere — a raw camera shot is 4–12 MB.
          onChange(await compressImage(picked));
          setBusy(false);

          // Reset last: clearing it first drops the file's data on some browsers,
          // and it has to be cleared at all so re-picking the same photo fires.
          input.value = "";
        }}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/12">
          <img
            src={preview}
            alt="Uploaded"
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove photo"
            className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <X className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-navy flex w-full items-center justify-center gap-2 border-t border-slate-200 bg-white py-3 text-[14px] font-bold transition-colors hover:bg-slate-50 dark:border-white/12 dark:bg-white/[.04] dark:text-white"
          >
            <RotateCcw className="size-4" />
            Replace photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 transition-all active:scale-[.99] dark:border-white/15",
            theme.soft,
            invalid && "border-rose-400",
          )}
        >
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-full text-white shadow-md",
              theme.fill,
            )}
          >
            <ImagePlus className="size-6" />
          </span>
          <span className="text-navy text-[15px] font-bold dark:text-white">
            {busy ? "Preparing…" : "Upload a photo"}
          </span>
          <span className="text-[13px] text-slate-500 dark:text-slate-400">
            {busy ? "Getting it ready to send" : "From your gallery, or take one now"}
          </span>
        </button>
      )}

      {portrait ? (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[13px] leading-relaxed font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
          <TriangleAlert className="mt-px size-4 shrink-0" />
          This photo is vertical. Turn the phone sideways and retake it — the office needs
          landscape shots.
        </p>
      ) : null}
    </div>
  );
}
