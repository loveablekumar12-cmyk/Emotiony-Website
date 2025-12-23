import { z } from 'zod';
import { insertSongSchema, songs } from './schema';

export const api = {
  songs: {
    list: {
      method: 'GET' as const,
      path: '/api/songs',
      responses: {
        200: z.array(z.custom<typeof songs.$inferSelect>()),
      },
    },
    toggleFavorite: {
      method: 'PATCH' as const,
      path: '/api/songs/:id/favorite',
      input: z.object({ isFavorite: z.boolean() }),
      responses: {
        200: z.custom<typeof songs.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
