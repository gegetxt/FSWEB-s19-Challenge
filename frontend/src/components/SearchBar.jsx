export default function SearchBar({
  label,
  value,
  placeholder,
  onChange,
  buttonLabel,
  onSubmit,
  compact = false
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.();
  }

  return (
    <div className={compact ? 'search-field compact' : 'search-field'}>
      {label ? <label className="search-label">{label}</label> : null}
      <form className={compact ? 'search-row compact' : 'search-row'} onSubmit={handleSubmit}>
        <div className={compact ? 'search-bar compact' : 'search-bar'}>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        </div>
        {buttonLabel ? (
          <button type="submit" className="inline-button">
            {buttonLabel}
          </button>
        ) : null}
      </form>
    </div>
  );
}
