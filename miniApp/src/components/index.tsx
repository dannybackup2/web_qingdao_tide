import React, { useEffect, useRef } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
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
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const drawChart = async () => {
      const canvas = await canvasRef.current?.getContext('2d');
      if (!canvas) return;

      const renderer = new TideChartRenderer(data, {
        width: 600,
        height: 300,
        padding: 40,
      });

      renderer.drawChart(canvas);
    };

    drawChart();
  }, [data]);

  const highTides = data.filter(d => d.type === '高潮');
  const lowTides = data.filter(d => d.type === '低潮');

  return (
    <View className={styles.container}>
      {date && (
        <View className={styles.header}>
          <Text className={styles.date}>
            {date} ({getLunarDateStr(date)})
          </Text>
          {tideType && <Text className={styles.tideType}>{tideType}</Text>}
        </View>
      )}

      <View className={styles.tideInfo}>
        <Text className={styles.highTide}>
          高潮: {highTides.map(d => d.time.slice(11, 16)).join(' | ') || '无'}
        </Text>
        <Text className={styles.lowTide}>
          低潮: {lowTides.map(d => d.time.slice(11, 16)).join(' | ') || '无'}
        </Text>
      </View>

      <Canvas
        ref={canvasRef}
        className={styles.canvas}
        canvasId="tideChart"
        type="2d"
      />
    </View>
  );
};

export default TideChart;
