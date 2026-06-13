import type { ChangeEvent } from "react";
import { ImageIcon, UploadCloud } from "lucide-react";

type ImageUploadFieldProps = {
  fileName?: string;
  isUploading: boolean;
  label: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string;
  readyText: string;
  remoteUrl: string;
  uploadText: string;
  urlPlaceholder: string;
  uploadingText: string;
};

export function ImageUploadField({
  fileName,
  isUploading,
  label,
  onFileChange,
  onUrlChange,
  previewUrl,
  readyText,
  remoteUrl,
  uploadText,
  urlPlaceholder,
  uploadingText,
}: ImageUploadFieldProps) {
  return (
    <div className="min-w-0 flex-1">
      <span className="text-sm font-bold text-neutral-800">{label}</span>
      <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-black/15 px-3 text-sm font-semibold text-neutral-600 transition hover:border-red-300 hover:bg-red-50">
        <span className="inline-flex min-w-0 items-center gap-2">
          <UploadCloud className="h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
          <span className="truncate">{isUploading ? uploadingText : uploadText}</span>
        </span>
        {previewUrl ? <ImageIcon className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" /> : null}
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFileChange} disabled={isUploading} className="sr-only" />
      </label>
      <input
        type="url"
        value={remoteUrl}
        onChange={onUrlChange}
        placeholder={urlPlaceholder}
        disabled={isUploading}
        className="mt-2 min-h-11 w-full rounded-md border border-black/10 px-3 text-sm font-semibold outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-neutral-50"
      />
      {previewUrl ? (
        <div className="mt-2 flex items-center gap-3 rounded-md border border-black/10 bg-neutral-50 p-2">
          <span
            aria-hidden="true"
            className="h-16 w-16 shrink-0 rounded-md border border-black/10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${previewUrl}")` }}
          />
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold text-neutral-800">{fileName ?? readyText}</span>
            {remoteUrl ? (
              <a href={remoteUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs font-semibold text-red-700 hover:text-red-800">
                {remoteUrl}
              </a>
            ) : (
              <span className="mt-1 block text-xs font-semibold text-neutral-500">{readyText}</span>
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
}
