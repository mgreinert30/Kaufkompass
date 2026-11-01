"use client";

import * as React from "react";
import { Upload, X, FileText, ImageIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface UploadComponentProps {
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type === "application/pdf" || type.includes("text")) return FileText;
  return File;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadComponent({
  accept = "image/*,.pdf,.txt",
  maxSizeMB = 10,
  maxFiles = 5,
  onFilesChange,
  label = "Dokument hochladen",
  helperText,
  className,
}: UploadComponentProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function processFiles(incoming: FileList | null) {
    if (!incoming) return;
    setError(null);

    const newFiles: UploadedFile[] = [];
    for (const file of Array.from(incoming)) {
      if (files.length + newFiles.length >= maxFiles) {
        setError(`Maximal ${maxFiles} Dateien erlaubt.`);
        break;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`${file.name} ist zu groß. Maximal ${maxSizeMB} MB pro Datei.`);
        continue;
      }
      newFiles.push({ file, id: `${file.name}-${Date.now()}-${Math.random()}` });
    }

    const updated = [...files, ...newFiles];
    setFiles(updated);
    onFilesChange?.(updated.map((f) => f.file));
  }

  function removeFile(id: string) {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange?.(updated.map((f) => f.file));
    setError(null);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
      )}

      {/* Drop Zone */}
      <div
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-[var(--border)] hover:border-blue-400 hover:bg-[var(--muted)]"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        aria-label="Datei hochladen"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <Upload className="mb-3 h-8 w-8 text-[var(--muted-foreground)]" aria-hidden="true" />
        <p className="text-sm font-medium text-[var(--foreground)]">
          Hier klicken oder Dateien hierher ziehen
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {accept.replace(/[.*]/g, "").replace(/,/g, ", ")} · max. {maxSizeMB} MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="sr-only"
          onChange={(e) => processFiles(e.target.files)}
          aria-hidden="true"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600" role="alert">{error}</p>
      )}

      {/* Helper */}
      {helperText && !error && (
        <p className="text-xs text-[var(--muted-foreground)]">{helperText}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <ul className="space-y-2" aria-label="Hochgeladene Dateien">
          {files.map(({ file, id }) => {
            const Icon = getFileIcon(file.type);
            return (
              <li
                key={id}
                className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{file.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{formatBytes(file.size)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(id); }}
                  className="shrink-0 rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  aria-label={`${file.name} entfernen`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { UploadComponent };
