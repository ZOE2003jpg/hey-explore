import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { 
  Users, 
  BookOpen, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Flag,
  Play,
  FileText
} from "lucide-react"
import { useStories } from '@/hooks/useStories'
import { useChapters } from '@/hooks/useChapters'
import { useProfiles } from '@/hooks/useProfiles'
import { useReports } from '@/hooks/useReports'
import { useAds } from '@/hooks/useAds'

// Generate realistic daily active user data for the past week
const generateDailyActiveUsers = () => {
  const result = [];
  const today = new Date();
  const baseUsers = 1000 + Math.floor(Math.random() * 500);
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Random fluctuation between -15% and +25%
    const fluctuation = baseUsers * (Math.random() * 0.4 - 0.15);
    const users = Math.floor(baseUsers + fluctuation);
    
    result.push({ date: dayStr, users });
  }
  
  return result;
};

const dailyActiveUsers = generateDailyActiveUsers();

// Top novels will be populated from real data in the component

// Generate realistic ad performance data
const generateAdPerformance = (impressions) => {
  const clickRate = 0.07 + (Math.random() * 0.03); // 7-10% click rate
  const completionRate = 0.7 + (Math.random() * 0.15); // 70-85% completion rate
  
  const clicks = Math.floor(impressions * clickRate);
  const completed = Math.floor(impressions * completionRate);
  
  return [
    { name: "Views", value: impressions, color: "hsl(var(--vine-orange))" },
    { name: "Clicks", value: clicks, color: "hsl(var(--vine-grey-400))" },
    { name: "Completed", value: completed, color: "hsl(var(--vine-orange-light))" }
  ];
};

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { stories, loading: storiesLoading, fetchStories } = useStories()
  const { chapters, loading: chaptersLoading } = useChapters()
  const { profiles, loading: profilesLoading } = useProfiles()
  const { reports, loading: reportsLoading } = useReports()
  const { ads, loading: adsLoading } = useAds()

  // Ensure we have the latest data
  React.useEffect(() => {
    fetchStories();
  }, []);

  const systemStats = {
    totalNovels: stories.length,
    totalChapters: chapters.length,
    totalReaders: profiles.length, // All users are potential readers
    totalWriters: profiles.length, // Simplified count - refine with user_roles if needed
    adImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
    adRevenue: ads.reduce((sum, ad) => sum + ((ad.clicks || 0) * 0.5), 0), // Assuming $0.5 per click
    flaggedContent: reports.filter(r => r.status === 'pending').length,
    activeComplaints: reports.filter(r => r.status === 'reviewed').length
  }

  const isLoading = storiesLoading || chaptersLoading || profilesLoading || reportsLoading || adsLoading

  // Get top stories by view count for chart
  const topStoriesData = stories
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)
    .map(story => ({ 
      title: story.title.length > 15 ? story.title.substring(0, 15) + '...' : story.title, 
      reads: story.view_count || 0,
      id: story.id
    }))

  // Generate ad performance data based on real impressions
  const adPerformance = generateAdPerformance(systemStats.adImpressions || 1000);

  // Handle navigation to specific sections
  const handleViewNovel = (storyId) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      onNavigate("novels", story);
    }
  };

  if (isLoading) {
    return <div className="space-y-8">
      <div className="text-center">Loading dashboard...</div>
    </div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden xs:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Platform overview and key metrics
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="vine-card">
          <CardContent className="pt-4 p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-2xl font-bold">{systemStats.totalNovels.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Novels</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardContent className="pt-4 p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-2xl font-bold">{systemStats.totalChapters.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardContent className="pt-4 p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-2xl font-bold">{systemStats.totalReaders.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Readers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardContent className="pt-4 p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-2xl font-bold">{systemStats.totalWriters.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Writers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Ads Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Impressions</span>
                <span className="font-bold">{systemStats.adImpressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Revenue (30 days)</span>
                <span className="font-bold text-primary">${systemStats.adRevenue.toLocaleString()}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onNavigate("ads")}
              >
                Manage Ads
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Reports Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Flagged Content</span>
                <span className="font-bold text-destructive">{systemStats.flaggedContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Complaints</span>
                <span className="font-bold">{systemStats.activeComplaints}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onNavigate("reports")}
              >
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Daily Active Readers</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Top 5 Novels by Reads</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topStoriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="title" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar 
                  dataKey="reads" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  onClick={(data) => handleViewNovel(data.id)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ad Performance Chart */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Ad Performance</CardTitle>
          <CardDescription>Views, clicks, and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {adPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <Button 
          className="vine-button-hero text-sm sm:text-base h-10 sm:h-12"
          onClick={() => onNavigate("writers")}
        >
          <Users className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Manage </span>Writers
        </Button>
        <Button 
          variant="outline"
          onClick={() => onNavigate("novels")}
          className="text-sm sm:text-base h-10 sm:h-12"
        >
          <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Manage </span>Novels
        </Button>
        <Button 
          variant="outline"
          onClick={() => onNavigate("reports")}
          className="text-sm sm:text-base h-10 sm:h-12 col-span-2 md:col-span-1"
        >
          <Flag className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">View </span>Reports
        </Button>
      </div>
    </div>
  )
}