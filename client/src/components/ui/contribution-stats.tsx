import { Card, CardContent } from "@/components/ui/card";

interface ContributionStatsProps {
  title: string;
  stats: {
    icon: string;
    label: string;
    value: number;
  }[];
  userLevel?: string;
}

export default function ContributionStats({ 
  title, 
  stats,
  userLevel
}: ContributionStatsProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">{title}</h3>
          {userLevel && (
            <span className="text-xs px-2 py-1 rounded-full bg-accent-100 text-accent-700">
              {userLevel}
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <i className={`${stat.icon} text-gray-400 mr-2`}></i>
                <span className="text-sm text-gray-700">{stat.label}</span>
              </div>
              <span className="font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
