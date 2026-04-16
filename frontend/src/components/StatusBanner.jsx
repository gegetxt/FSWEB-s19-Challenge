export default function StatusBanner({ status }) {
  if (!status.title && !status.message) {
    return null;
  }

  return (
    <div className={`status-banner ${status.tone}`}>
      <strong>{status.title}</strong>
      <p>{status.message}</p>
    </div>
  );
}
