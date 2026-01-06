// components/TawkToChat.jsx
"use client";

import Script from "next/script";
import { useState } from "react";

export default function TawkToChat() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) return null;

  return (
    <Script
      id="tawk-to-script"
      strategy="lazyOnload"
      onLoad={() => {
        setLoaded(true);
        console.log("Tawk.to loaded");
      }}
    >
      {`
        if (!window.Tawk_API) {
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/695c4c2ab1e0d21980f0c6af/1je88j1um';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        }
      `}
    </Script>
  );
}
