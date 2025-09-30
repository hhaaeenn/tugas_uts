// newsService.js - TheSportsDB API
const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";

export async function fetchFootballTeams() {
  try {
    const url = `${API_BASE}/search_all_teams.php?l=English%20Premier%20League`;

    console.log("Fetching teams from:", url);
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("API Response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching football teams:", error);
    throw new Error("Gagal memuat data tim sepak bola: " + error.message);
  }
}

// Fungsi untuk mencari tim berdasarkan nama
export async function searchTeams(query) {
  try {
    const url = `${API_BASE}/searchteams.php?t=${encodeURIComponent(query)}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error searching teams:", error);
    throw error;
  }
}

// Fungsi utama yang digunakan di komponen
export async function fetchArticles({ q = "", maxrecords = 20 } = {}) {
  try {
    if (q) {
      return await searchTeams(q);
    } else {
      return await fetchFootballTeams();
    }
  } catch (error) {
    console.error("Error in fetchArticles:", error);
    throw error;
  }
}
