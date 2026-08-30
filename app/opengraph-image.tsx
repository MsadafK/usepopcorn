import { ImageResponse } from "next/og";

export const alt = "usePopcorn - Search, rate, and track movies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0b0d",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 90,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#6741d9",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 700,
            color: "white",
          }}
        >
          usePopcorn
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a1a1aa",
            marginTop: 20,
          }}
        >
          Search, rate, and track movies
        </div>
      </div>
    ),
    { ...size }
  );
}
