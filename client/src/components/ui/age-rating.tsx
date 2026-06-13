export function AgeRatingBadge({ rating }: { rating: string }) {
  const styles: Record<string, string> = {
    P: "bg-green-500 text-black",
    K: "bg-sky-500 text-black",
    T13: "bg-yellow-500 text-black",
    T16: "bg-orange-500 text-black",
    T18: "bg-red-500 text-black",
    C18: "bg-red-700 text-black",
  };

  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold shadow-sm ${
        styles[rating] ?? "bg-neutral-500 text-white rounded-xl shadow-md ring-1 ring-black/10"
      }`}
    >
      {rating}
    </span>
  );
}
