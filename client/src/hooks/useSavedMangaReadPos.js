import { CustomHooks } from '#config/import_paths';

const { useLocalStorage } = CustomHooks.UseLocalStorage();

export const useSavedMangaReadPos = () => {
  const [savedMangaReadPosById, setSavedMangaReadPos] = useLocalStorage('savedMangaReadPosById', {});

  const isMangaReadPosSaved = (mangaId) => !!savedMangaReadPosById[mangaId];

  const saveMangaReadPos = (manga) => {
    const isSaved = isMangaReadPosSaved(manga);

    if (!isSaved) {
      return setSavedMangaReadPos({
        ...savedMangaReadPosById,
        [manga.id]: manga,
      });
    }

    return null;
  };

  const unSaveMangaReadPos = (mangaId) => {
    const savedMangasCopy = { ...savedMangaReadPosById };
    delete savedMangasCopy[mangaId];
    return setSavedMangaReadPos(savedMangasCopy);
  };

  return {
    saveMangaReadPos,
    savedMangaReadPosById,
    isMangaReadPosSaved,
    unSaveMangaReadPos,
  };
};
