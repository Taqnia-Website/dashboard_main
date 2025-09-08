import { useLocation, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  FolderOpen,
  Star,
  Link,
  FileText,
  Users,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const menuItems = [
  { title: 'dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'projects', url: '/dashboard/projects', icon: FolderOpen },
  { title: 'reviews', url: '/dashboard/reviews', icon: Star },
  { title: 'socialLinks', url: '/dashboard/social-links', icon: Link },
  { title: 'articles', url: '/dashboard/articles', icon: FileText },
  { title: 'clients', url: '/dashboard/clients', icon: Users },
  { title: 'chat', url: '/dashboard/chat', icon: MessageSquare },
  { title: 'profile', url: '/dashboard/profile', icon: User },
  { title: 'userManagement', url: '/dashboard/users', icon: Settings },
  { title: 'emails', url: '/dashboard/emails', icon: FileText },
  { title: 'siteSettings', url: '/dashboard/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const currentPath = location.pathname;
  const [chatCount, setChatCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);

  const isActive = (path: string) => currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const playChatSound = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const g = ctx.createGain();
        g.connect(ctx.destination);
        const beep = (time: number, freq: number) => {
          const o = ctx.createOscillator();
          o.type = 'triangle';
          o.frequency.value = freq;
          o.connect(g);
          g.gain.setValueAtTime(0.0001, time);
          g.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
          o.start(time);
          o.stop(time + 0.19);
        };
        const now = ctx.currentTime;
        beep(now, 520);
        beep(now + 0.22, 660);
      } catch {}
    };
    const playEmailSound = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 880;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        o.start();
        o.stop(ctx.currentTime + 0.21);
      } catch {}
    };
    const onChat = (e: Event) => {
      const detail = (e as CustomEvent<number | undefined>).detail;
      playChatSound();
      setChatCount((c) => c + (typeof detail === 'number' ? detail : 1));
    };
    const onEmails = (e: Event) => {
      const detail = (e as CustomEvent<number | undefined>).detail;
      playEmailSound();
      setEmailCount((c) => c + (typeof detail === 'number' ? detail : 1));
    };
    window.addEventListener('notify:chat', onChat as EventListener);
    window.addEventListener('notify:emails', onEmails as EventListener);
    return () => {
      window.removeEventListener('notify:chat', onChat as EventListener);
      window.removeEventListener('notify:emails', onEmails as EventListener);
    };
  }, []);

  useEffect(() => {
    if (currentPath.startsWith('/dashboard/chat')) {
      setChatCount(0);
    }
    if (currentPath.startsWith('/dashboard/emails')) {
      setEmailCount(0);
    }
  }, [currentPath]);

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>تقنيا داشبورد</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="relative">
                        {t(item.title)}
                        {(item.url === '/dashboard/chat' && chatCount > 0) && (
                          <span className="ml-2 inline-flex items-center justify-center text-[10px] leading-none rounded-full bg-red-600 text-white px-1.5 py-0.5 min-w-[16px]">{chatCount}</span>
                        )}
                        {(item.url === '/dashboard/emails' && emailCount > 0) && (
                          <span className="ml-2 inline-flex items-center justify-center text-[10px] leading-none rounded-full bg-red-600 text-white px-1.5 py-0.5 min-w-[16px]">{emailCount}</span>
                        )}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}