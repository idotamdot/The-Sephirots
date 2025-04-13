import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
  showCount?: boolean;
}

export default function AvatarGroup({ 
  users, 
  max = 4, 
  size = "md", 
  className,
  showCount = true
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;
  
  const avatarSize = size === "sm" ? "w-7 h-7" : "w-10 h-10";
  const fontSizeClass = size === "sm" ? "text-xs" : "text-sm";
  
  return (
    <div className={cn("flex", className)}>
      <div className="flex -space-x-2">
        {displayUsers.map((user, index) => (
          <div 
            key={index} 
            className={cn(
              avatarSize,
              "rounded-full border-2 border-white bg-primary-100 flex items-center justify-center overflow-hidden"
            )}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName} 
                className={cn(avatarSize, "rounded-full object-cover")} 
              />
            ) : (
              <span className="text-primary-700 font-medium">
                {user.displayName.charAt(0)}
              </span>
            )}
          </div>
        ))}
        
        {remaining > 0 && showCount && (
          <div className={cn(
            avatarSize,
            "rounded-full border-2 border-white bg-primary-100 flex items-center justify-center",
            fontSizeClass, "font-medium text-primary-600"
          )}>
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
}
