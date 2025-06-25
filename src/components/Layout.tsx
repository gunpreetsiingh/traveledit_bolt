import { ReactNode } from 'react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { 
  Home, 
  Compass, 
  MessageSquare, 
  Heart, 
  User,
  LayoutDashboard,
  ListTodo,
  Map,
  Settings,
  Key,
  Package,
  Edit,
  Shield,
  Palette
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  userRole?: 'client' | 'advisor' | 'admin';
}

export default function Layout({ children, className = '', userRole = 'client' }: LayoutProps) {
  // Define navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case 'client':
        return [
          { name: 'Home', url: '/', icon: Home },
          { name: 'Explore', url: '/explore', icon: Compass },
          { name: 'Chat', url: '/client/chat', icon: MessageSquare },
          { name: 'Saved', url: '/client/saved', icon: Heart },
          { name: 'Profile', url: '/client/profile', icon: User }
        ];
      case 'advisor':
        return [
          { name: 'Home', url: '/', icon: Home },
          { name: 'Dashboard', url: '/advisor/dashboard', icon: LayoutDashboard },
          { name: 'Tasks', url: '/advisor/tasks', icon: ListTodo },
          { name: 'Destinations', url: '/advisor/destination-checks', icon: Map },
          { name: 'Chat', url: '/client/chat', icon: MessageSquare },
          { name: 'Settings', url: '/advisor/admin/settings', icon: Settings }
        ];
      case 'admin':
        return [
          { name: 'Home', url: '/', icon: Home },
          { name: 'Dashboard', url: '/advisor/dashboard', icon: LayoutDashboard },
          { name: 'Builder', url: '/advisor/admin/questionnaire-builder', icon: Edit },
          { name: 'Trip Elements', url: '/advisor/admin/trip-elements', icon: Package },
          { name: 'Components', url: '/advisor/admin/components', icon: Palette },
          { name: 'Access', url: '/advisor/admin/access', icon: Key },
          { name: 'Settings', url: '/advisor/admin/settings', icon: Settings }
        ];
      default:
        return [
          { name: 'Home', url: '/', icon: Home },
          { name: 'Explore', url: '/explore', icon: Compass }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <NavBar items={getNavItems()} />
      
      {/* Main Content */}
      <main className={`${className}`}>
        {children}
      </main>
    </div>
  );
}