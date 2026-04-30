function FormCard({ title, description, children }) {
  return (
    <section className="card">
      <div className="card-header">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default FormCard;
