"use client";

import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = ({ value, onChange }) => {
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const handleChange = () => {
      setSmallScreen(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <MDEditor
      value={value}
      onChange={onChange}
      hideToolbar
      visibleDragbar={false}
      preview={smallScreen ? "edit" : "live"}
      height="100%"
      style={{
        "--md-editor-background-color": "hsl(var(--background))"
      }}
    />
  );
};

export { MarkdownEditor };
