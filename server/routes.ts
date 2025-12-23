import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.songs.list.path, async (req, res) => {
    const songs = await storage.getSongs();
    res.json(songs);
  });

  app.patch(api.songs.toggleFavorite.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isFavorite } = api.songs.toggleFavorite.input.parse(req.body);
      const song = await storage.toggleFavorite(id, isFavorite);
      res.json(song);
    } catch (err) {
      if (err instanceof Error) {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Seed data
  const existingSongs = await storage.getSongs();
  if (existingSongs.length === 0) {
    const seedSongs = [
      {
        title: "Echoes of Silence",
        artist: "EmotionyTrack",
        url: "/music/AUD-20251219-WA0011_1766510174918.mp3",
        coverUrl: "/images/logo.jpg",
        duration: "3:45"
      },
      {
        title: "Midnight Drive",
        artist: "EmotionyTrack",
        url: "/music/AUD-20251219-WA0012_1766510205452.mp3",
        coverUrl: "/images/logo.jpg",
        duration: "4:12"
      },
      {
        title: "Urban Rhythm",
        artist: "EmotionyTrack",
        url: "/music/AUD-20251219-WA0013_1766510222231.mp3",
        coverUrl: "/images/logo.jpg",
        duration: "2:58"
      },
      {
        title: "Neon Lights",
        artist: "EmotionyTrack",
        url: "/music/AUD-20251219-WA0014_1766510239403.mp3",
        coverUrl: "/images/logo.jpg",
        duration: "3:30"
      },
      {
        title: "Deep Focus",
        artist: "EmotionyTrack",
        url: "/music/AUD-20251219-WA0017_1766510252278.mp3",
        coverUrl: "/images/logo.jpg",
        duration: "5:10"
      },
      {
        title: "Morning Haze",
        artist: "EmotionyTrack",
        url: "/music/AUD-20251219-WA0016_1766510268478.mp3",
        coverUrl: "/images/logo.jpg",
        duration: "3:15"
      }
    ];

    for (const song of seedSongs) {
      await storage.createSong(song);
    }
  }

  return httpServer;
}
