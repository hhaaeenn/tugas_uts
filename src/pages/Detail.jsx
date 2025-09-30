import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Komponen Description3D
function Description3D({ description, isOpen, onClose }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((y - centerY) / centerY) * -10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden transform-gpu transition-transform duration-200 border-2 border-blue-500"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎯 Deskripsi Tim </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            {description.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-justify"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen LoadingWithLogo
function LoadingWithLogo({ teamName, teamBadge }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo Tim */}
        <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-4 border-4 border-gray-200 dark:border-gray-700 shadow-lg">
          {teamBadge ? (
            <img
              src={teamBadge}
              alt={teamName}
              className="w-full h-full object-contain animate-pulse"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl">
              <div className="text-4xl mb-2">⚽</div>
              <div className="text-lg font-bold">{teamName}</div>
            </div>
          )}
        </div>

        {/* Loading Text dan Animation */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Memuat {teamName}...
          </h2>

          {/* Loading Spinner */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Menyiapkan detail tim...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Detail() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const teamId = params.get("teamId");
  const teamName = params.get("teamName");

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [clickedTeamData, setClickedTeamData] = useState(null);
  const [show3DDescription, setShow3DDescription] = useState(false);

  // Ambil data tim yang diklik dari localStorage
  useEffect(() => {
    const savedTeamData = localStorage.getItem("clickedTeam");
    if (savedTeamData) {
      const teamData = JSON.parse(savedTeamData);

      // Hanya gunakan data jika masih fresh (kurang dari 10 detik)
      if (Date.now() - teamData.timestamp < 10000) {
        setClickedTeamData(teamData);
      }

      // Hapus data setelah digunakan
      localStorage.removeItem("clickedTeam");
    }
  }, []);

  // Ambil semua data tim sekali saja
  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League"
        );
        const data = await response.json();
        console.log("📦 All teams loaded:", data.teams?.length || 0);
        setAllTeams(data.teams || []);
      } catch (error) {
        console.error("Error fetching all teams:", error);
        setError("Gagal memuat data tim");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTeams();
  }, []);

  useEffect(() => {
    if (!teamId || allTeams.length === 0) {
      return;
    }

    console.log("🔍 Looking for team with ID:", teamId);

    // Cari tim dari data yang sudah kita punya
    const foundTeam = allTeams.find((t) => t.idTeam === teamId);

    if (foundTeam) {
      console.log("✅ Found team:", foundTeam.strTeam);
      console.log("🖼️ Team badge:", foundTeam.strBadge);
      setTeam(foundTeam);
    } else {
      console.error("❌ Team not found for ID:", teamId);
      setError(`Tim dengan ID ${teamId} tidak ditemukan`);
    }
  }, [teamId, allTeams]);

  // Tampilkan loading dengan logo tim yang diklik
  if (loading) {
    return (
      <LoadingWithLogo
        teamName={clickedTeamData?.name || teamName || "Tim"}
        teamBadge={clickedTeamData?.badge}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium justify-center"
          >
            ← Kembali ke Beranda
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl shadow-lg">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium justify-center"
          >
            ← Kembali ke Beranda
          </button>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-8 rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">Tim Tidak Ditemukan</h2>
            <p>Data tim tidak ditemukan untuk ID: {teamId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
        >
          ← Kembali ke Daftar Tim
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Header dengan Logo */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* Logo Tim */}
            <div className="w-40 h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
              {team.strBadge ? (
                <img
                  src={team.strBadge}
                  alt={team.strTeam}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error("❌ Logo failed to load:", team.strBadge);
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-2xl flex items-center justify-center hidden">
                <span className="text-gray-500 text-center p-4">
                  <div className="text-4xl mb-2">⚽</div>
                  <div>Logo Tidak Tersedia</div>
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {team.strTeam || "Nama Tim Tidak Tersedia"}
              </h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {team.strLeague && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {team.strLeague}
                  </span>
                )}
                {team.strCountry && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {team.strCountry}
                  </span>
                )}
                {team.intFormedYear && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Didirikan: {team.intFormedYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Informasi Tim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                  Informasi Tim
                </h2>

                <div className="space-y-4">
                  {team.strAlternate && team.strAlternate !== team.strTeam && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                        Nama Lengkap:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {team.strAlternate}
                      </p>
                    </div>
                  )}

                  {team.strStadium && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                        Stadion:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                        {team.strStadium}
                      </p>
                      {team.strStadiumLocation && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          📍 {team.strStadiumLocation}
                        </p>
                      )}
                      {team.intStadiumCapacity && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          🪑 Kapasitas:{" "}
                          {parseInt(team.intStadiumCapacity).toLocaleString()}{" "}
                          kursi
                        </p>
                      )}
                    </div>
                  )}

                  {team.strKeywords && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                        Keywords:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {team.strKeywords}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Jersey */}
              {team.strTeamJersey && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Jersey Tim
                  </h2>
                  <div className="flex justify-center">
                    <img
                      src={team.strTeamJersey}
                      alt={`${team.strTeam} Jersey`}
                      className="w-64 h-64 object-contain border-4 border-white dark:border-gray-600 rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="w-64 h-64 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hidden">
                      <span className="text-gray-500 text-center">
                        <div className="text-4xl mb-2">👕</div>
                        <div>Jersey Tidak Tersedia</div>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Kontak & Media Sosial */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                  Kontak & Media Sosial
                </h2>

                <div className="space-y-4">
                  {team.strWebsite && (
                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="text-2xl">🌐</span>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">
                          Website
                        </span>
                        <a
                          href={
                            team.strWebsite.startsWith("http")
                              ? team.strWebsite
                              : `https://${team.strWebsite}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all text-sm"
                        >
                          {team.strWebsite}
                        </a>
                      </div>
                    </div>
                  )}

                  {team.strFacebook && (
                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="text-2xl text-blue-600">📘</span>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">
                          Facebook
                        </span>
                        <a
                          href={`https://${team.strFacebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {team.strFacebook}
                        </a>
                      </div>
                    </div>
                  )}

                  {team.strTwitter && (
                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="text-2xl text-blue-400">🐦</span>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">
                          Twitter
                        </span>
                        <a
                          href={`https://twitter.com/${team.strTwitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          @{team.strTwitter.replace("@", "")}
                        </a>
                      </div>
                    </div>
                  )}

                  {team.strInstagram && (
                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="text-2xl text-pink-600">📷</span>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">
                          Instagram
                        </span>
                        <a
                          href={`https://instagram.com/${team.strInstagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          @{team.strInstagram.replace("@", "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Informasi Tambahan */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                  Informasi Lainnya
                </h2>

                <div className="space-y-4">
                  {team.strSport && (
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Olahraga:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {team.strSport}
                      </span>
                    </div>
                  )}

                  {team.strGender && (
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Gender:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {team.strGender}
                      </span>
                    </div>
                  )}

                  {team.strStadiumDescription && (
                    <div className="p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                        Deskripsi Stadion:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {team.strStadiumDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi dengan efek 3D */}
          {team.strDescriptionEN ? (
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <div
                className="flex items-center justify-between mb-4 border-b pb-2"
                onClick={() => setShow3DDescription(true)}
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  🎯 Deskripsi Tim 
                </h2>
               
              </div>
              <div
                className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 cursor-pointer"
                onClick={() => setShow3DDescription(true)}
              >
                {team.strDescriptionEN
                  .split("\n\n")
                  .slice(0, 2)
                  .map((paragraph, index) => (
                    <p key={index} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
               
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Deskripsi Tim
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                Deskripsi tidak tersedia untuk tim ini.
              </div>
            </div>
          )}

          {/* Fanart */}
          {(team.strTeamFanart1 ||
            team.strTeamFanart2 ||
            team.strTeamFanart3 ||
            team.strTeamFanart4) && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                Galeri Tim
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  team.strTeamFanart1,
                  team.strTeamFanart2,
                  team.strTeamFanart3,
                  team.strTeamFanart4,
                ]
                  .filter((url) => url && url.trim() !== "")
                  .map((fanart, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={fanart}
                        alt={`${team.strTeam} Fanart ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hidden">
                        <span className="text-gray-500 text-center">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div>Gambar Tidak Tersedia</div>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Description 3D */}
      <Description3D
        description={team.strDescriptionEN}
        isOpen={show3DDescription}
        onClose={() => setShow3DDescription(false)}
      />
    </div>
  );
}
