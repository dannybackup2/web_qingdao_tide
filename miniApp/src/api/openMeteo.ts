import Taro from '@tarojs/taro';
import { TideResponse } from '../types/tide';

const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';

export const getTideData = async (): Promise<TideResponse> => {
  try {
    const response = await Taro.request<TideResponse>({
      url: `${BASE_URL}?latitude=36.0649&longitude=120.3804&hourly=sea_level_height_msl&timezone=Asia%2FSingapore&forecast_days=7`,
      method: 'GET',
      dataType: 'json',
    });

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error('Failed to fetch tidal data');
    }
  } catch (error) {
    console.error('Error fetching tidal data:', error);
    throw error;
  }
};
