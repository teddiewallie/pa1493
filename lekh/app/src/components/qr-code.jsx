import QRCodeLib from "react-qr-code";

const QRCode = ({ className, value }) => (
  <>
    <QRCodeLib {...{ className, value }} />
  </>
);

export { QRCode };
