// components/LoadingWithLogo.jsx
export default function LoadingWithLogo({ teamName, teamBadge }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
