'use client';

import { useState, useEffect } from 'react';
import { ClipboardCopyIcon } from 'lucide-react';

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

  const API_URL = 'https://shortener-backend-7qu0.onrender.com';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Token da API

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_URL}/urls`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const data = await res.json();
      // Garante que urls seja sempre um array
      setUrls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar URLs:', err);
      setUrls([]);
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      setInputUrl('');
      await fetchUrls();
    } catch (err) {
      console.error('Erro ao encurtar URL:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToShortUrl = async (shortCode: string) => {
    try {
      const res = await fetch(`${API_URL}/redirect/${shortCode}`);
      const data = await res.json();
      if (data.originalUrl) {
        window.open(data.originalUrl, '_blank');
      } else {
        alert('URL não encontrada.');
      }
      await fetchUrls();
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
    <div className="min-h-screen bg-gradient-to-tr from-[#0b0f1a] via-[#1c1c2e] to-[#0b0f1a] p-8 font-sans text-white flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-[#121421] border border-purple-600 shadow-[0_0_20px_rgba(128,0,255,0.5)] rounded-2xl p-6">
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent mb-6">
            🚀 Encurtador de URLs Futurista
          </h1>

          <form onSubmit={handleShorten} className="flex gap-3 mb-6">
            <input
              type="url"
              placeholder="Cole sua URL aqui (http://...)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 p-3 bg-[#1a1a2e] border border-purple-600 placeholder:text-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transform transition-all shadow-lg shadow-purple-500/50 rounded-lg"
            >
              {loading ? 'Encurtando...' : 'Encurtar'}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-white">
              <thead className="bg-[#0f0f1a] text-purple-400 uppercase text-sm tracking-wide">
                <tr>
                  <th className="p-3 text-left">Original</th>
                  <th className="p-3 text-left">Encurtada</th>
                  <th className="p-3 text-center">Cliques</th>
                  <th className="p-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {urls.length > 0 ? (
                  urls.map((url) => (
                    <tr
                      key={url.id}
                      className="hover:bg-purple-700/20 cursor-pointer transition-colors duration-200"
                    >
                      <td
                        title={url.originalUrl}
                        className="p-3 truncate max-w-[250px] text-gray-200"
                      >
                        {url.originalUrl}
                      </td>
                      <td
                        onClick={() => goToShortUrl(url.shortCode)}
                        className="p-3 text-purple-400 font-semibold hover:underline"
                      >
                        {`${API_URL}/${url.shortCode}`}
                      </td>
                      <td className="p-3 text-center text-pink-400 font-medium">
                        {url.clicks}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => copyToClipboard(url.shortCode)}
                          className="flex items-center gap-1 px-2 py-1 border border-purple-500 text-purple-300 hover:bg-purple-700/30 rounded transition"
                        >
                          <ClipboardCopyIcon className="w-4 h-4" />
                          Copiar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 mt-4 animate-pulse"
                    >
                      Nenhuma URL criada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
