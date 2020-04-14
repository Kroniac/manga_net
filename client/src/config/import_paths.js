export const Screens = {
  Home: () => require('../screens/home/home').default,
  Manga: () => require('../screens/manga').default,
};

export const Libs = {
  Networking: () => require('../libs/networking'),
};


export const CustomHooks = {
  useLocalStorage: () => require('../hooks/useLocalStorage'),
  useDataApi: () => require('../hooks/useDataApi'),
  useFavourtiedManga: () => require('../hooks/useFavouritedManga'),
};
