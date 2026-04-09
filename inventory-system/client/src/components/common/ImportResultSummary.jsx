export default function ImportResultSummary({ importResult }) {
  if (!importResult) return null

  return (
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
  )
}
