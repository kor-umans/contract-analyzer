"use client";

import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onFile: (base64: string, filename: string) => void;
  disabled?: boolean;
}

type ZoneState = "idle" | "dragover" | "error";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix — API expects raw base64
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadZone({ onFile, disabled = false }: UploadZoneProps) {
  const [state, setState] = useState<ZoneState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setErrorMsg(`"${file.name}" is geen PDF. Upload alleen PDF-bestanden.`);
        setState("error");
        return;
      }
      setErrorMsg("");
      setState("idle");
      const base64 = await toBase64(file);
      onFile(base64, file.name);
    },
    [onFile]
  );

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setState("dragover");
    },
    [disabled]
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setState("idle");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const onClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const zoneClass = [
    "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-all duration-200 select-none",
    disabled
      ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50"
      : state === "dragover"
      ? "cursor-copy border-blue-500 bg-blue-50 scale-[1.01]"
      : state === "error"
      ? "cursor-pointer border-red-400 bg-red-50"
      : "cursor-pointer border-neutral-300 bg-white hover:border-blue-400 hover:bg-blue-50/40",
  ].join(" ");

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="PDF uploaden"
      className={zoneClass}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" || e.key === " " ? onClick() : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={onChange}
        disabled={disabled}
        tabIndex={-1}
      />

      {/* Icon */}
      <div
        className={[
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-200",
          state === "dragover"
            ? "bg-blue-100 text-blue-600"
            : state === "error"
            ? "bg-red-100 text-red-500"
            : "bg-neutral-100 text-neutral-400",
        ].join(" ")}
      >
        {state === "dragover" ? (
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        ) : state === "error" ? (
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
        ) : (
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="space-y-1">
        {state === "error" ? (
          <>
            <p className="text-sm font-semibold text-red-600">Ongeldig bestandstype</p>
            <p className="text-sm text-red-500">{errorMsg}</p>
            <p className="mt-2 text-xs text-neutral-400">Klik om opnieuw te proberen</p>
          </>
        ) : state === "dragover" ? (
          <p className="text-sm font-semibold text-blue-600">Laat los om te uploaden</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-neutral-700">
              Sleep je contract hierheen
            </p>
            <p className="text-sm text-neutral-400">
              of{" "}
              <span className="font-medium text-blue-600 underline underline-offset-2">
                kies een bestand
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">Alleen PDF — max. 32 MB</p>
          </>
        )}
      </div>
    </div>
  );
}
