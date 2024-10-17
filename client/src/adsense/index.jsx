import React, { useEffect } from "react";

const AdsComponent = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error: ", e);
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: "350px",
          height: "150px",
        }}
        data-ad-client="ca-pub-7788263783729305"
        data-adtest="on"
        data-ad-slot="8429412170"
      ></ins>
    </>
  );
};

export default AdsComponent;
