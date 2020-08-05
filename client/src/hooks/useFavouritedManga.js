import { CustomHooks } from '#config/import_paths';

const { useLocalStorage } = CustomHooks.UseLocalStorage();

export const useFavouritedManga = () => {
  const [favouritedMangasById, setFavouritedManga] = useLocalStorage('favouritedMangasById', {});

  const isMangaFavourited = (mangaId) => !!favouritedMangasById[mangaId];

  const favouriteManga = (manga) => {
    const isFavourited = isMangaFavourited(manga);

    if (!isFavourited) {
      return setFavouritedManga({
        ...favouritedMangasById,
        [manga.id]: manga,
      });
    }

    return null;
  };

  const unfavouriteManga = (mangaId) => {
    const favouritedMangasCopy = { ...favouritedMangasById };
    delete favouritedMangasCopy[mangaId];
    return setFavouritedManga(favouritedMangasCopy);
  };

  return {
    favouriteManga,
    favouritedMangasById,
    isMangaFavourited,
    unfavouriteManga,
  };
};
