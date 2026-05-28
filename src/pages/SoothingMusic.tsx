
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SoothingMusic from '@/components/SoothingMusic';
import SEO from '@/components/SEO';

const SoothingMusicPage = () => {
  const [searchParams] = useSearchParams();
  const [suggestedSong, setSuggestedSong] = useState<number | undefined>();

  useEffect(() => {
    const songParam = searchParams.get('song');
    if (songParam) {
      const songId = parseInt(songParam, 10);
      if (!isNaN(songId)) {
        setSuggestedSong(songId);
      }
    }
  }, [searchParams]);

  return (
    <>
      <SEO
        title="Soothing Music — Zenith AI"
        description="Curated relaxation tracks for calm, focus, and sleep. Stream soothing soundscapes anywhere in the app."
        path="/soothing-music"
      />
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-sunrise-warm">
        <div className="container mx-auto max-w-6xl">
          <SoothingMusic suggestedSong={suggestedSong} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SoothingMusicPage;
