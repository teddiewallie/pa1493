"use client"

import { useState } from "react";
import { Html5QrcodePlugin } from "./Html5QrcodePlugin";

const Html5QrcodeWrapper = ({onScan}) => {
  const [scan, setScan] = useState(true);

  const qrCodeSuccessCallback = (serial) => {
    onScan(serial);
  };

  return (
    <div className="relative h-screen w-full">
      <div className="absolute left-1/2 top-1/4 w-[min(100vw-2rem,500px)] -translate-x-1/2 -translate-y-1/2">
        {scan && (
          <Html5QrcodePlugin
            fps={10}
            qrbox={260}
            disableFlip={false}
            qrCodeSuccessCallback={qrCodeSuccessCallback}
            scan={scan}
          />
        )}
      </div>
    </div>
  );
};

export { Html5QrcodeWrapper };

