"use client";

import React from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

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
        onChange={({ file }) => {
          onChange?.(file);
        }}
        {...props}
      >
        {children}
      </Upload>
    </ImgCrop>
  );
}
