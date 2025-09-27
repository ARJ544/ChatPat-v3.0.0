'use client';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useState } from 'react';

type DropZoneProps = {
  files: File[] | undefined;
  setFiles: (files: File[]) => void;
};

const DropZone = ({files, setFiles}:DropZoneProps) => {
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };
  return (
    <Dropzone
      accept={{ 'application/pdf': ['.pdf'] }}
      maxFiles={1}
      maxSize={1024 * 1024 * 15}
      minSize={1024}
      onDrop={handleDrop}
    //   onError={console.error}
      src={files}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};
export default DropZone;