import { MAX_UPLOAD_BYTES } from "./jotform";

/** Long edge, in pixels. Plenty for the office to judge a cleaned area. */
const MAX_EDGE = 1600;
const QUALITY = 0.8;

/**
 * Shrinks a camera photo before it is uploaded. A modern phone shoots 4–12 MB
 * per shot, which is slow on site Wi-Fi and can exceed what Jotform accepts;
 * this brings a typical photo under half a megabyte with no visible loss.
 *
 * Anything that is not an image, or that fails to decode, is returned untouched.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    // `from-image` applies the EXIF rotation, so portrait shots stay upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

/** Runs every picked file through the compressor, keeping videos as they are. */
export async function prepareUploads(files: File[]) {
  return Promise.all(files.map(compressImage));
}

export function isTooLarge(file: File) {
  return file.size > MAX_UPLOAD_BYTES;
}

export function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}
