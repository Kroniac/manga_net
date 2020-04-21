export const ReturnMangaStatusInfo = (status) => {
  switch (status) {
    case 0: return {
      title: 'Suspended',
      color: '',
    };
    case 1: return {
      title: 'Ongoing',
      color: 'blue',
    };
    case 2: return {
      title: 'Completed',
      color: 'green',
    };
    default: return {
      title: 'Unknown',
      color: '',
    };
  }
};
