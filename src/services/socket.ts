// src/services/socket.ts
import { io } from 'socket.io-client';
import { API_BASE_URL } from './apiConfig';

// Buat instance socket dan ekspor
export const socket = io(API_BASE_URL);