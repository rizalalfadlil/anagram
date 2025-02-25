import { findAnagrams } from './logic';

self.onmessage = (event) => {
  const { input, words } = event.data;

  console.log("🚀 Worker mulai mencari anagram...");
  const startTime = performance.now();

  const { results, time } = findAnagrams(input, words);

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`✅ Worker selesai dalam ${elapsedTime.toFixed(2)} ms`);

  // Kirim hasil kembali ke UI
  self.postMessage({ results, time: elapsedTime });
};
