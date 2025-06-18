import { Platform } from "./Platform";

export interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  added: number;
  reactions?: Record<string, number>;
  background_image_additional?: string;
  screenshots_count: number;
  screenshots?: Array<{
    id: number;
    image: string;
  }>;
  parent_platforms: {
    platform: Platform;
  }[];
  rating_top: number;
}
