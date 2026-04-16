import { useEffect, useState } from "react";
import httpClient from "../../api/httpClient";
import QrCodeBox from './QrCodeBox';

export default function ItemDetailModal({
  itemId,
  onClose,
  onAssign,
  onReturn
}) {
  const [item, setItem] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Load item + QR
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // fetch item details
        const itemRes = await httpClient.get(`/api/inventory/${itemId}`);
        const itemData = itemRes.data?.data;
        setItem(itemData);

        // fetch QR data
        const qrRes = await httpClient.get(`/api/inventory/${itemId}/qr`);
        setQrValue(qrRes.data?.data?.code || "");

      } catch (err) {
        console.error("Failed to load item:", err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      loadData();
    }
  }, [itemId]);

  if (!itemId) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <h2>📦 Detajet e Paisjes</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {loading ? (
            <p>Po ngarkohet...</p>
          ) : item ? (
            <>
              <div className="item-details">
                <p><strong>Emri:</strong> {item.name}</p>
                <p><strong>Inventory Nr:</strong> {item.inventory_number}</p>
                <p><strong>Brand:</strong> {item.brand || "-"}</p>
                <p><strong>Model:</strong> {item.model || "-"}</p>
                <p><strong>Kategori:</strong> {item.category || "-"}</p>
                <p><strong>Zyra:</strong> {item.office || "-"}</p>
                <p><strong>Lokacion:</strong> {item.location || "-"}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Punëtor:</strong> {item.assigned_to || "—"}</p>
              </div>

              {/* 🔳 QR CODE */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <h3>QR Code</h3>
                <QrCodeBox value={qrValue} />
                <p style={{ marginTop: "10px" }}>
                  {qrValue}
                </p>
              </div>
            </>
          ) : (
            <p>Nuk u gjet paisja</p>
          )}
        </div>

        {/* FOOTER */}
        {item && (
          <div className="modal-footer">
            <button
              onClick={() => onAssign(item)}
              disabled={item.status === "active"}
            >
              👤 Cakto
            </button>

            <button
              onClick={() => onReturn(item)}
              disabled={item.status !== "active"}
            >
              🔄 Liro
            </button>

            <button onClick={onClose}>Mbyll</button>
          </div>
        )}
      </div>
    </div>
  );
}