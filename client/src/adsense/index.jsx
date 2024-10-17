import React, { useEffect } from "react";

const AdsComponent = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log("Adsense loaded");
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
        data-ad-client="ca-pub-XXXXXXXXXXXXX"
        data-adtest="on"
        data-ad-slot="XXXXXXXXXXX"
      ></ins>
    </>
  );
};

export default AdsComponent;
