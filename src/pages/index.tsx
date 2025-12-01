import React, { useEffect, useState } from 'react';
import TideChart from '../components/TideChart';
import { fetchTideData } from '../utils/fetchTideData';
import { TideDay } from '../types/tide';
import { Lunar } from 'lunar-javascript';

const camNames = ['石老人', '栈桥', '小麦岛'];
const camImgUrls = [
  '/images/shilaoren.jpg',
  '/images/zhanqiao.jpg',
  '/images/xiaomaidao.jpg'
];

// 已弃用本地 getTideType，统一使用 utils/fetchTideData.ts 中的 getTideType

const IndexPage: React.FC = () => {
    const [tideDays, setTideDays] = useState<TideDay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTideData = async () => {
            try {
                const data = await fetchTideData();
                setTideDays(data);
            } catch (err) {
                setError('Failed to fetch tidal data');
            } finally {
                setLoading(false);
            }
        };

        getTideData();
    }, []);

    if (loading) {
        return <div>Loading tidal data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',fontWeight:'bold',fontSize:16,marginBottom:8,color:'#1a5490'}}>
                Tide Height (m)
            </div>
            <h1 style={{textAlign:'center',color:'#1a5490'}}>青岛未来两天潮汐数据</h1>
            {tideDays.slice(0, 2).map((day, idx) => { // 只显示前两天
                const tideType = day.type;
                return (
                    <div key={day.date}>
                        {/* 传递汛型到 TideChart，显示在日期右侧 */}
                        <TideChart
                            data={day.data}
                            date={day.date}
                        >
                            <span style={{marginLeft:12,fontSize:16,fontWeight:'bold',color:'#333'}}>{tideType}</span>
                        </TideChart>
                    </div>
                );
            })}
            {/* 三个实时图像分区，地点为石老人、栈桥、小麦岛 */}
            <div style={{ height: 24 }} />
            <h2 style={{color:'#1a5490',marginTop:40,marginBottom:24,textAlign:'center',fontSize:20,fontWeight:'bold'}}>实时图像</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: '12px' }}>
                {camImgUrls.map((url, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 12, color: '#1a5490', fontSize: 16 }}>{camNames[idx]}</div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', height: 180, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                            <img
                                src={url}
                                alt={camNames[idx] + '实时图像'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: 12 }}
                                draggable={false}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/* copyright 信息 */}
            <div style={{ marginTop: 60, width: '100%', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, paddingBottom: 24, textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                Copyright © {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default IndexPage;
