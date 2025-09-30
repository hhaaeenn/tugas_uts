import { Link } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Header() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="flex items-center justify-between p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80">
          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg"
              alt="Premier League Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-red-600 rounded flex items-center justify-center hidden">
              <span className="text-white font-bold text-sm">EPL</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Premier League
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Football Hub
            </span>
          </div>
        </Link>

        {/* Navigation & Dark Mode Toggle */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>🏠</span>
              <span>Beranda</span>
            </Link>
            <Link
              to="/all"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>🔍</span>
              <span>Search</span>
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            <span
              className={`${
                isDarkMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg flex items-center justify-center`}
            >
              {isDarkMode ? (
                <span className="text-xs">🌙</span>
              ) : (
                <span className="text-xs">☀️</span>
              )}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
