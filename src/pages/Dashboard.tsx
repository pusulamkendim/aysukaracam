import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, Award, Video, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock user data - will be replaced with real auth later
  const user = {
    name: "Guest User",
    plan: "Standard",
    joinDate: "January 2025",
    streak: 7,
  };

  const upcomingClasses = [
    {
      title: "Vinyasa Flow",
      date: "Today, 6:00 PM",
      duration: "75 min",
      instructor: "Maya Patel",
      type: "Live",
    },
    {
      title: "Morning Meditation",
      date: "Tomorrow, 7:00 AM",
      duration: "45 min",
      instructor: "Maya Patel",
      type: "Live",
    },
  ];

  const recentActivity = [
    {
      title: "Hatha Yoga",
      date: "2 days ago",
      duration: "60 min",
      completed: true,
    },
    {
      title: "Power Yoga",
      date: "4 days ago",
      duration: "90 min",
      completed: true,
    },
  ];

  const stats = [
    { icon: Calendar, label: "Classes This Month", value: "12", color: "text-primary" },
    { icon: Clock, label: "Total Hours", value: "18.5", color: "text-secondary" },
    { icon: TrendingUp, label: "Current Streak", value: `${user.streak} days`, color: "text-accent" },
    { icon: Award, label: "Level", value: "Intermediate", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">
              Member since {user.joinDate} • {user.plan} Plan
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Classes */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Video size={24} />
                        Upcoming Live Classes
                      </CardTitle>
                      <CardDescription>Join your scheduled sessions</CardDescription>
                    </div>
                    <Link to="/classes">
                      <Button variant="outline" size="sm">Browse All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{classItem.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {classItem.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {classItem.date} • {classItem.duration}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          with {classItem.instructor}
                        </p>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={24} />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your practice history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.date} • {activity.duration}
                        </p>
                      </div>
                      {activity.completed && (
                        <Badge variant="secondary" className="bg-secondary/20">
                          Completed
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Progress Card */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Monthly Goal</CardTitle>
                  <CardDescription>12 of 20 classes completed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={60} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Keep going! You're 60% towards your goal.
                  </p>
                </CardContent>
              </Card>

              {/* Subscription Card */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Your Plan</CardTitle>
                  <CardDescription>{user.plan} Membership</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">• 5 live classes per month</p>
                    <p className="text-sm">• Unlimited recorded sessions</p>
                    <p className="text-sm">• Advanced progress tracking</p>
                  </div>
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full">
                      Upgrade Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/classes" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Browse Classes
                    </Button>
                  </Link>
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Contact Support
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
