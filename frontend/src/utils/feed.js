export function buildHomeFeed(tweetCache, activityLog) {
  const tweets = Object.values(tweetCache)
    .flat()
    .map((tweet) => normalizeTweet(tweet));

  const merged = [...tweets, ...activityLog.map(normalizeActivity)];
  return sortFeed(merged);
}

export function buildProfileFeed(userId, tweetCache, activityLog) {
  const tweets = (tweetCache[String(userId)] ?? []).map((tweet) => normalizeTweet(tweet));
  const activities = activityLog
    .filter((item) => String(item.actor.userId ?? '') === String(userId))
    .map(normalizeActivity);

  return sortFeed([...tweets, ...activities]);
}

export function filterFeedItems(items, query) {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    const haystack = [
      item.actor.username,
      item.tweet.username,
      item.tweet.content,
      item.type
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

function normalizeTweet(tweet) {
  return {
    id: `tweet-${tweet.id}`,
    type: 'tweet',
    createdAt: tweet.createdAt,
    actor: {
      username: tweet.username,
      userId: tweet.userId
    },
    tweet
  };
}

function normalizeActivity(activity) {
  return {
    ...activity,
    tweet: activity.tweet
  };
}

function sortFeed(items) {
  return items.sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
