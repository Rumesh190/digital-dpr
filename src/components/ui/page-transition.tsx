"use client";
import {motion,useReducedMotion} from "motion/react";
import {pageReveal} from "@/lib/motion";
export function PageTransition({children,className=""}:{children:React.ReactNode;className?:string}){const reduce=useReducedMotion();return <motion.div {...(reduce?{}:pageReveal)} className={className}>{children}</motion.div>}
