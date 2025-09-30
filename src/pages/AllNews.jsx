import { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import { fetchArticles } from "../api/newsService";
import NewsCard from "../components/NewsCard";
import Pagination from "../components/Pagination";
import FilterSort from "../components/FilterSort";
import RotatingCard from "../components/RotatingCard"; // Import komponen baru

export default function AllNews() {
  const { data, loading, error } = useFetch(
    () => fetchArticles({ maxrecords: 50 }),
    []
  );

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");

  const teams = useMemo(() => {
    if (!data) return [];
    let list = data.teams || [];

    // Filter berdasarkan pencarian
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (team) =>
          (team.strTeam || "").toLowerCase().includes(q) ||
          (team.strStadium || "").toLowerCase().includes(q) ||
          (team.strCountry || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "name_asc") {
      list.sort((a, b) => (a.strTeam || "").localeCompare(b.strTeam || ""));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => (b.strTeam || "").localeCompare(a.strTeam || ""));
    } else if (sortBy === "year_asc") {
      list.sort((a, b) => (a.intFormedYear || 0) - (b.intFormedYear || 0));
    } else if (sortBy === "year_desc") {
      list.sort((a, b) => (b.intFormedYear || 0) - (a.intFormedYear || 0));
    }

    return list;
  }, [data, query, sortBy]);

  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(teams.length / perPage));
  const pagedTeams = teams.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Semua Tim Sepak Bola</h1>

      <FilterSort
        value={query}
        onSearch={setQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Memuat data tim...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && pagedTeams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {query
            ? `Tidak ada tim ditemukan untuk "${query}"`
            : "Tidak ada data tim"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedTeams.map((team, index) => (
          <RotatingCard key={team.idTeam || index} speed={0.05} axis="Y">
            {" "}
            {/* Tambahkan RotatingCard */}
            <NewsCard article={team} />
          </RotatingCard>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
