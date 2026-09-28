import type {Metadata,Viewport} from "next";
import {Geist} from "next/font/google";
import "./globals.css";
const geist=Geist({variable:"--font-geist",subsets:["latin"]});
export const metadata:Metadata={title:"Digital DPR",description:"The daily rhythm of your site, clearly recorded."};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#f7f8fa"};
export default function RootLayout({children}:LayoutProps<"/">){return <html lang="en" className={geist.variable}><body>{children}</body></html>}
