"use client";
import {CalendarDays,House,UserRound} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
const items=[{label:"Today",href:"/today",icon:House},{label:"Calendar",href:"/calendar",icon:CalendarDays},{label:"Profile",href:"/profile",icon:UserRound}];
export function BottomNav(){const path=usePathname();return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(74px+env(safe-area-inset-bottom))] items-start border-t border-black/[.06] bg-white/94 px-3 pt-1.5 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(24,24,27,.045)] backdrop-blur-xl lg:hidden">{items.map(({label,href,icon:Icon})=>{const active=path.startsWith(href);return <Link key={href} href={href} aria-current={active?"page":undefined} className={`focus-ring relative flex h-[62px] flex-1 flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] font-semibold transition-all duration-200 ${active?"bg-[#fff0ef] text-[#e54c47]":"text-[#747987]"}`}><Icon size={21} strokeWidth={active?2.4:1.8}/><span>{label}</span></Link>})}</nav>}
