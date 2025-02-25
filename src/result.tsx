import React from "react";
import Xarrow from "react-xarrows";

export default function Result({
  input,
  result,
}: {
  input: string;
  result: string;
}) {
  const inputArray = input.split("");
  const resultArray = result.split("");

  let usedInput = new Set<number>(); // Menyimpan index yang sudah dipasangkan (input)
  let usedResult = new Set<number>(); // Menyimpan index yang sudah dipasangkan (result)

  return (
    <div className=" rounded-md bg-slate-100 grow space-y-8 text-xl z-20 grid place-content-around text-center uppercase font-medium *:gap-1">
      {/* Input */}
      <div className="flex justify-center flex-wrap *:min-w-2">
        {inputArray.map((char, i) => (
          <div
            key={"input-" + i}
            id={"input-" + i}
            className=""
          >
            {char}
          </div>
        ))}
      </div>
      {/* Result */}
      <div className="flex justify-center flex-wrap *:min-w-2">
        {resultArray.map((char, i) => (
          <div
            key={"result-" + i}
            id={"result-" + i}
            className=""
          >
            {char}
          </div>
        ))}
      </div>

      {/* Garis hanya untuk satu pasangan per karakter */}
      {inputArray.map((char, i) => {
        for (let j = 0; j < resultArray.length; j++) {
          if (
            char !== " " && // Abaikan spasi
            char === resultArray[j] && // Hanya hubungkan karakter yang sama
            !usedInput.has(i) && // Belum digunakan di input
            !usedResult.has(j) // Belum digunakan di result
          ) {
            usedInput.add(i); // Tandai sudah digunakan
            usedResult.add(j);
            return (
              <Xarrow
                zIndex={-1} // Garis di bawah karakter
                key={`arrow-${i}-${j}`}
                start={`input-${i}`}
                end={`result-${j}`}
                strokeWidth={1} // Garis lebih tipis
                showHead={false} // Hilangkan panah
                color="#8a8a8a" // Warna garis hitam (bisa diubah)
                curveness={0} // Garis lurus
              />
            );
          }
        }
        return null;
      })}
    </div>
  );
}
