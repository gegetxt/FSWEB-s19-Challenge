import { useEffect, useState } from 'react';
import { createComment, deleteComment, getCommentsByTweetId, updateComment } from '../services/commentService';
import { getTweetById } from '../services/tweetService';
import { formatDate } from '../utils/format';

export default function CommentModal({ auth, tweetId, onClose, onTweetRefresh }) {
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTweet(null);
    setComments([]);
    setDraft('');
    setEditingId(null);
    setLoading(false);
    setSubmitting(false);
    setError('');
  }, [tweetId]);

  useEffect(() => {
    if (!tweetId || !auth) {
      return;
    }

    let ignore = false;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [tweetResponse, commentResponse] = await Promise.all([
          getTweetById(tweetId, auth),
          getCommentsByTweetId(tweetId, auth)
        ]);

        if (!ignore) {
          setTweet(tweetResponse);
          setComments(commentResponse);
        }

        onTweetRefresh(tweetResponse);
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [tweetId, auth, onTweetRefresh]);

  if (!tweetId) {
    return null;
  }

  async function submitComment() {
    if (!draft.trim()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateComment(editingId, { content: draft }, auth);
        setComments((current) => current.map((item) => (item.id === editingId ? updated : item)));
        setEditingId(null);
      } else {
        const created = await createComment({ tweetId, content: draft }, auth);
        setComments((current) => [...current, created]);
      }
      setDraft('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitComment();
  }

  async function handleDelete(commentId) {
    setSubmitting(true);
    setError('');
    try {
      await deleteComment(commentId, auth);
      setComments((current) => current.filter((item) => item.id !== commentId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = Boolean(draft.trim()) && !submitting;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-label">Detay</span>
            <h3>Yorumlar</h3>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Kapat
          </button>
        </div>

        {tweet ? (
          <div className="modal-tweet">
            <strong>@{tweet.username}</strong>
            <p>{tweet.content}</p>
          </div>
        ) : null}

        {error ? <div className="inline-error">{error}</div> : null}

        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Yorum yaz"
            maxLength={280}
          />
          <div className="button-row compact">
            {editingId ? (
              <button type="button" className="secondary-button" onClick={() => {
                setEditingId(null);
                setDraft('');
              }}>
                Iptal
              </button>
            ) : null}
              <button
                type="button"
                className={canSubmit ? 'primary-button comment-submit' : 'primary-button comment-submit inactive'}
                disabled={!canSubmit}
                onClick={() => void submitComment()}
            >
              {editingId ? 'Guncelle' : 'Yorum Yap'}
            </button>
          </div>
        </form>

        <div className="comment-list">
          {comments.length ? comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <div className="comment-meta">
                <strong>@{comment.username}</strong>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <p>{comment.content}</p>
              {comment.username === auth.username ? (
                <div className="button-row compact">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => {
                      setEditingId(comment.id);
                      setDraft(comment.content);
                    }}
                  >
                    Duzenle
                  </button>
                  <button type="button" className="ghost-button danger" onClick={() => handleDelete(comment.id)}>
                    Sil
                  </button>
                </div>
              ) : null}
            </div>
          )) : (
            <p className="modal-empty">Henuz yorum yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
