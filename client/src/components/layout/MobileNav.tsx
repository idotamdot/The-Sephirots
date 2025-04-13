import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/icons";

export default function MobileNav() {
  const [location] = useLocation();
  
  // Only show mobile navigation items that make sense on mobile
  const mobileNavItems = navigationItems.slice(0, 4);
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-10">
      <div className="flex justify-around items-center">
        {mobileNavItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center",
              location === item.path ? "text-primary-600" : "text-gray-500"
            )}
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
