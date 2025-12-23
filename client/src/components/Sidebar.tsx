import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Library, 
  Search, 
  ListMusic, 
  Mic2,
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Library, label: "Library", href: "/library" },
    { icon: ListMusic, label: "Playlists", href: "/playlists" },
    { icon: Mic2, label: "Artists", href: "/artists" },
  ];

  const secondaryNav = [
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden glass-panel"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/50 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 ring-1 ring-white/10">
              <img 
                src="/images/logo.jpg" 
                alt="EmotionyTrack Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-white">
                Emotiony<span className="text-primary">Track</span>
              </h1>
              <p className="text-xs text-muted-foreground">Feel the beat</p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1">
            <div className="text-xs font-mono font-medium text-muted-foreground mb-4 px-2 uppercase tracking-wider">
              Menu
            </div>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                    location === item.href 
                      ? "bg-primary/10 text-primary neon-glow" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-white"
                  )} />
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Secondary Navigation */}
          <div className="pt-6 border-t border-border/50">
            {secondaryNav.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* User Profile Mini */}
          <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Music Lover</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
