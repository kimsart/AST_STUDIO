const MAX_FILE_MB = 5;
const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.82;

/**
 * Compress a File to a JPEG data URL capped at MAX_WIDTH px wide.
 * Drop-in swap point for future S3/Amplify Storage upload:
 *   replace this function's body with an upload call and return the CDN URL.
 */
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      reject(new Error(`Image is too large. Please use a file under ${MAX_FILE_MB} MB.`));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Image load failed")); };
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.src = objectUrl;
  });
}
