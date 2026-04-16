import { useState } from 'react';

export default function Composer({ loading, onSubmit }) {
  const [content, setContent] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    await onSubmit(content.trim());
    setContent('');
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Aklindan geceni yaz"
        maxLength={280}
      />
      <div className="composer-footer">
        <span>{content.length}/280</span>
        <button type="submit" className="primary-button" disabled={loading || !content.trim()}>
          Paylas
        </button>
      </div>
    </form>
  );
}
