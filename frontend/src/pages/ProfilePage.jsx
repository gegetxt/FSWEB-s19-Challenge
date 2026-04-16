import Composer from '../components/Composer';
import EmptyState from '../components/EmptyState';
import FeedList from '../components/FeedList';
import SearchBar from '../components/SearchBar';
import SectionCard from '../components/SectionCard';
import StatusBanner from '../components/StatusBanner';

export default function ProfilePage({
  auth,
  status,
  tweetsLoading,
  viewedUsername,
  selectedProfileId,
  profileFilter,
  profileFeed,
  busy,
  onProfileFilterChange,
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
      <header className="page-header profile-header">
        <div>
          <span className="eyebrow">Profil</span>
          <h1>{viewedUsername}</h1>
          <p>
            {auth.username === viewedUsername
              ? 'Kendi paylasimlarini ve son hareketlerini burada gor.'
              : `${viewedUsername} tarafindan paylasilanlari burada gor.`}
          </p>
        </div>
      </header>

      <StatusBanner status={status} />

      <SectionCard title="Profil Akisi" eyebrow="Aktivite">
        <div className="profile-toolbar">
          <SearchBar
            compact
            label="Bu akista ara"
            value={profileFilter}
            placeholder="Paylasimlarda ara"
            onChange={onProfileFilterChange}
          />
        </div>

        {auth.userId && String(auth.userId) === String(selectedProfileId) ? (
          <Composer loading={busy} onSubmit={onCreateTweet} />
        ) : null}

        {profileFeed.length ? (
          <FeedList
            auth={auth}
            items={profileFeed}
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
            message="Bu hesap icin henuz gosterilecek bir paylasim bulunmuyor."
          />
        )}
      </SectionCard>
    </div>
  );
}
