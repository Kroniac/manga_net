export const sanitizeTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');

export const returnFormattedDateFromUtcSecs = (utcSecs) => {
  const currentDate = new Date(0);
  currentDate.setUTCSeconds(utcSecs);

  return `${currentDate.getDate()} ${SHORT_MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
};

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
