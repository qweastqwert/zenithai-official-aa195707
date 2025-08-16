
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SoothingMusic from '@/components/SoothingMusic';

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
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <SoothingMusic suggestedSong={suggestedSong} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SoothingMusicPage;
