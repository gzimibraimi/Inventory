export default function SummaryWidgets({ summary }) {
  return (
    <section className="cards-row">
      <article className="card">
        <h3>Gjendja</h3>
        <p>Total paisje</p>
        <strong>{summary.total}</strong>
      </article>
      <article className="card">
        <h3>Lirë</h3>
        <p>Paisjet që mund t'i caktoni</p>
        <strong>{summary.available}</strong>
      </article>
      <article className="card">
        <h3>Të caktuara</h3>
        <p>Paisjet në dorë punëtori</p>
        <strong>{summary.assigned}</strong>
      </article>
    </section>
  )
}
