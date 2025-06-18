'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supa';
import { useRouter } from 'next/navigation';

export default function Home() {
  /* ---------- estado ---------- */
  const [tweets, setTweets] = useState([]);
  const [text, setText]     = useState('');
  const [user, setUser]     = useState(null);
  const router = useRouter();

  /* ---------- 0. quem está logado ---------- */
  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        if (!data?.user) return router.push('/login');
        setUser(data.user);
      });
  }, []);

  /* ---------- 1. CARREGAR tweets ---------- */
  useEffect(() => {
    if (!user) return;                 // só depois de saber quem é o user
    supabase.from('tweets')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) return alert(error.message);
        setTweets(data);
      });
  }, [user]);

  /* ---------- enviar tweet ---------- */
  async function send() {
    if (!text.trim()) return;
    const { data, error } = await supabase
      .from('tweets')
      .insert({ text, user_id: user.id })
      .select()
      .single();

    if (error) return alert(error.message);
    setTweets([data, ...tweets]);
    setText('');
  }

/* ---------- like ---------- */
async function like(id) {
  // 1) quanto vale agora?
  const current = tweets.find(t => t.id === id);
  if (!current) return;

  // 2) tenta gravar +1
  const { data, error } = await supabase
    .from('tweets')
    .update({ likes: current.likes + 1 }) // <-- soma simples
    .eq('id', id)
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  // 3) refresca o estado local com o registo vindo da BD
  setTweets(tweets.map(t => (t.id === id ? data : t)));
}

  /* ---------- apagar (só autor) ---------- */
  async function del(id) {
    if (!confirm('Apagar tweet?')) return;
    const { error } = await supabase
      .from('tweets')
      .delete()
      .eq('id', id);

    if (error) return alert(error.message);
    setTweets(tweets.filter(t => t.id !== id));
  }
  console.log('URL 👉', process.env.NEXT_PUBLIC_SUPABASE_URL);
  /* ---------- UI ---------- */
  return (
    <main className="max-w-md mx-auto p-4">
      <header className="bg-blue-600 text-white py-3 mb-6 sticky top-0 z-10">
        <h1 className="max-w-md mx-auto text-xl font-semibold">
          Mini-Twitter
        </h1>
      </header>

      {/* form */}
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's happening?"
      />
      <button
        onClick={send}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
      >
        Tweet
      </button>

      {/* lista */}
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

            {user && t.user_id === user.id && (
              <button
                onClick={() => del(t.id)}
                className="ml-4 text-sm text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* sair */}
      <div className="mt-8 text-center">
        <button
          onClick={() =>
            supabase.auth.signOut().then(() => router.push('/login'))
          }
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          Sair
        </button>
      </div>
    </main>
  );
  
}
