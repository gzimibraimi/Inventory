import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        setSearchParams({});
        return;
      }

      setSearchParams({ query });

      fetchResults(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  // 🔥 fake API (këtu më vonë lidhet backend)
  const fetchResults = async (searchText) => {
    try {
      setLoading(true);

      // TODO: replace me real API
      const fakeData = [
        { id: 1, name: "Laptop Dell" },
        { id: 2, name: "Mouse Logitech" },
        { id: 3, name: "Keyboard Mechanical" },
      ];

      const filtered = fakeData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );

      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔍 Kërko Paisje</h1>

      {/* INPUT */}
      <input
        type="text"
        value={query}
        placeholder="Shkruaj emrin e paisjes..."
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginTop: "10px"
        }}
      />

      {/* LOADING */}
      {loading && <p>Duke kërkuar...</p>}

      {/* RESULTS */}
      <div style={{ marginTop: "20px" }}>
        {results.length === 0 && query && !loading && (
          <p>Nuk u gjet asgjë</p>
        )}

        {results.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "10px",
              borderRadius: "6px"
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}