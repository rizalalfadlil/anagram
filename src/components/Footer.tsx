import {
  Button,
  Checkbox,
  Collapse,
  Input,
  Tooltip,
} from "antd";
import { RiInformationFill } from "react-icons/ri";

export function Footer({
  setOptions,
  options,
  Number,
}: {
  setOptions: any;
  options: any;
  Number: any;
}) {
  return (
    <Collapse
      items={[
        {
          key: "1",
          label: "Pengaturan performa",
          children: (
            <div className="*:py-2 text-sm">
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
                <Tooltip title="terlalu banyak karakter mungkin dapat memperlambat hasil pencarian">
                  <RiInformationFill size={20} />
                </Tooltip>
              </div>

              <div className="flex items-center gap-2 text-start">
                <Checkbox
                  checked={options.maxTime.enable}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      maxTime: { ...options.maxTime, enable: e.target.checked },
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
                <Tooltip title="batasi waktu pencarian untuk menghindari kemungkinan stuck">
                  <RiInformationFill size={20} />
                </Tooltip>
              </div>
            </div>
          ),
        },
        {
          key: "2",
          label: "Sumber",
          children: (
            <div className="flex gap-2 justify-center">
              <Button
                type="link"
                href="https://www.kaggle.com/datasets/imroze/indonesian-and-malaysian-common-words-list"
              >
                daftar kata
              </Button>
              <Button
                type="link"
                href="https://github.com/rizalalfadlil/anagram"
              >
                kode sumber
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
