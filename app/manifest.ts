import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "usePopcorn",
    short_name: "usePopcorn",
    description: "Search, rate, and track movies with usePopcorn.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0d",
    theme_color: "#6741d9",
  };
}