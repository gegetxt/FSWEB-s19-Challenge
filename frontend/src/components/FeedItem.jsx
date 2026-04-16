import { useState } from 'react';
import ActionBar from './ActionBar';
import { formatActivityLabel, formatDate } from '../utils/format';

export default function FeedItem({
  auth,
  item,
  reactionMap,
  onOpenProfile,
  onUpdateTweet,
  onDeleteTweet,
  onLike,
  onRetweet,
  onOpenComments
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(item.tweet.content);
  const isOwner = item.tweet.username === auth.username;
  const likeKey = `like:${auth.username}:${item.tweet.id}`;
  const retweetKey = `retweet:${auth.username}:${item.tweet.id}`;

  async function handleSave() {
    await onUpdateTweet(item.tweet.id, draft);
    setIsEditing(false);
  }

  return (
    <article className="feed-item">
      <div className="feed-item-top">
        <div className="feed-item-meta">
          <span className={`type-pill ${item.type}`}>{item.type === 'tweet' ? 'Gonderi' : item.type === 'like' ? 'Begeni' : 'Yeniden Paylasim'}</span>
          <strong>
            <button type="button" className="user-link" onClick={() => onOpenProfile(item.actor.username)}>
              {item.actor.username}
            </button>
            {' '}
            {formatActivityLabel(item)}
          </strong>
        </div>
        <span className="item-date">{formatDate(item.createdAt)}</span>
      </div>

      <div className="feed-item-content">
        <div className="tweet-owner-row">
          <button type="button" className="user-link" onClick={() => onOpenProfile(item.tweet.username)}>
            {item.tweet.username}
          </button>
          <span>Gonderi #{item.tweet.id}</span>
        </div>

        {isEditing ? (
          <div className="edit-stack">
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={280} />
            <div className="button-row compact">
              <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
                Vazgec
              </button>
              <button type="button" className="primary-button" onClick={handleSave}>
                Kaydet
              </button>
            </div>
          </div>
        ) : (
          <p>{item.tweet.content}</p>
        )}
      </div>

      <ActionBar
        canEdit={isOwner}
        liked={Boolean(reactionMap[likeKey])}
        retweeted={Boolean(reactionMap[retweetKey])}
        onComment={() => onOpenComments(item.tweet.id)}
        onLike={() => onLike(item.tweet)}
        onRetweet={() => onRetweet(item.tweet)}
        onEdit={() => setIsEditing(true)}
        onDelete={() => onDeleteTweet(item.tweet.id)}
      />
    </article>
  );
}
