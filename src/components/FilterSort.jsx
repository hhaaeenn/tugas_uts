export default function FilterSort({ value, onSearch, sortBy, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Cari tim, stadion, atau negara..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="name_asc">Nama A-Z</option>
        <option value="name_desc">Nama Z-A</option>
        <option value="year_asc">Tahun Terlama</option>
        <option value="year_desc">Tahun Terbaru</option>
      </select>
    </div>
  );
}
