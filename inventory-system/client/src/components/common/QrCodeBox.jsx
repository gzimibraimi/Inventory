import { QRCodeSVG } from "qrcode.react";

export default function QrCodeBox({ value }) {
  if (!value) return null;

  return (
    <div>
      <QRCodeSVG value={value} size={180} />
    </div>
  );
}