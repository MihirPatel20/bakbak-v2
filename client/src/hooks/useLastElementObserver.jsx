import { useCallback, useRef } from "react";

const useLastElementObserver = (isLoading, hasNextPage, callback) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || !hasNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, callback]
  );

  return lastElementRef;
};

export default useLastElementObserver;
