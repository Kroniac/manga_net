import { CustomHooks } from '#config/import_paths';

const { useLocalStorage } = CustomHooks.UseLocalStorage();

const MAX_SAVES = 60;
export const useSavedMangaReadPos = () => {
  const [savedMangaReadPositions, setSavedMangaReadPos] = useLocalStorage('savedMangaReadPositions', []);

  const getMangaPosIfSaved = (mangaId) => {
    let mangaPos = null;

    savedMangaReadPositions.forEach((item) => {
      if (item.id === mangaId) mangaPos = item;
    });

    return mangaPos;
  };

  const saveMangaReadPos = (manga) => {
    const updatedMangaReadPositions = [{ ...manga, saveAt: new Date().getTime() }];

    savedMangaReadPositions.forEach((item) => {
      if (item.id !== manga.id) updatedMangaReadPositions.push(item);
    });

    if (updatedMangaReadPositions.length > MAX_SAVES) {
      updatedMangaReadPositions.splice(MAX_SAVES - 1, updatedMangaReadPositions.length - MAX_SAVES);
    }

    return setSavedMangaReadPos(updatedMangaReadPositions);
  };

  const unSaveMangaReadPos = (mangaId) => setSavedMangaReadPos(
    savedMangaReadPositions.filter((item) => item.id !== mangaId),
  );

  return {
    saveMangaReadPos,
    savedMangaReadPositions,
    getMangaPosIfSaved,
    unSaveMangaReadPos,
  };
};
