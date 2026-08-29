import { Suspense } from "react";
import App from "@/components/App";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}
