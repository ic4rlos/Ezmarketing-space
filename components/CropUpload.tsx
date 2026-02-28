"use client";

import React from "react";
import { Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";

export interface CropUploadProps {
  className?: string;
  accept?: string;
  onChange?: (file: UploadFile) => void;
  children?: React.ReactNode;
}

export default function CropUpload({
  className,
  accept = "image/*",
  onChange,
  children,
  ...props
}: CropUploadProps) {
  const defaultUI = (
    <div
      style={{
        width: 96,
        height: 96,
        border: "1px dashed #d9d9d9",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: "#fafafa",
      }}
    >
      <PlusOutlined />
    </div>
  );

  return (
    <Upload
      className={className}
      accept={accept}
      multiple={false}
      showUploadList={false}
      onChange={({ file }) => {
        onChange?.(file);
      }}
      {...props}
    >
      {children || defaultUI}
    </Upload>
  );
}
