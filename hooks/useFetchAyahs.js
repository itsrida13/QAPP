import { useState, useEffect } from 'react';

export default function useFetchAyahs() {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [englishTranslation, setEnglishTranslation] = useState([]);
  const [urduTranslation, setUrduTranslation] = useState([]);
  const [tafsir, setTafsir] = useState([]); // Placeholder or static
  const [loading, setLoading] = useState(false);
  const [urduJsonData, setUrduJsonData] = useState(null);

  // Load Urdu JSON once
  useEffect(() => {
    const fetchUrduJson = async () => {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_ur.json'
        );
        const json = await response.json();
        setUrduJsonData(json);
      } catch (error) {
        console.error('Error loading Urdu JSON:', error);
      }
    };
    fetchUrduJson();
  }, []);

  const fetchAyahs = async (surahNumber) => {
    setLoading(true);

    try {
      // Fetch Arabic
      const arabicRes = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
      );
      const arabicJson = await arabicRes.json();
      if (arabicJson.code !== 200 || !arabicJson.data) {
        throw new Error('Arabic data fetch failed');
      }
      setSelectedSurah(arabicJson.data);

      // Fetch English
      const englishRes = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`
      );
      const englishJson = await englishRes.json();
      if (englishJson.code === 200 && englishJson.data) {
        const engTexts = englishJson.data.ayahs.map((a) => a.text);
        setEnglishTranslation(engTexts);
      } else {
        setEnglishTranslation([]);
      }

      // Extract Urdu from loaded JSON
      if (urduJsonData) {
        const surahMatch = urduJsonData.find(
          (s) => parseInt(s.chapter) === parseInt(surahNumber)
        );
        if (surahMatch && surahMatch.verses) {
          const urduTexts = surahMatch.verses.map((v) => v.text);
          setUrduTranslation(urduTexts);
        } else {
          setUrduTranslation([]);
        }
      } else {
        setUrduTranslation([]);
      }

      // Dummy Tafsir (optional, you can fetch real data if you have a tafsir API)
      const dummyTafsir = arabicJson.data.ayahs.map((_, i) => ({
        text: `This is a placeholder tafsir for ayah ${i + 1}.`,
      }));
      setTafsir(dummyTafsir);

    } catch (err) {
      console.error('Fetch Ayahs failed:', err);
      setSelectedSurah(null);
      setEnglishTranslation([]);
      setUrduTranslation([]);
      setTafsir([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedSurah,
    englishTranslation,
    urduTranslation,
    tafsir,
    fetchAyahs,
    loading,
  };
}
