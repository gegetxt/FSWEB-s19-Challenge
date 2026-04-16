import { useEffect, useMemo, useState } from 'react';
import LayoutShell from './components/LayoutShell';
import CommentModal from './components/CommentModal';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import usePersistentState from './hooks/usePersistentState';
import useSession from './hooks/useSession';
import { login, register } from './services/authService';
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  getTweetsByUserId,
  updateTweet
} from './services/tweetService';
import { dislikeTweet, likeTweet, removeRetweet, retweetTweet } from './services/interactionService';
import { getUserByUsername } from './services/userService';
import { buildHomeFeed, buildProfileFeed, filterFeedItems } from './utils/feed';

const initialBanner = {
  tone: 'neutral',
  title: '',
  message: ''
};

export default function App() {
  const { auth, loginUser, logoutUser, setCurrentUserId } = useSession();
  const [tweetCache, setTweetCache] = usePersistentState('tw_tweet_cache', {});
  const [activityLog, setActivityLog] = usePersistentState('tw_activity_log', []);
  const [reactionMap, setReactionMap] = usePersistentState('tw_reaction_map', {});
  const [banner, setBanner] = useState(initialBanner);
  const [homeQuery, setHomeQuery] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTweetId, setActiveTweetId] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const profileIndex = useMemo(() => buildProfileIndex(tweetCache, activityLog, auth), [tweetCache, activityLog, auth]);
  const route = useMemo(() => parseRoute(pathname, auth), [pathname, auth]);
  const currentView = route.name;
  const viewedUsername = route.username || auth?.username || '';

  const homeFeed = useMemo(() => {
    return filterFeedItems(buildHomeFeed(tweetCache, activityLog), homeQuery);
  }, [tweetCache, activityLog, homeQuery]);

  const profileFeed = useMemo(() => {
    if (!selectedProfileId) {
      return [];
    }

    return filterFeedItems(buildProfileFeed(selectedProfileId, tweetCache, activityLog), profileFilter);
  }, [selectedProfileId, profileFilter, tweetCache, activityLog]);

  useEffect(() => {
    if (!auth?.userId) {
      return;
    }

    void handleLoadGlobalFeed({ silent: true });
    void handleLoadUserTweets(auth.userId, { silent: true });
  }, [auth?.userId]);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!auth || currentView !== 'profile' || !viewedUsername) {
      return;
    }

    void handleLoadUserTweets(viewedUsername, { silent: true });
  }, [auth, currentView, viewedUsername]);

  async function handleRegister(form) {
    setSubmitting(true);
    try {
      const response = await register(form);
      setBanner({
        tone: 'success',
        title: 'Hesabin hazir',
        message: `${response.username} icin kayit tamamlandi. Simdi giris yapabilirsin.`
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Kayit tamamlanamadi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(form) {
    setSubmitting(true);
    try {
      const response = await login(form);
      loginUser({
        username: response.username,
        password: form.password,
        userId: response.userId ? String(response.userId) : null
      });
      navigateTo(authenticatedProfilePath(response.username), setPathname);
      setBanner({
        tone: 'success',
        title: 'Hos geldin',
        message: `${response.username} ile giris yapildi.`
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Giris yapilamadi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoadUserTweets(profileValue, options = {}) {
    if (!auth) {
      return;
    }

    let userId = resolveLocalProfileId(profileValue, profileIndex, auth);
    if (!userId) {
      try {
        const user = await getUserByUsername(String(profileValue).trim().replace(/^@+/, ''), auth);
        userId = String(user.id);
      } catch {
        userId = '';
      }
    }

    if (!userId) {
      if (!options.silent) {
        setBanner({
          tone: 'error',
          title: 'Profil bulunamadi',
          message: 'Bu isimle eslesen bir profil goremedik.'
        });
      }
      return;
    }

    setSelectedProfileId(String(userId));
    setLoadingFeed(true);
    try {
      const tweets = await getTweetsByUserId(userId, auth);
      setTweetCache((current) => ({
        ...current,
        [String(userId)]: tweets
      }));

      const ownedTweet = tweets.find((tweet) => tweet.username === auth.username);
      if (ownedTweet) {
        setCurrentUserId(String(ownedTweet.userId));
      }

      if (!options.silent) {
        setBanner({
          tone: 'success',
          title: 'Akis guncellendi',
          message: `${tweets.length} gonderi listelendi.`
        });
      }
    } catch (error) {
      if (!options.silent) {
        setBanner({
          tone: 'error',
          title: 'Akis yuklenemedi',
          message: error.message
        });
      }
    } finally {
      setLoadingFeed(false);
    }
  }

  async function handleLoadGlobalFeed(options = {}) {
    if (!auth) {
      return;
    }

    try {
      const tweets = await getAllTweets(auth);
      setTweetCache((current) => mergeTweetsIntoCache(current, tweets));

      if (!options.silent) {
        setBanner({
          tone: 'success',
          title: 'Akis yenilendi',
          message: `${tweets.length} gonderi gosteriliyor.`
        });
      }
    } catch (error) {
      if (!options.silent) {
        setBanner({
          tone: 'error',
          title: 'Akis yuklenemedi',
          message: error.message
        });
      }
    }
  }

  async function handleCreateTweet(content) {
    if (!auth) {
      return;
    }

    setSubmitting(true);
    try {
      const createdTweet = await createTweet({ content }, auth);
      setTweetCache((current) => {
        const key = String(createdTweet.userId);
        const nextTweets = [createdTweet, ...(current[key] ?? [])];
        return {
          ...current,
          [key]: dedupeTweets(nextTweets)
        };
      });
      setCurrentUserId(String(createdTweet.userId));
      setBanner({
        tone: 'success',
        title: 'Gonderi paylasildi',
        message: 'Yeni gonderin akisa eklendi.'
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Gonderi paylasilamadi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateTweet(tweetId, content) {
    if (!auth) {
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateTweet(tweetId, { content }, auth);
      patchTweet(updated);
      setBanner({
        tone: 'success',
        title: 'Gonderi guncellendi',
        message: 'Degisikliklerin kaydedildi.'
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Gonderi guncellenemedi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTweet(tweetId) {
    if (!auth) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteTweet(tweetId, auth);
      setTweetCache((current) => removeTweetFromCache(current, tweetId));
      setActivityLog((current) => current.filter((item) => item.tweet.id !== tweetId));
      setReactionMap((current) => removeReactionEntries(current, tweetId));
      setBanner({
        tone: 'success',
        title: 'Gonderi silindi',
        message: 'Gonderi akistan kaldirildi.'
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Gonderi silinemedi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleLike(tweet) {
    if (!auth) {
      return;
    }

    const reactionKey = buildReactionKey(auth.username, tweet.id, 'like');
    const hasLiked = Boolean(reactionMap[reactionKey]);

    setSubmitting(true);
    try {
      if (hasLiked) {
        await dislikeTweet(tweet.id, auth);
        setReactionMap((current) => removeReactionKey(current, reactionKey));
        setActivityLog((current) => current.filter((item) => item.id !== reactionKey));
        setBanner({
          tone: 'success',
          title: 'Begeni kaldirildi',
          message: 'Bu gonderi artik begendiklerinde gorunmeyecek.'
        });
      } else {
        await likeTweet(tweet.id, auth);
        const activity = buildActivity('like', auth, tweet, reactionKey);
        setReactionMap((current) => ({ ...current, [reactionKey]: true }));
        setActivityLog((current) => [activity, ...current.filter((item) => item.id !== reactionKey)]);
        setBanner({
          tone: 'success',
          title: 'Begendin',
          message: 'Gonderi begenilerin arasina eklendi.'
        });
      }
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Islem tamamlanamadi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleRetweet(tweet) {
    if (!auth) {
      return;
    }

    const reactionKey = buildReactionKey(auth.username, tweet.id, 'retweet');
    const hasRetweeted = Boolean(reactionMap[reactionKey]);

    setSubmitting(true);
    try {
      if (hasRetweeted) {
        await removeRetweet(tweet.id, auth);
        setReactionMap((current) => removeReactionKey(current, reactionKey));
        setActivityLog((current) => current.filter((item) => item.id !== reactionKey));
        setBanner({
          tone: 'success',
          title: 'Yeniden paylasim kaldirildi',
          message: 'Bu hareket akistan kaldirildi.'
        });
      } else {
        await retweetTweet(tweet.id, auth);
        const activity = buildActivity('retweet', auth, tweet, reactionKey);
        setReactionMap((current) => ({ ...current, [reactionKey]: true }));
        setActivityLog((current) => [activity, ...current.filter((item) => item.id !== reactionKey)]);
        setBanner({
          tone: 'success',
          title: 'Yeniden paylasildi',
          message: 'Gonderi kendi akisinla paylasildi.'
        });
      }
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Islem tamamlanamadi',
        message: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOpenTweet(tweetId) {
    if (!auth) {
      return;
    }

    try {
      const tweet = await getTweetById(tweetId, auth);
      patchTweet(tweet);
    } catch (error) {
      setBanner({
        tone: 'error',
        title: 'Detay yuklenemedi',
        message: error.message
      });
    } finally {
      setActiveTweetId(tweetId);
    }
  }

  function patchTweet(tweet) {
    setTweetCache((current) => {
      const next = {};
      let found = false;

      Object.entries(current).forEach(([key, tweets]) => {
        next[key] = tweets.map((entry) => {
          if (entry.id === tweet.id) {
            found = true;
            return tweet;
          }
          return entry;
        });
      });

      if (!found) {
        const ownerKey = String(tweet.userId);
        next[ownerKey] = [tweet, ...(next[ownerKey] ?? [])];
      }

      return next;
    });
  }

  function handleLogout() {
    logoutUser();
    navigateTo('/', setPathname);
    setBanner(initialBanner);
  }

  if (!auth) {
    return (
      <AuthPage
        auth={auth}
        loading={submitting}
        status={banner}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <>
      <LayoutShell
        auth={auth}
        currentView={currentView}
        onChangeView={(view) => {
          if (view === 'profile') {
            navigateTo(authenticatedProfilePath(auth.username), setPathname);
            return;
          }
          navigateTo('/', setPathname);
        }}
        onLogout={handleLogout}
      >
        {currentView === 'profile' ? (
          <ProfilePage
            auth={auth}
            status={banner}
            tweetsLoading={loadingFeed}
            viewedUsername={viewedUsername}
            selectedProfileId={selectedProfileId}
            profileFilter={profileFilter}
            profileFeed={profileFeed}
            busy={submitting}
            onProfileFilterChange={setProfileFilter}
            onCreateTweet={handleCreateTweet}
            onUpdateTweet={handleUpdateTweet}
            onDeleteTweet={handleDeleteTweet}
            onLike={handleToggleLike}
            onRetweet={handleToggleRetweet}
            reactionMap={reactionMap}
            onOpenProfile={(username) => navigateTo(profilePath(username), setPathname)}
            onOpenComments={handleOpenTweet}
          />
        ) : (
          <HomePage
            auth={auth}
            status={banner}
            tweetsLoading={loadingFeed}
            busy={submitting}
            query={homeQuery}
            feedItems={homeFeed}
            onQueryChange={setHomeQuery}
            onCreateTweet={handleCreateTweet}
            onUpdateTweet={handleUpdateTweet}
            onDeleteTweet={handleDeleteTweet}
            onLike={handleToggleLike}
            onRetweet={handleToggleRetweet}
            reactionMap={reactionMap}
            onOpenProfile={(username) => navigateTo(profilePath(username), setPathname)}
            onOpenComments={handleOpenTweet}
          />
        )}
      </LayoutShell>

      <CommentModal
        key={activeTweetId ?? 'closed'}
        auth={auth}
        tweetId={activeTweetId}
        onClose={() => setActiveTweetId(null)}
        onTweetRefresh={patchTweet}
      />
    </>
  );
}

function buildReactionKey(username, tweetId, type) {
  return `${type}:${username}:${tweetId}`;
}

function buildActivity(type, auth, tweet, activityId) {
  return {
    id: activityId,
    type,
    createdAt: new Date().toISOString(),
    actor: {
      username: auth.username,
      userId: auth.userId
    },
    tweet
  };
}

function dedupeTweets(tweets) {
  const map = new Map();
  tweets.forEach((tweet) => {
    map.set(tweet.id, tweet);
  });
  return Array.from(map.values()).sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function removeTweetFromCache(cache, tweetId) {
  return Object.fromEntries(
    Object.entries(cache).map(([key, tweets]) => {
      return [key, tweets.filter((tweet) => tweet.id !== tweetId)];
    })
  );
}

function removeReactionEntries(reactionMap, tweetId) {
  return Object.fromEntries(
    Object.entries(reactionMap).filter(([key]) => !key.endsWith(`:${tweetId}`))
  );
}

function removeReactionKey(reactionMap, targetKey) {
  return Object.fromEntries(
    Object.entries(reactionMap).filter(([key]) => key !== targetKey)
  );
}

function buildProfileIndex(tweetCache, activityLog, auth) {
  const index = {};

  if (auth?.username && auth?.userId) {
    index[normalizeProfileKey(auth.username)] = String(auth.userId);
  }

  Object.values(tweetCache)
    .flat()
    .forEach((tweet) => {
      if (tweet.username && tweet.userId) {
        index[normalizeProfileKey(tweet.username)] = String(tweet.userId);
      }
    });

  activityLog.forEach((activity) => {
    if (activity.actor?.username && activity.actor?.userId) {
      index[normalizeProfileKey(activity.actor.username)] = String(activity.actor.userId);
    }

    if (activity.tweet?.username && activity.tweet?.userId) {
      index[normalizeProfileKey(activity.tweet.username)] = String(activity.tweet.userId);
    }
  });

  return index;
}

function resolveLocalProfileId(value, profileIndex, auth) {
  const normalizedValue = String(value ?? '').trim();
  if (!normalizedValue) {
    return auth?.userId ? String(auth.userId) : '';
  }

  if (/^\d+$/.test(normalizedValue)) {
    return normalizedValue;
  }

  const normalizedKey = normalizeProfileKey(normalizedValue);
  if (profileIndex[normalizedKey]) {
    return profileIndex[normalizedKey];
  }

  if (auth?.username && normalizeProfileKey(auth.username) === normalizedKey && auth.userId) {
    return String(auth.userId);
  }

  return '';
}

function normalizeProfileKey(value) {
  return String(value ?? '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase();
}

function mergeTweetsIntoCache(currentCache, tweets) {
  const nextCache = { ...currentCache };

  tweets.forEach((tweet) => {
    const key = String(tweet.userId);
    const existing = nextCache[key] ?? [];
    const exists = existing.some((item) => item.id === tweet.id);
    nextCache[key] = exists ? existing.map((item) => (item.id === tweet.id ? tweet : item)) : [...existing, tweet];
    nextCache[key] = dedupeTweets(nextCache[key]);
  });

  return nextCache;
}

function parseRoute(pathname, auth) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (normalizedPath.startsWith('/profile/')) {
    const username = decodeURIComponent(normalizedPath.slice('/profile/'.length));
    return {
      name: 'profile',
      username: username || auth?.username || ''
    };
  }

  return {
    name: 'home',
    username: auth?.username || ''
  };
}

function profilePath(username) {
  return `/profile/${encodeURIComponent(username)}`;
}

function authenticatedProfilePath(username) {
  return profilePath(username);
}

function navigateTo(path, setPathname) {
  if (window.location.pathname === path) {
    setPathname(path);
    return;
  }

  window.history.pushState({}, '', path);
  setPathname(path);
}
