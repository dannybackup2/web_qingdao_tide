import React, { useEffect, useRef } from 'react';
import { Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TideData } from '../../types/tide';
import { formatTime, getLunarDateStr } from '../../utils/helpers';
import { TideChartRenderer } from '../../utils/canvasChart';
import styles from './index.module.scss';

interface TideChartProps {
  data: TideData[];
  date?: string;
  tideType?: string;
}

const TideChart: React.FC<TideChartProps> = ({ data, date, tideType }) => {
  const canvasId = useRef<string>(`tideChart-${Math.random().toString(36).substr(2, 9)}`).current;

  useEffect(() => {
    if (!data.length) return;

    const drawChart = async () => {
      try {
        const ctx = Taro.createCanvasContext(canvasId);
        if (!ctx) return;

        const renderer = new TideChartRenderer(data, {
          width: 600,
          height: 300,
          padding: 40,
        });

        renderer.drawChart(ctx);
        ctx.draw();
      } catch (error) {
        console.error('Error drawing chart:', error);
      }
    };

    drawChart();
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
        ref={canvasRef}
        className={styles.canvas}
        canvasId="tideChart"
        type="2d"
      />
    </div>
  );
};

export default TideChart;
