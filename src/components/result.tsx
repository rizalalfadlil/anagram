import { useEffect, useRef, useState } from "react";
import Xarrow from "react-xarrows";

export default function Result({
  input,
  result,
}: {
  input: string;
  result: string;
  }) {
  const [SavedInput] = useState(input);
  const SavedInputArray = SavedInput.split("");
  const resultArray = result.split("");
  const [update, setUpdate] = useState(0);
  const [showArrow, setShowArrow] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null);

  let usedSavedInput = new Set<number>();
  let usedResult = new Set<number>();

  // Gunakan ResizeObserver untuk memantau perubahan ukuran elemen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      setUpdate((prev) => prev + 1); // Memaksa komponen re-render
      setShowArrow(false)
      setTimeout(() => {
        setShowArrow(true)
      }, 300);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef} // Tambahkan ref ke container utama
      className="rounded-md bg-slate-100 grow space-y-8 text-xl z-20 grid place-content-around text-center uppercase font-medium *:gap-1"
    >
      {/* SavedInput */}
      <div className="flex justify-center flex-wrap *:min-w-2">
        {SavedInputArray.map((char, i) => (
          <div key={"SavedInput-" + i} id={"SavedInput-" + i} className="">
            {char}
          </div>
        ))}
      </div>
      {/* Result */}
      <div className="flex justify-center flex-wrap *:min-w-2">
        {resultArray.map((char, i) => (
          <div key={"result-" + i} id={"result-" + i} className="">
            {char}
          </div>
        ))}
      </div>

      {/* Garis */}
      {SavedInputArray.map((char, i) => {
        for (let j = 0; j < resultArray.length; j++) {
          if (
            char !== " " &&
            char === resultArray[j] &&
            !usedSavedInput.has(i) &&
            !usedResult.has(j)
          ) {
            usedSavedInput.add(i);
            usedResult.add(j);
            return showArrow && (
              <Xarrow
                key={`arrow-${i}-${j}-${update}`} // Paksa re-render dengan key baru
                start={`SavedInput-${i}`}
                end={`result-${j}`}
                strokeWidth={1}
                showHead={false}
                color="#8a8a8a"
                curveness={0}
              />
            );
          }
        }
        return null;
      })}
    </div>
  );
}
