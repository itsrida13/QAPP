import { useState, useEffect } from 'react';

export default function useFetchSurahs() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all Surahs once on mount
  useEffect(() => {
    fetchSurahs();
  }, []);

  // Apply search filter
  useEffect(() => {
    if (searchQuery === '') {
      const itemsPerPage = 10;
      const initialData = surahs.slice(0, itemsPerPage);
      setFilteredSurahs(initialData);
      setPage(1);
    } else {
      const filtered = surahs.filter((surah) =>
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  const fetchSurahs = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const json = await response.json();

      if (json.code === 200 && json.data) {
        const allSurahs = json.data;
        setSurahs(allSurahs);

        const itemsPerPage = 10;
        const initialData = allSurahs.slice(0, itemsPerPage);
        setFilteredSurahs(initialData);

        setTotalPages(Math.ceil(allSurahs.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching Surahs:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSurahs();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (loadingMore || searchQuery !== '') return;

    if (page < totalPages) {
      setLoadingMore(true);
      const itemsPerPage = 10;
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const newItems = surahs.slice(startIndex, startIndex + itemsPerPage);
      setFilteredSurahs((prev) => [...prev, ...newItems]);
      setPage(nextPage);
      setLoadingMore(false);
    }
  };

  return {
    surahs,
    filteredSurahs,
    loading,
    refreshing,
    loadingMore,
    handleLoadMore,
    handleRefresh,
    searchQuery,
    setSearchQuery,
  };
}
