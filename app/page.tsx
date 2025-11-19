'use client';
import { useState, useEffect } from 'react';

interface UrlData {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3001';

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    const res = await fetch(`${API_URL}/urls`);
    const data = await res.json();
    setUrls(data);
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    setLoading(true);

    try {
      await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      setInputUrl('');
      await fetchUrls();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToShortUrl = async (shortCode: string) => {
    try {
      const res = await fetch(`${API_URL}/redirect/${shortCode}`);
      const data = await res.json();
      window.open(data.originalUrl, '_blank'); // abre a URL em nova aba
      await fetchUrls(); // atualiza clicks
    } catch (err) {
      console.error('Erro ao redirecionar:', err);
    }
  };

  const copyToClipboard = (shortCode: string) => {
    const fullShortUrl = `${API_URL}/${shortCode}`;
    navigator.clipboard.writeText(fullShortUrl);
    alert(`Link copiado: ${fullShortUrl}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Encurtador de URL
        </h1>

        <form onSubmit={handleShorten} className="flex gap-2 mb-8">
          <input
            type="url"
            placeholder="Cole sua URL aqui (http://...)"
            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Encurtando...' : 'Encurtar'}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 text-sm font-semibold">Original</th>
                <th className="p-3 text-sm font-semibold">Encurtada</th>
                <th className="p-3 text-sm font-semibold text-center">
                  Cliques
                </th>
                <th className="p-3 text-sm font-semibold text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.id} className="border-b hover:bg-gray-50">
                  <td
                    className="p-3 text-sm truncate max-w-[200px]"
                    title={url.originalUrl}
                  >
                    {url.originalUrl}
                  </td>
                  <td
                    className="p-3 text-sm text-blue-600 font-medium cursor-pointer"
                    onClick={() => goToShortUrl(url.shortCode)}
                  >
                    {`${API_URL}/${url.shortCode}`}
                  </td>
                  <td className="p-3 text-sm text-center">{url.clicks}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => copyToClipboard(url.shortCode)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      Copiar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {urls.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Nenhuma URL criada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
