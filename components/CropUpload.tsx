"use client";

import React, { useState } from "react";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export interface CropUploadProps {
  className?: string;
  accept?: string;
  onChange?: (file: UploadFile) => void;
  size?: number; // 👈 controle de tamanho no Plasmic se quiser
}

export default function CropUpload({
  className,
  accept = "image/*",
  onChange,
  size = 96,
  ...props
}: CropUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleChange: UploadProps["onChange"] = ({ file }) => {
    // preview local imediato
    if (file.originFileObj) {
      const url = URL.createObjectURL(file.originFileObj);
      setImageUrl(url);
    }

    onChange?.(file);
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
          alt="preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <PlusOutlined />
      )}
    </div>
  );

  return (
    <ImgCrop
      showGrid
      showReset
      rotationSlider
      cropShape="round"
      modalOk="Recortar"
      modalCancel="Cancelar"
      resetText="Restablecer"
    >
      <Upload
        className={className}
        accept={accept}
        multiple={false}
        showUploadList={false}
        onChange={handleChange}
        {...props}
      >
        {uploadUI}
      </Upload>
    </ImgCrop>
  );
}
