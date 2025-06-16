import { Platform } from "./Platform";

export interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string;
  metacritic: number;
  parent_platforms: {
    platform: Platform;
  }[];
}
