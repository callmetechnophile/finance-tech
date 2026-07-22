import { useEffect, useRef, useState } from "react";

export function useInView(options?: { triggerOnce?: boolean; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!options?.triggerOnce) {
          setInView(false);
        }
      },
      { threshold: options?.threshold ?? 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [options?.triggerOnce, options?.threshold]);

  return { ref, inView };
}
