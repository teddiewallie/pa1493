"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const ImagePicker = ({ onChange, current }) => {
  const [ file, setFile ] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onChange(file);
    setFile(file);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
      />
      <Button onClick={() => inputRef.current?.click()}>Select Image</Button>
      {file && <Image src={URL.createObjectURL(file)} alt="Preview" className="max-w-md" />}
      {!file && current && <Image src={current} className="max-w-md mx-auto" alt="Preview" />}
    </>
  );
}

export { ImagePicker };

