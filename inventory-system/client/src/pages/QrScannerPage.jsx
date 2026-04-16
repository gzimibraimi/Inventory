import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import httpClient from "../api/httpClient";

export default function QrScannerPage() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 }
    );

    scanner.render(async (decodedText) => {
      try {
        const res = await httpClient.get(
          `/api/inventory?inventory_number=${decodedText}`
        );

        if (res.data.data.length > 0) {
          alert(`✅ FOUND: ${decodedText}`);
        } else {
          alert(`❌ UNKNOWN: ${decodedText}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => scanner.clear();
  }, []);

  return (
    <div className="page-content">
      <h1>📷 QR Scanner</h1>
      <div id="qr-reader" />
    </div>
  );
}