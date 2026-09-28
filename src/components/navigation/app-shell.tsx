import {AppHeader} from "@/components/navigation/app-header";import {BottomNav} from "@/components/navigation/bottom-nav";import {Sidebar} from "@/components/navigation/sidebar";
export function AppShell({children}:{children:React.ReactNode}){return <div className="min-h-dvh lg:pl-[232px]"><Sidebar/><div className="min-h-dvh"><AppHeader/>{children}</div><BottomNav/></div>}
