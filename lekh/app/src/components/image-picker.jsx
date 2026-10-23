// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

/* eslint @next/next/no-img-element: "off" */
"use client";

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
      {file && <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-md" />}
      {!file && current && <img src={current} className="max-w-md mx-auto" alt="Preview" />}
    </>
  );
}

export { ImagePicker };

