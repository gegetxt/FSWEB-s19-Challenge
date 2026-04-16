export default function ActionBar({
  canEdit,
  liked,
  retweeted,
  onComment,
  onLike,
  onRetweet,
  onEdit,
  onDelete
}) {
  return (
    <div className="action-bar">
      <button type="button" className="ghost-button" onClick={onComment}>
        Yorumlar
      </button>
      <button type="button" className={liked ? 'ghost-button active' : 'ghost-button'} onClick={onLike}>
        {liked ? 'Begeniyi Geri Al' : 'Begen'}
      </button>
      <button type="button" className={retweeted ? 'ghost-button active' : 'ghost-button'} onClick={onRetweet}>
        {retweeted ? 'Geri Al' : 'Yeniden Paylas'}
      </button>
      {canEdit ? (
        <>
          <button type="button" className="ghost-button" onClick={onEdit}>
            Duzenle
          </button>
          <button type="button" className="ghost-button danger" onClick={onDelete}>
            Sil
          </button>
        </>
      ) : null}
    </div>
  );
}
