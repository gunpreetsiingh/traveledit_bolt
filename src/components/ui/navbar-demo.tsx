import { Home, User, Briefcase, FileText, Compass, MessageCircle, Heart, Settings } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Explore', url: '/explore', icon: Compass },
    { name: 'Chat', url: '/client/chat', icon: MessageCircle },
    { name: 'Wishlist', url: '/client/wishlist', icon: Heart },
    { name: 'Profile', url: '/client/profile', icon: Settings }
  ]

  return <NavBar items={navItems} />
}

// Alternative demo for advisor dashboard
export function AdvisorNavBarDemo() {
  const advisorNavItems = [
    { name: 'Dashboard', url: '/advisor/dashboard', icon: Home },
    { name: 'Tasks', url: '/advisor/tasks', icon: FileText },
    { name: 'Destinations', url: '/advisor/destination-checks', icon: Compass },
    { name: 'Settings', url: '/advisor/admin/settings', icon: Settings }
  ]

  return <NavBar items={advisorNavItems} />
}