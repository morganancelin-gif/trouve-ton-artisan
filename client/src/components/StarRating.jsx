function StarRating({ note }) {
  const rating = parseFloat(note);
  const percentage = Math.max(0, Math.min(100, (rating / 5) * 100));
  const formatted = rating.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <span className="d-inline-flex align-items-center gap-2">
      {/* Décoratif : les étoiles ne portent pas l'information, le texte caché ci-dessous le fait */}
      <span className="position-relative d-inline-block" style={{ lineHeight: 1 }} aria-hidden="true">
        <span style={{ color: '#d3d1c7' }}>★★★★★</span>
        <span
          className="position-absolute top-0 start-0 overflow-hidden text-nowrap"
          style={{ width: `${percentage}%`, color: '#EF9F27' }}
        >
          ★★★★★
        </span>
      </span>

      {/* Accessible : un lecteur d'écran annonce la note exacte, pas des symboles graphiques */}
      <span className="visually-hidden">Note : {formatted} sur 5</span>
      <span aria-hidden="true" className="small text-secondary">{formatted}</span>
    </span>
  );
}

export default StarRating;
