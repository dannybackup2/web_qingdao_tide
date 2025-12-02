import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Canvas } from '@tarojs/components';
import { TideData } from '../../types/tide';
import { getLunarDateStr } from '../../utils/helpers';
import { TideChartRenderer } from '../../utils/canvasChart';
import styles from './index.module.scss';

interface TideChartProps {
  data: TideData[];
  date?: string;
  tideType?: string;
}

const TideChart: React.FC<TideChartProps> = ({ data, date, tideType }) => {
  const canvasId = `tideChart-${date || Date.now()}`;

  useEffect(() => {
    if (!data.length) return;

    const drawChart = async () => {
      try {
        const ctx = Taro.createCanvasContext(canvasId);
        if (!ctx) {
          console.error('[TideChart] Failed to create canvas context');
          return;
        }

        const renderer = new TideChartRenderer(data, {
          width: 600,
          height: 300,
          padding: 40,
        });

        renderer.drawChart(ctx);
        await ctx.draw();
      } catch (error) {
        console.error('[TideChart] Error drawing chart:', error);
      }
    };

    // Delay drawing to ensure canvas is mounted
    const timer = setTimeout(drawChart, 100);
    return () => clearTimeout(timer);
  }, [data, canvasId]);

  const highTides = data.filter(d => d.type === '高潮');
  const lowTides = data.filter(d => d.type === '低潮');

  return (
    <div className={styles.container}>
      {date && (
        <div className={styles.header}>
          <span className={styles.date}>
            {date} ({getLunarDateStr(date)})
          </span>
          {tideType && <span className={styles.tideType}>{tideType}</span>}
        </div>
      )}

      <div className={styles.tideInfo}>
        <span className={styles.highTide}>
          高潮: {highTides.map(d => d.time.slice(11, 16)).join(' | ') || '无'}
        </span>
        <span className={styles.lowTide}>
          低潮: {lowTides.map(d => d.time.slice(11, 16)).join(' | ') || '无'}
        </span>
      </div>

      <Canvas
        className={styles.canvas}
        canvasId={canvasId}
        type="2d"
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default TideChart;
