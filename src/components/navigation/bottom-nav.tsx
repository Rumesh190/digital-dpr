"use client";
import {CalendarDays,HardHat,UserRound} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
const items=[{label:"Today",href:"/today",icon:HardHat},{label:"Calendar",href:"/calendar",icon:CalendarDays},{label:"Profile",href:"/profile",icon:UserRound}];
export function BottomNav(){const path=usePathname();return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(68px+env(safe-area-inset-bottom))] items-start border-t border-[#e4e4e7] bg-white/95 px-3 pt-1.5 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(24,24,27,.035)] backdrop-blur-md lg:hidden">{items.map(({label,href,icon:Icon})=>{const active=path.startsWith(href);return <Link key={href} href={href} aria-current={active?"page":undefined} className={`focus-ring relative flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${active?"text-[#e14d48]":"text-[#a1a1aa]"}`}><Icon size={20} strokeWidth={active?2.3:1.8}/><span>{label}</span></Link>})}</nav>}
