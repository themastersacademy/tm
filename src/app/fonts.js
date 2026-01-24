import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Variable.ttf",
      weight: "100 900", // variable font range
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});


export const Helvetica =localFont({
    src:[

              {
      path: "../../public/fonts/HelveticaNowText-Bold.ttf", // medium
      weight: "600",
      style: "normal",
    },
       
         {
      path: "../../public/fonts/HelveticaNowText-Medium.ttf", // medium
      weight: "500",
      style: "normal",
    },
    ],
    variable:"--font-helvetica",
    display:'swap'
})

export  const ABeeZee =localFont({
    src:[
        {
            path:"../../public/fonts/abeezee-regular.ttf",
            weight:"500",
            style:'normal'
        }
    ],
    variable:"--font-abeezee",
    display:'swap'
})


export const  BeVietnamPro=localFont({
    src:[
        {
            path:'../../public/fonts/BeVietnamPro-Bold.ttf',
            weight:'600',
            style:'normal'
        }
    
    ],
    variable:"--font-beVietnamPro",
    display:'swap'
})