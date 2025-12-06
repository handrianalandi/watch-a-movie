import { useEffect, useRef, useState, useCallback } from "react";

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 200,
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(
    null
  );

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore) {
        onLoadMore();
      }
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => {
    if (!targetElement) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observerRef.current.observe(targetElement);

    return () => {
      if (observerRef.current && targetElement) {
        observerRef.current.unobserve(targetElement);
      }
    };
  }, [targetElement, handleIntersection, threshold]);

  return setTargetElement;
}
