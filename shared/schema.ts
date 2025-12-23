import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  url: text("url").notNull(),
  coverUrl: text("cover_url"),
  duration: text("duration"),
  isFavorite: boolean("is_favorite").default(false),
});

export const insertSongSchema = createInsertSchema(songs).omit({ id: true });

export type Song = typeof songs.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;
