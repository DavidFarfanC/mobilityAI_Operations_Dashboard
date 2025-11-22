import { useQuery } from '@tanstack/react-query';
import { fetchIncidents, fetchKpis, fetchTrend } from './fakeApi';
import { KPIResponse, TrendResponse } from '../types';

export const useIncidents = () =>
  useQuery({
    queryKey: ['incidentes'],
    queryFn: fetchIncidents,
    refetchInterval: 8000,
  });

export const useKpis = () =>
  useQuery<KPIResponse>({
    queryKey: ['kpis'],
    queryFn: fetchKpis,
    refetchInterval: 8000,
  });

export const useTrend = () =>
  useQuery<TrendResponse>({
    queryKey: ['tendencias'],
    queryFn: fetchTrend,
    refetchInterval: 12000,
  });
