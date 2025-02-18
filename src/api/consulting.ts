import { apiRequest } from '../utils/api';

interface CreateConsultingParams {
  startTime: string;
  designer_id: string;
  meet: 'ONLINE' | 'OFFLINE';
  pay: string;
}

export const createConsulting = async (params: CreateConsultingParams) => {
  try {
    const response = await apiRequest('/api/consulting/create', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response;
  } catch (error) {
    console.error('Failed to create consulting:', error);
    throw error;
  }
};