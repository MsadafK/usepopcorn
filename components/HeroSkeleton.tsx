import Skeleton from "./Skeleton";

export default function HeroSkeleton() {
  return (
    <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden bg-surface sm:h-[55vh]">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
}
