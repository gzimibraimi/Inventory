export default function ImportPanel({ file, onFileChange, onImport, onSeed, loading, message, importResult }) {
  return (
    <section className="panel">
      <h2>Import Excel</h2>
      <form className="import-form" onSubmit={onImport}>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <button type="submit" disabled={loading}>
          Importo
        </button>
      </form>
      <div className="button-group">
        <button type="button" className="small-button secondary-btn" onClick={onSeed} disabled={loading}>
          Shto Mostër të Dhënash
        </button>
      </div>
      <p className="hint">Pranohet Excel me kolonat: AssetID, InventoryNumber, AssetType, Brand, Model, EmployeeID, EmployeeName, Location, Floor, Office, Status, Notes</p>
      {message && <p className="message">{message}</p>}
      {importResult && (
        <div className="import-summary">
          <p>{importResult.inserted} të rejat importuan, {importResult.updated} u përditësuan, {importResult.skipped} u anashkaluan.</p>
          {importResult.errors?.length > 0 && (
            <div className="import-errors">
              <strong>Gabime importi:</strong>
              <ul>
                {importResult.errors.map((error) => (
                  <li key={error.row}>Rreshti {error.row}: {error.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
