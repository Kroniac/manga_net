import { CustomHooks } from '#config/import_paths';

const { useLocalStorage } = CustomHooks.useLocalStorage();

export const useFavouritedManga = () => {
  const [favouritedMangas, setFavouritedManga] = useLocalStorage('favouritedManga', []);

  const isMangaFavourited = (mangaId) => favouritedMangas.indexOf(mangaId) > -1;

  const favouriteManga = (mangaId) => {
    const isFavourited = isMangaFavourited(mangaId);

    if (!isFavourited) {
      const updatedFavouritedMangas = [...favouritedMangas, mangaId];
      return setFavouritedManga(updatedFavouritedMangas);
    }

    return null;
  };

  const unfavouriteManga = (mangaId) => {
    const updatedFavouritedMangas = favouritedMangas.filter((id) => id !== mangaId);
    return setFavouritedManga(updatedFavouritedMangas);
  };

  return {
    favouriteManga,
    favouritedMangas,
    isMangaFavourited,
    unfavouriteManga,
  };
};
