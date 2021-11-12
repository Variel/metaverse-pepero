export const humanizeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) {
    return '몇 초';
  } else if (diff < 60 * 60) {
    return `${Math.floor(diff / 60)}분`;
  } else if (diff < 60 * 60 * 24) {
    return `${Math.floor(diff / 60 / 24)}시간`;
  } else if (diff < 60 * 60 * 24 * 7) {
    return `${Math.floor(diff / 60 / 60 / 24)}일`;
  } else if (diff < 60 * 60 * 24 * 7 * 4) {
    return `${Math.floor(diff / 60 / 60 / 24 / 7)}주`;
  } else if (diff < 60 * 60 * 24 * 7 * 26) {
    return `${Math.floor(diff / 60 / 60 / 24 / 30)}개월`;
  } else {
    return '오래 전'
  }
}