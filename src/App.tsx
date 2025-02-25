import { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  InputNumber,
  Progress,
  Spin,
} from "antd";
import { fetchWordList } from "./utils/logic";
import Result from "./result";
import { MdCancel } from "react-icons/md";

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [anagrams, setAnagrams] = useState<string[]>([]);
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
      setProgress(100);
      setSearching(false);
      console.log(`✅ Pencarian selesai dalam ${time.toFixed(2)} ms`);
    };

    setWorker(anagramWorker);
    setStarted(true);
    setAnagrams([]);
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
            <Button type="primary" onClick={handleSearch} disabled={searching}>
              Cari
            </Button>
            {searching && (
              <Button danger onClick={handleStopSearch}>
                <MdCancel /> Batal
              </Button>
            )}
          </div>
          {searching && (
            <div style={{ marginTop: "10px" }}>
              <Progress percent={Math.round(progress)} status="active" />
            </div>
          )}

          {started ? (
            <>
              {anagrams.length > 0 ? (
                <Result input={input} result={anagrams[0]} />
              ) : !searching ? (
                <p>Tidak ada yang ditemukan.</p>
              ) : null}
            </>
          ) : (
            <Collapse
              items={[
                {
                  key: "1",
                  label: "Pengaturan performa",
                  children: (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-start">
                        <Checkbox
                          checked={options.maxChar.enable}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              maxChar: {
                                ...options.maxChar,
                                enable: e.target.checked,
                              },
                            })
                          }
                        />{" "}
                        <span className="grow">Batasi Maksimal Karakter</span>
                        <Input
                          disabled={!options.maxChar.enable}
                          type="number"
                          className="w-fit!"
                          max={50}
                          min={1}
                          value={options.maxChar.value}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              maxChar: {
                                enable: true,
                                value: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 text-start">
                        <Checkbox
                          checked={options.maxTime.enable}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              maxTime: {
                                ...options.maxTime,
                                enable: e.target.checked,
                              },
                            })
                          }
                        />{" "}
                        <span className="grow">Batasi Waktu Pencarian</span>
                        <Input
                          disabled={!options.maxTime.enable}
                          type="number"
                          className="w-fit!"
                          max={50}
                          min={1}
                          value={options.maxTime.value}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              maxTime: {
                                enable: true,
                                value: Number(e.target.value),
                              },
                            })
                          }
                          suffix={<span className="text-sm">menit</span>}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          )}
          <footer>
            <p>sumber</p>
            <a href="https://www.kaggle.com/datasets/imroze/indonesian-and-malaysian-common-words-list">
              daftar kata
            </a>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
