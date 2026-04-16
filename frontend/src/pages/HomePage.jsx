import Composer from '../components/Composer';
import EmptyState from '../components/EmptyState';
import FeedList from '../components/FeedList';
import SearchBar from '../components/SearchBar';
import SectionCard from '../components/SectionCard';
import StatusBanner from '../components/StatusBanner';

export default function HomePage({
  auth,
  status,
  tweetsLoading,
  busy,
  query,
  feedItems,
  onQueryChange,
  onCreateTweet,
  onUpdateTweet,
  onDeleteTweet,
  onLike,
  onRetweet,
  reactionMap,
  onOpenProfile,
  onOpenComments
}) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Ana Sayfa</span>
          <h1>Bugun neler oluyor?</h1>
        </div>
      </header>

      <StatusBanner status={status} />

      <SectionCard title="Bir seyler paylas" eyebrow="Yeni Gonderi">
        <Composer loading={busy} onSubmit={onCreateTweet} />
      </SectionCard>

      <SectionCard title="Akis" eyebrow="Kesfet">
        <div className="home-search-wrap">
          <SearchBar
            value={query}
            placeholder="Kullanici veya icerik ara"
            onChange={onQueryChange}
          />
        </div>

        {feedItems.length ? (
          <FeedList
            auth={auth}
            items={feedItems}
            loading={tweetsLoading}
            reactionMap={reactionMap}
            onOpenProfile={onOpenProfile}
            onUpdateTweet={onUpdateTweet}
            onDeleteTweet={onDeleteTweet}
            onLike={onLike}
            onRetweet={onRetweet}
            onOpenComments={onOpenComments}
          />
        ) : (
          <EmptyState
            title="Su an gosterilecek bir sey yok"
            message="Akis hareketlenince yeni gonderiler burada gorunecek."
          />
        )}
      </SectionCard>
    </div>
  );
}
