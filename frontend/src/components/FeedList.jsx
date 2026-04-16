import EmptyState from './EmptyState';
import FeedItem from './FeedItem';

export default function FeedList({
  auth,
  items,
  loading,
  reactionMap,
  onOpenProfile,
  onUpdateTweet,
  onDeleteTweet,
  onLike,
  onRetweet,
  onOpenComments
}) {
  if (loading) {
    return <EmptyState title="Yukleniyor" message="Feed verileri backend uzerinden aliniyor." />;
  }

  if (!items.length) {
    return <EmptyState title="Su an gosterilecek bir sey yok" message="Feed olusunca burada listelenecek." />;
  }

  return (
    <div className="feed-list">
      {items.map((item) => (
        <FeedItem
          key={item.id}
          auth={auth}
          item={item}
          reactionMap={reactionMap}
          onOpenProfile={onOpenProfile}
          onUpdateTweet={onUpdateTweet}
          onDeleteTweet={onDeleteTweet}
          onLike={onLike}
          onRetweet={onRetweet}
          onOpenComments={onOpenComments}
        />
      ))}
    </div>
  );
}
