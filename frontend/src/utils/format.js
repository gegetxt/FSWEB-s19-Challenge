export function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('tr-TR');
}

export function formatActivityLabel(item) {
  if (item.type === 'like') {
    return 'bu gonderiyi begendi';
  }

  if (item.type === 'retweet') {
    return 'bunu yeniden paylasti';
  }

  return 'yeni bir gonderi paylasti';
}
