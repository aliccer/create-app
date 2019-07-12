import { ENV } from './env';

export const isProduction = ENV === 'production';
export const isDevelopment = ENV === 'development';
export const isStaging = ENV === 'staging';
