'use client'

import { usePathname, useRouter } from "next/navigation"

export function NavButton({label, path} : {label: string, path: string}) {
  const router = useRouter()
  const pathname = usePathname() // Reads the current active route
  
  // Check if the current route matches the button's path
  const isActive = pathname === path
  
  const goRoute = () => {
    router.push(path);
  }

  return (
    <button className={
      `flex items-center py-1.5 px-3 border-l-2 
      ${isActive ? "border-app-primary" : "border-app-border"}
      `
    }
    
    onClick={goRoute}>
      <span> {label} </span>  
    </button>
  )
}