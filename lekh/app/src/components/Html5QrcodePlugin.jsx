"use client";

import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrcodePlugin = ({
  scan,
  fps = 10,
  qrbox = 250,
  disableFlip = false,
  qrCodeSuccessCallback
}) => {
    useEffect(() => {
        if (!scan) {
            return;
        }

        const scanner = new Html5Qrcode("qr-reader");

        let mounted = true;
        let running = false;

        const startScanner = async () => {
            try {
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps,
                        qrbox,
                        disableFlip
                    },
                    qrCodeSuccessCallback,
                    () => {
                        // Ignore failed scans
                    }
                );

                running = true;

                if (!mounted) {
                    await scanner.stop().catch(() => {});
                    scanner.clear();
                }
            } catch (err) {
                if (mounted) {
                    console.error("Failed to start scanner:", err);
                }
            }
        };

        startScanner();

        return () => {
            mounted = false;

            if (running) {
                scanner
                    .stop()
                    .then(() => scanner.clear())
                    .catch(() => {});
            }
        };
    }, [scan]);

    return (<div id="qr-reader" />);
}

export { Html5QrcodePlugin };

