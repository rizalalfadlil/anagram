export const MAX_RESULTS = 10; // Bisa diubah sesuai kebutuhan

let shouldStop = false; // Flag untuk menghentikan pencarian

// Fungsi untuk menghentikan pencarian secara manual
export const stopSearch = () => {
  shouldStop = true;
  console.log("⛔ Pencarian dihentikan secara manual.");
};

// Fungsi untuk mengambil daftar kata dari words.txt
export const fetchWordList = async (): Promise<string[]> => {
  console.log("📥 Mengambil daftar kata dari words.txt...");
  try {
    const res = await fetch("/words2.txt");
    const text = await res.text();

    const words = [
      ...new Set(
        text
          .toLowerCase()
          .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 1)
      ),
    ];

    // 🔹 Urutkan kata berdasarkan panjangnya, dari terpanjang ke terpendek
    words.sort((a, b) => b.length - a.length);

    console.log(`✅ Berhasil memuat ${words.length} kata unik.`);
    return words;
  } catch (error) {
    console.error("❌ Gagal memuat words.txt:", error);
    return [];
  }
};

// Hitung jumlah huruf dalam kata
const getLetterCount = (word: string): Record<string, number> => {
  const count: Record<string, number> = {};
  for (const letter of word) {
    count[letter] = (count[letter] || 0) + 1;
  }
  return count;
};

// Cek apakah kata bisa dibentuk dari huruf yang tersedia
const canFormWord = (
  word: string,
  letterCount: Record<string, number>
): boolean => {
  const tempCount = { ...letterCount };
  for (const letter of word) {
    if (!tempCount[letter] || tempCount[letter] <= 0) return false;
    tempCount[letter]--;
  }
  return true;
};

// Fungsi utama mencari anagram dengan batas hasil & waktu eksekusi
export const findAnagrams = (
  input: string,
  words: string[]
): { results: string[]; time: number } => {
  shouldStop = false; // Reset flag pencarian sebelum mulai
  console.log("🔍 Memulai pencarian anagram...");

  const startTime = performance.now(); // Mulai hitung waktu

  const cleanedInput = input.replace(/\s+/g, "").toLowerCase();
  const letterCount = getLetterCount(cleanedInput);
  const validWords = words.filter((word) => canFormWord(word, letterCount));

  console.log(`📜 Input: "${cleanedInput}"`);
  console.log(`🔎 Kata valid ditemukan: ${validWords.length}`);

  const results: string[] = [];
  const used = new Set<string>();

  const findCombinations = (
    remainingLetters: string,
    currentWords: string[]
  ): void => {
    if (shouldStop) return;

    if (remainingLetters.length === 0) {
      const combination = currentWords.sort().join(" ");
      if (!used.has(combination)) {
        results.push(combination);
        used.add(combination);

        console.log(`✅ Anagram ditemukan: ${combination}`);
        console.log(`📊 Total anagram sejauh ini: ${results.length}`);

        if (results.length >= MAX_RESULTS) {
          shouldStop = true;
          console.log(
            "⛔ Batas maksimum anagram tercapai, menghentikan pencarian."
          );
          return;
        }
      }
      return;
    }

    for (const word of validWords) {
      if (shouldStop) return;

      if (canFormWord(word, getLetterCount(remainingLetters))) {
        let newRemaining = remainingLetters;
        for (const letter of word) {
          newRemaining = newRemaining.replace(letter, "");
        }

        console.log(
          `🔄 Mencoba kombinasi: ${[...currentWords, word].join(" ")}`
        );
        findCombinations(newRemaining, [...currentWords, word]);
      }
    }
  };

  findCombinations(cleanedInput, []);

  const endTime = performance.now(); // Akhir hitung waktu
  const elapsedTime = endTime - startTime; // Hitung durasi pencarian

  console.log(`⏱️ Waktu pencarian: ${elapsedTime.toFixed(2)} ms`);

  return { results, time: elapsedTime };
};
