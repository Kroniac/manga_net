export const ReturnMangaStatusInfo = (status) => {
  switch (status) {
    case 'suspended': return {
      title: 'Suspended',
      color: '',
    };
    case 'ongoing': return {
      title: 'Ongoing',
      color: 'blue',
    };
    case 'completed': return {
      title: 'Completed',
      color: 'green',
    };
    default: return {
      title: 'Unknown',
      color: '',
    };
  }
};
