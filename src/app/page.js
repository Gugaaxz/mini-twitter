'use client';                       // ← obrigatório para usar useState no App Router
import { useState, useEffect } from 'react';

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [text,   setText]   = useState('');

  /* ─────────── carregar tweets guardados ─────────── */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tweets') || '[]');
    setTweets(stored);
  }, []);

  /* ─────────── gravar sempre que mudar ─────────── */
  useEffect(() => {
    localStorage.setItem('tweets', JSON.stringify(tweets));
  }, [tweets]);

  /* ─────────── funções ─────────── */
  const send = () => {
    if (!text.trim()) return;
    setTweets([{ id: Date.now(), text, likes: 0 }, ...tweets]);
    setText('');
  };

  const like = id =>
    setTweets(tweets.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));

  /* ─────────── UI ─────────── */
  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini-Twitter</h1>

      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's happening?"
      />
      <button
        onClick={send}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Tweet
      </button>

      <ul className="space-y-4">
        {tweets.map(t => (
          <li key={t.id} className="border rounded p-3">
            <p className="mb-2">{t.text}</p>

            <button
              onClick={() => like(t.id)}
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              ❤️ {t.likes}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
