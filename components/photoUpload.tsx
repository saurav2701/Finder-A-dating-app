"use client";
import { supabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function PhotoUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const presignRes = await fetch("/api/photos/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: file.type, fileSize: file.size }),
      });
      if (!presignRes.ok) throw new Error("Could not get upload url");
      const { token, path } = await presignRes.json();

      //uploading to supabase with signed token
      const { error: uploadError } = await supabaseClient.storage
        .from("photos")
        .uploadToSignedUrl(path, token, file);

      if (uploadError) throw new Error("Upload failed");

      const confirmRes = await fetch("/api/photos/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });

      if (!confirmRes.ok) throw new Error("could not save Photo");
      const { photo } = await confirmRes.json();

      onUploaded(photo.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="bg-gray-500 rounded-2xl px-4 py-1 hover:text-white "
      />
      {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
