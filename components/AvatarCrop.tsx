"use client";

import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";

type Props = {
  onChange?: (fileOrDataUrl: File | string) => void;
  accept?: string;
};

export default function AvatarCrop({ onChange, accept = "image/*" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    // keep original file accessible; final emit after crop
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixelsParam: any) => {
    setCroppedAreaPixels(croppedAreaPixelsParam);
  }, []);

  const getCroppedImage = async (): Promise<string | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const size = Math.max(croppedAreaPixels.width, croppedAreaPixels.height);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // draw circular crop: we will crop square area then mask to circle
    ctx.save();
    // draw image portion
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      size,
      size
    );
    // create circular mask
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return canvas.toDataURL("image/png");
  };

  const applyCrop = async () => {
    const dataUrl = await getCroppedImage();
    if (!dataUrl) return;
    // convert to file
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "avatar.png", { type: blob.type });
    onChange?.(file);
    // clear UI
    setImageSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onFileChange}
        style={{ display: "block", marginBottom: 8 }}
      />
      {imageSrc && (
        <div style={{ position: "relative", width: 320, height: 320, background: "#333" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <button onClick={applyCrop}>Aplicar e Enviar</button>
            <button
              onClick={() => {
                setImageSrc(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// helpers
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}
