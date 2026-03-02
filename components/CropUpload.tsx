"use client";

import React, { useState } from "react";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "../lib/c-supabaseClient";

export interface CropUploadProps {
  className?: string;
  accept?: string;
  onChange?: (url: string) => void;
  size?: number;
}

export default function CropUpload({
  className,
  accept = "image/*",
  onChange,
  size = 96,
  ...props
}: CropUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange: UploadProps["onChange"] = async ({ file }) => {
    if (!file.originFileObj) return;

    try {
      setUploading(true);

      // 🔹 nome único
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // 🔹 upload
      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file.originFileObj, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 🔹 pegar URL pública
      const { data } = supabase.storage
        .from("company-logos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // preview imediato
      setImageUrl(publicUrl);

      // 🔥 envia para Plasmic
      onChange?.(publicUrl);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const uploadUI = (
    <div
      style={{
        width: size,
        height: size,
        border: "1px dashed #d9d9d9",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        background: "#fafafa",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : uploading ? (
        "..."
      ) : (
        <PlusOutlined />
      )}
    </div>
  );

  return (
    <ImgCrop cropShape="round" showGrid rotationSlider>
      <Upload
        className={className}
        accept={accept}
        multiple={false}
        showUploadList={false}
        beforeUpload={() => false}   // ⭐ ESSENCIAL
        onChange={handleChange}
        {...props}
      >
        {uploadUI}
      </Upload>
    </ImgCrop>
  );
}
