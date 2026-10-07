import React, { useEffect, useRef, useState } from 'react';
import { Asset, Candle, Trade } from '../types/trade';
import { Activity, BarChart2, TrendingUp, Maximize2 } from 'lucide-react';

interface TradingChartProps {
  asset: Asset;
  candles: Candle[];
  activeTrades: Trade[];
  currentPrice: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  asset,
  candles,
  activeTrades,
  currentPrice,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Redraw canvas whenever candles or activeTrades or currentPrice changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const rightMargin = 80;
    const bottomMargin = 26;
    const topMargin = 24;
    const chartWidth = width - rightMargin;
    const chartHeight = height - bottomMargin - topMargin;

    // Clear background
    ctx.fillStyle = '#0d111a';
    ctx.fillRect(0, 0, width, height);

    // Calculate Price Range
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    // Also include active trade strike prices in bounds
    activeTrades.forEach((t) => {
      if (t.strikePrice < minPrice) minPrice = t.strikePrice;
      if (t.strikePrice > maxPrice) maxPrice = t.strikePrice;
    });

    if (currentPrice < minPrice) minPrice = currentPrice;
    if (currentPrice > maxPrice) maxPrice = currentPrice;

    // Add 8% buffer top and bottom
    const pricePadding = (maxPrice - minPrice) * 0.12 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceSpan = maxPrice - minPrice;

    const getY = (val: number) => {
      return topMargin + (1 - (val - minPrice) / priceSpan) * chartHeight;
    };

    // Draw Subtle Horizontal Grid & Price Ticks
    const gridLines = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i <= gridLines; i++) {
      const p = minPrice + (priceSpan / gridLines) * i;
      const y = getY(p);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price label on right rail
      ctx.fillStyle = '#64748b';
      ctx.fillText(p.toFixed(asset.decimals), chartWidth + 8, y + 4);
    }

    // Candle geometry
    const candleCount = candles.length;
    const candleWidth = Math.max(4, chartWidth / candleCount - 3);
    const candleSpacing = chartWidth / candleCount;

    // Draw Candles or Area Chart
    if (chartType === 'candles') {
      candles.forEach((c, index) => {
        const x = index * candleSpacing + candleSpacing / 2;
        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        const isBullish = c.close >= c.open;
        const candleColor = isBullish ? '#10b981' : '#f43f5e';
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));

        // Draw Wick
        ctx.strokeStyle = candleColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = candleColor;
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

        // Volume Bar at bottom
        const maxVol = 120;
        const volHeight = Math.min(28, (c.volume / maxVol) * 28);
        ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
        ctx.fillRect(x - candleWidth / 2, height - bottomMargin - volHeight, candleWidth, volHeight);
      });
    } else {
      // Area / Line Chart
      ctx.beginPath();
      candles.forEach((c, index) => {
        const x = index * candleSpacing + candleSpacing / 2;
        const y = getY(c.close);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Gradient under curve
      ctx.lineTo(chartWidth, height - bottomMargin);
      ctx.lineTo(0, height - bottomMargin);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, topMargin, 0, height - bottomMargin);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      candles.forEach((c, index) => {
        const x = index * candleSpacing + candleSpacing / 2;
        const y = getY(c.close);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Moving Average Line (Simple MA9)
    if (showIndicators && candles.length >= 9) {
      const maPeriod = 7;
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      for (let i = maPeriod - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < maPeriod; j++) {
          sum += candles[i - j].close;
        }
        const maVal = sum / maPeriod;
        const x = i * candleSpacing + candleSpacing / 2;
        const y = getY(maVal);
        if (i === maPeriod - 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Active Trades Strike Lines
    activeTrades.forEach((trade) => {
      const tradeY = getY(trade.strikePrice);
      const isUp = trade.direction === 'UP';
      const isWinning = isUp ? currentPrice > trade.strikePrice : currentPrice < trade.strikePrice;
      const lineColor = isWinning ? '#10b981' : '#f43f5e';

      // Dashed Strike Price Line
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, tradeY);
      ctx.lineTo(chartWidth, tradeY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trade badge on line
      const tagText = `${isUp ? '▲ UP' : '▼ DOWN'} PKR ${trade.amount.toLocaleString()}`;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(tagText).width;

      ctx.fillStyle = isWinning ? 'rgba(16, 185, 129, 0.9)' : 'rgba(244, 63, 94, 0.9)';
      ctx.beginPath();
      ctx.roundRect(16, tradeY - 11, textWidth + 14, 22, 4);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(tagText, 23, tradeY + 4);
    });

    // Current Price Pulsing Line
    const currentY = getY(currentPrice);
    const lastCandle = candles[candles.length - 1];
    const isBull = currentPrice >= (lastCandle?.open || currentPrice);
    const themeColor = isBull ? '#10b981' : '#f43f5e';

    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pulsing circle at right edge of chart
    ctx.beginPath();
    ctx.arc(chartWidth - 4, currentY, 5, 0, Math.PI * 2);
    ctx.fillStyle = themeColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(chartWidth - 4, currentY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Current Price Badge on Right Axis
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.roundRect(chartWidth + 2, currentY - 12, rightMargin - 6, 24, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(currentPrice.toFixed(asset.decimals), chartWidth + 6, currentY + 4);

    // Crosshair if mouse hover
    if (mousePos && mousePos.x < chartWidth && mousePos.y < height - bottomMargin) {
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height - bottomMargin);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(chartWidth, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Time Axis labels at bottom
    ctx.fillStyle = '#475569';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const timeStep = Math.floor(candleCount / 5);
    for (let i = 0; i < candleCount; i += timeStep) {
      const c = candles[i];
      if (c) {
        const x = i * candleSpacing + candleSpacing / 2;
        const d = new Date(c.timestamp);
        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        ctx.fillText(timeStr, x, height - 8);
      }
    }
  }, [candles, chartType, showIndicators, activeTrades, currentPrice, asset, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const candleSpacing = (rect.width - 80) / candles.length;
    const index = Math.floor(x / candleSpacing);
    if (index >= 0 && index < candles.length) {
      setHoveredCandle(candles[index]);
    } else {
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-[#0d111a] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top chart toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111624] border-b border-slate-800/80 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-wide">{asset.symbol}</span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-300">
              {asset.category}
            </span>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              +{Math.round(asset.payoutRate * 100)}% Profit
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 ml-4 text-xs font-mono-numbers">
            <div className="text-slate-400">
              Live: <span className="font-bold text-white">${currentPrice.toFixed(asset.decimals)}</span>
            </div>
            {hoveredCandle && (
              <div className="flex items-center gap-2 text-slate-400">
                <span>O: <b className="text-slate-200">{hoveredCandle.open.toFixed(asset.decimals)}</b></span>
                <span>H: <b className="text-emerald-400">{hoveredCandle.high.toFixed(asset.decimals)}</b></span>
                <span>L: <b className="text-rose-400">{hoveredCandle.low.toFixed(asset.decimals)}</b></span>
                <span>C: <b className="text-slate-200">{hoveredCandle.close.toFixed(asset.decimals)}</b></span>
              </div>
            )}
          </div>
        </div>

        {/* Chart View Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setChartType('candles')}
            title="Candlestick Chart"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              chartType === 'candles'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Candles</span>
          </button>

          <button
            onClick={() => setChartType('area')}
            title="Area Line Chart"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              chartType === 'area'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Line</span>
          </button>

          <button
            onClick={() => setShowIndicators(!showIndicators)}
            title="Toggle MA7 Indicator"
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              showIndicators
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MA(7)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Chart Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex-1 min-h-[280px] sm:min-h-[360px] md:min-h-[460px] cursor-crosshair overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

        {/* Live Market Pulsing Indicator in upper corner */}
        <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-500/30 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-[11px] font-black text-amber-300 tracking-wide uppercase flex items-center gap-1">
            <span>HADIA VIP FEED</span>
            <span className="text-slate-500 font-normal">•</span>
            <span className="text-emerald-400 font-semibold">100% Real-Time</span>
          </span>
        </div>

        {/* Active Trade Quick Overlay Pills */}
        {activeTrades.length > 0 && (
          <div className="absolute bottom-10 left-4 flex flex-col gap-1.5 pointer-events-none">
            {activeTrades.map((trade) => {
              const diff = currentPrice - trade.strikePrice;
              const isWin = trade.direction === 'UP' ? diff > 0 : diff < 0;
              const timeLeft = Math.max(0, Math.ceil((trade.closeTime - Date.now()) / 1000));
              return (
                <div
                  key={trade.id}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono-numbers backdrop-blur-md border shadow-lg ${
                    isWin
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                  }`}
                >
                  <span className="font-bold">{trade.direction === 'UP' ? '▲ CALL' : '▼ PUT'}</span>
                  <span>PKR {trade.amount.toLocaleString()}</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 font-bold">{timeLeft}s</span>
                  <span className="font-bold">{isWin ? 'IN PROFIT 🟢' : 'OUT 🔴'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
