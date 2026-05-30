import { useCallback } from 'react';
import { Universe } from '../context/UniverseContext';

// Mapeamento de sons por universo
const soundMap: Record<Universe, string> = {
  // K-pop
  aespa: '/sounds/aespa-supernova.mp3',
  enhypen: '/sounds/enhypen-biteMe.mp3',
  bts: '/sounds/bts-butter.mp3',
  blackpink: '/sounds/blackpink-pinkVenom.mp3',
  redvelvet: '/sounds/redvelvet-psycho.mp3',
  newjeans: '/sounds/newjeans-ditto.mp3',
  illit: '/sounds/illit-magnetic.mp3',

  // Cinema
  starwars: '/sounds/starwars-imperial.mp3',
  marvel: '/sounds/marvel-avengers.mp3',
  spiderman: '/sounds/spiderman-webswing.mp3',
  meangirls: '/sounds/meangirls-fetch.mp3',
  interstellar: '/sounds/interstellar-stay.mp3',
};

// Descrições dos sons
export const soundDescriptions: Record<Universe, string> = {
  aespa: 'Supernova - AESPA',
  enhypen: 'Bite Me - ENHYPEN',
  bts: 'Butter - BTS',
  blackpink: 'Pink Venom - BLACKPINK',
  redvelvet: 'Psycho - Red Velvet',
  newjeans: 'Ditto - NewJeans',
  illit: 'Magnetic - ILLIT',
  starwars: 'Imperial March',
  marvel: 'Avengers Theme',
  spiderman: 'Web Swing Sound',
  meangirls: 'Fetch Quote',
  interstellar: 'Stay - Hans Zimmer',
};

export function useSounds() {
  const playSound = useCallback((universe: Universe, volume: number = 0.3) => {
    try {
      const soundPath = soundMap[universe];

      // Como estamos em ambiente de desenvolvimento, vamos usar um som placeholder
      // Em produção, você substituiria isso pelos arquivos reais
      const audio = new Audio();

      // Tentar tocar o som real, mas não falhar se não existir
      audio.src = soundPath;
      audio.volume = volume;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`🔊 Playing sound for ${universe}: ${soundDescriptions[universe]}`);
          })
          .catch((error) => {
            // Sons não disponíveis ainda - isso é ok para desenvolvimento
            console.log(`🔇 Sound not available yet for ${universe}`);
          });
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    // Para todos os áudios ativos
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    playSound,
    stopAllSounds,
    soundDescriptions,
  };
}
