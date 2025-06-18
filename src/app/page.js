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
      <header className="bg-blue-500 text-white py-3 mb-6 sticky top-0 z-10">
         <h1 className="max-w-md mx-auto text-xl font-semibold">
             Mini-Twitter
          </h1>
      </header>

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
          <li key={t.id} className="border rounded-lg p-3 shadow-sm">
            <p className="mb-2">{t.text}</p>

            <button
              onClick={() => like(t.id)}
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              ❤️ {t.likes}
            </button>
            <button
              onClick={() =>  setTweets(tweets.filter(x => x.id !== t.id)) }
              className="ml-4 text-sm text-red-500 hover:text-red-700"
            >
               🗑
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
