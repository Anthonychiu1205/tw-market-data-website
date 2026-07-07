type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

const CANDLES: Candle[] = [
  { open: 812, high: 821, low: 806, close: 818 },
  { open: 818, high: 829, low: 814, close: 826 },
  { open: 826, high: 834, low: 820, close: 823 },
  { open: 823, high: 838, low: 821, close: 835 },
  { open: 835, high: 842, low: 828, close: 831 },
  { open: 831, high: 847, low: 829, close: 844 },
  { open: 844, high: 856, low: 838, close: 849 },
  { open: 849, high: 860, low: 843, close: 846 },
  { open: 846, high: 868, low: 844, close: 862 },
  { open: 862, high: 872, low: 855, close: 866 },
  { open: 866, high: 875, low: 861, close: 871 },
  { open: 871, high: 883, low: 868, close: 878 },
  { open: 878, high: 889, low: 874, close: 884 },
  { open: 884, high: 892, low: 879, close: 881 },
  { open: 881, high: 896, low: 880, close: 893 },
  { open: 893, high: 901, low: 888, close: 897 },
  { open: 897, high: 906, low: 891, close: 899 },
  { open: 899, high: 909, low: 894, close: 896 },
  { open: 896, high: 911, low: 894, close: 906 },
  { open: 906, high: 915, low: 901, close: 911 },
  { open: 911, high: 919, low: 905, close: 908 },
  { open: 908, high: 918, low: 903, close: 914 },
  { open: 914, high: 923, low: 910, close: 920 },
  { open: 920, high: 928, low: 915, close: 924 },
  { open: 924, high: 931, low: 918, close: 922 },
  { open: 922, high: 934, low: 919, close: 930 },
  { open: 930, high: 938, low: 924, close: 932 },
  { open: 932, high: 941, low: 927, close: 936 },
];

const CHART = {
  width: 560,
  height: 260,
  left: 26,
  right: 50,
  top: 20,
  bottom: 34,
};

const VALUES = CANDLES.flatMap((candle) => [candle.high, candle.low]);
const MIN = Math.min(...VALUES) - 6;
const MAX = Math.max(...VALUES) + 6;
const BODY_WIDTH = 10;

function yScale(value: number) {
  const drawHeight = CHART.height - CHART.top - CHART.bottom;
  const ratio = (value - MIN) / (MAX - MIN);
  return CHART.top + drawHeight - ratio * drawHeight;
}

function xScale(index: number) {
  const drawWidth = CHART.width - CHART.left - CHART.right;
  const step = drawWidth / (CANDLES.length - 1);
  return CHART.left + index * step;
}

function maPath() {
  const points = CANDLES.map((candle, index) => `${index === 0 ? "M" : "L"} ${xScale(index).toFixed(2)} ${yScale(candle.close).toFixed(2)}`);
  return points.join(" ");
}

export function HeroMarketPreview() {
  return (
    <div className="relative hidden max-w-[560px] lg:ml-auto lg:block">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-slate-100 blur-3xl" />
      <div className="relative h-[430px] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
            </div>
            <p className="text-sm font-medium text-slate-700">TWSE 日線價格</p>
          </div>
        </div>

        <div className="px-6 pb-4 pt-5">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">台股資料預覽</p>
              <p className="text-base font-semibold text-slate-900">2330</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tracking-tight text-slate-900">NT$ 892</p>
              <p className="text-sm font-medium text-rose-500">+1.24%</p>
            </div>
          </div>

          <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="h-[280px] w-full">
            {[0, 1, 2, 3, 4].map((line) => {
              const y = CHART.top + ((CHART.height - CHART.top - CHART.bottom) * line) / 4;
              return <line key={line} x1={CHART.left} y1={y} x2={CHART.width - CHART.right} y2={y} stroke="rgba(148,163,184,0.34)" strokeWidth="1" />;
            })}

            <path d={maPath()} fill="none" stroke="#64748b" strokeOpacity="0.55" strokeWidth="2" />

            {CANDLES.map((candle, index) => {
              const x = xScale(index);
              const openY = yScale(candle.open);
              const closeY = yScale(candle.close);
              const highY = yScale(candle.high);
              const lowY = yScale(candle.low);
              const top = Math.min(openY, closeY);
              const height = Math.max(2, Math.abs(closeY - openY));
              const rising = candle.close >= candle.open;

              return (
                <g key={index}>
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke={rising ? "#0f172a" : "#94a3b8"} strokeWidth="1.2" />
                  <rect x={x - BODY_WIDTH / 2} y={top} width={BODY_WIDTH} height={height} rx="1.5" fill={rising ? "#0f172a" : "#cbd5e1"} />
                </g>
              );
            })}

            <text x={CHART.width - CHART.right + 8} y={yScale(MAX - 6)} className="fill-slate-400 text-[10px]">
              920
            </text>
            <text x={CHART.width - CHART.right + 8} y={yScale((MAX + MIN) / 2)} className="fill-slate-400 text-[10px]">
              880
            </text>
            <text x={CHART.width - CHART.right + 8} y={yScale(MIN + 6)} className="fill-slate-400 text-[10px]">
              840
            </text>
            <text x={CHART.left} y={CHART.height - 10} className="fill-slate-400 text-[10px]">
              Apr
            </text>
            <text x={CHART.width * 0.48} y={CHART.height - 10} className="fill-slate-400 text-[10px]">
              May
            </text>
            <text x={CHART.width - CHART.right - 14} y={CHART.height - 10} className="fill-slate-400 text-[10px]">
              Jun
            </text>
          </svg>
        </div>

        <div className="border-t border-slate-200/70 px-6 py-4 text-sm text-slate-600">
          2330 台積電&nbsp;&nbsp;&nbsp;&nbsp;收盤 892&nbsp;&nbsp;&nbsp;&nbsp;MA20 871.4&nbsp;&nbsp;&nbsp;&nbsp;來源 TWSE
        </div>
      </div>
    </div>
  );
}
