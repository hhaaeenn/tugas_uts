import { Link } from "react-router-dom";

export default function NewsCard({ article }) {
  // Debug: Lihat semua data yang tersedia
  console.log("Team data in NewsCard:", article);

  const handleClick = () => {
    const teamData = {
      id: article.idTeam,
      name: article.strTeam,
      badge: article.strBadge,
      timestamp: Date.now(),
    };
    localStorage.setItem("clickedTeam", JSON.stringify(teamData));
  };

  return (
    <Link
      to={`/detail?teamId=${article.idTeam}&teamName=${encodeURIComponent(
        article.strTeam
      )}`}
      className="block"
      onClick={handleClick}
    >
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center text-center">
          {/* Logo Tim */}
          <div className="w-32 h-32 mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
            {article.strTeamBadge || article.strBadge ? (
              <img
                src={article.strTeamBadge || article.strBadge}
                alt={article.strTeam}
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hidden">
              <span className="text-gray-500 text-xs text-center">No Logo</span>
            </div>
          </div>

          {/* Nama Tim */}
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
            {article.strTeam || "Unknown Team"}
          </h3>

          {/* Informasi Tim */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 w-full">
            <div className="flex justify-between">
              <span className="font-semibold">Negara:</span>
              <span>{article.strCountry || "Unknown"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Stadion:</span>
              <span className="text-right">
                {article.strStadium || "Unknown"}
              </span>
            </div>

            {/* Tahun Berdiri - Coba berbagai field */}
            <div className="flex justify-between">
              <span className="font-semibold">Berdiri:</span>
              <span>
                {article.intFormedYear ||
                  article.strFormedYear ||
                  article.intFounded ||
                  article.strFounded ||
                  "Unknown"}
              </span>
            </div>

            {/* Debug info - hanya di development */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-400 mt-2">
        
              </div>
            )}
          </div>

          {/* Button Detail */}
          <div className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
            Detail Tim
          </div>
        </div>
      </article>
    </Link>
  );
}
