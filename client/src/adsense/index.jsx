import React, { useEffect } from "react";

const AdsComponent = (props) => {
  const { dataAdSlot } = props;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log("Adsense loaded");
    } catch (e) {
      console.error("Adsense error: ", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "inline-block", width: "300px", height: "150px" }}
      data-ad-client="ca-pub-7788263783729305"
      data-ad-slot={dataAdSlot}
    ></ins>
  );
};

export default AdsComponent;