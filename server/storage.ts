import { users, songs, type User, type InsertUser, type Song, type InsertSong } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getSongs(): Promise<Song[]>;
  createSong(song: InsertSong): Promise<Song>;
  toggleFavorite(id: number, isFavorite: boolean): Promise<Song>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  private currentUserId: number;
  private currentSongId: number;

  constructor() {
    this.users = new Map();
    this.songs = new Map();
    this.currentUserId = 1;
    this.currentSongId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = this.currentSongId++;
    const song: Song = { 
      ...insertSong, 
      id,
      isFavorite: insertSong.isFavorite ?? false,
      duration: insertSong.duration ?? null,
      coverUrl: insertSong.coverUrl ?? null 
    };
    this.songs.set(id, song);
    return song;
  }

  async toggleFavorite(id: number, isFavorite: boolean): Promise<Song> {
    const song = this.songs.get(id);
    if (!song) throw new Error("Song not found");
    const updatedSong = { ...song, isFavorite };
    this.songs.set(id, updatedSong);
    return updatedSong;
  }
}

export const storage = new MemStorage();
