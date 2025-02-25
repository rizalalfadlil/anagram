import { useState, useEffect } from "react";
import { Button, Input, Progress, Spin } from "antd";
import { fetchWordList } from "./utils/logic";
import Result from "./components/result";
import { IoCloseCircleOutline } from "react-icons/io5";
import { VscDebugStart } from "react-icons/vsc";
import { Footer } from "./components/Footer";

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [anagrams, setAnagrams] = useState<string[]>([]);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [searching, setSearching] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [options, setOptions] = useState({
    maxChar: { enable: true, value: 20 },
    maxTime: { enable: true, value: 1 },
  });

  useEffect(() => {
    const loadWords = async () => {
      setWords(await fetchWordList());
      setLoading(false);
    };
    loadWords();
  }, []);

  const handleSearch = () => {
    if (worker) worker.terminate(); // Hentikan worker sebelumnya jika ada
    options.maxTime.enable &&
      setTimeout(() => {
        handleStopSearch();
        // console.log("⏰ Waktu pencarian habis.");
      }, options.maxTime.value * 60000);

    const anagramWorker = new Worker(
      new URL("./utils/worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    anagramWorker.onmessage = (event) => {
      const { results, time } = event.data;
      setAnagrams(results);
      setTime(time);
      setProgress(100);
      setSearching(false);
      console.log(`✅ Pencarian selesai dalam ${time.toFixed(2)} ms`);
    };

    setWorker(anagramWorker);
    setStarted(true);
    setAnagrams([]);
    setTime(0);
    setProgress(0);
    setSearching(true);

    anagramWorker.postMessage({ input, words });
  };

  const handleStopSearch = () => {
    if (worker) {
      worker.terminate();
      setWorker(null);
      setSearching(false);
      console.log("⛔ Pencarian dibatalkan oleh pengguna.");
    }
  };

  return (
    <div className="p-4 flex flex-col h-dvh gap-4 text-center m-auto max-w-sm justify-center">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <p className="text-xl font-bold capitalize">anagram generator</p>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Masukkan nama atau kata..."
            disabled={searching}
            maxLength={options.maxChar.enable ? options.maxChar.value : 100}
            suffix={
              options.maxChar.enable
                ? options.maxChar.value - input.length
                : 100 - input.length
            }
          />
          <div className="flex *:grow gap-4">
            <Button
              type="primary"
              onClick={handleSearch}
              disabled={searching || input.length <= 0}
            >
              <VscDebugStart size={20} /> Cari
            </Button>
            {searching && (
              <Button danger onClick={handleStopSearch}>
                <IoCloseCircleOutline size={20} /> Batal
              </Button>
            )}
          </div>
          {searching && (
            <div style={{ marginTop: "10px" }}>
              <Progress percent={Math.round(progress)} status="active" />
            </div>
          )}

          {started && (
            <>
              {anagrams.length > 0 ? (
                <>
                  <Result input={input} result={anagrams[0]} />
                  <Button
                    onClick={() => {
                      setStarted(false);
                      setInput("");
                    }}
                  >
                    <IoCloseCircleOutline size={20} />
                    Tutup
                  </Button>
                </>
              ) : !searching ? (
                <p>Tidak ada yang ditemukan.</p>
              ) : null}
              <p className="text-slate-400 text-xs">
                waktu pencarian : {(time/1000).toFixed(2)} detik
              </p>
            </>
          )}
        </>
      )}
      <Footer setOptions={setOptions} options={options} Number={Number} />
    </div>
  );
};

export default App;
