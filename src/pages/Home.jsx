import { useState, useMemo } from "react";
import { fetchArticles } from "../api/newsService";
import useFetch from "../hooks/useFetch";
import NewsCard from "../components/NewsCard";
import Pagination from "../components/Pagination";
import RotatingCard from "../components/RotatingCard"; // Import komponen baru

export default function Home() {
  const { data, loading, error } = useFetch(
    () => fetchArticles({ maxrecords: 20 }),
    []
  );

  const [page, setPage] = useState(1);
  const perPage = 6;

  const teams = useMemo(() => {
    if (!data) return [];
    const list = data.teams || [];
    console.log(
      "🏆 All teams data:",
      list.map((team) => ({
        id: team.idTeam,
        name: team.strTeam,
        badge: team.strBadge,
        stadium: team.strStadium,
      }))
    );
    return Array.isArray(list) ? list : [];
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(teams.length / perPage));
  const pagedTeams = teams.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tim Premier League</h1>

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

      {!loading && !error && teams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada data tim ditemukan
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
