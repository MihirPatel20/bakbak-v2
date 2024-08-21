import { useState, useEffect } from "react";

const useFetchImageUrl = (imageUrl) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async (url) => {
      const defaultImage =
        "http://localhost:8080/images/image172327007458649446.jpg"; // replace with your default image URL

      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          return url;
        } else {
          return defaultImage;
        }
      } catch (error) {
        console.error("Image fetch error:", error);
        return defaultImage;
      }
    };

    const loadImage = async () => {
      const resolvedUrl = await fetchImageUrl(imageUrl);
      setUrl(resolvedUrl);
      setIsLoading(false);
    };

    loadImage();
  }, [imageUrl]);

  return { url, isLoading };
};

export default useFetchImageUrl;
