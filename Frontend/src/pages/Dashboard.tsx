import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  CalendarDays,
  CheckCircle2,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Goal, useAuth } from "@/contexts/auth-context";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

const getProgress = (goal: Goal) => {
  const totalMilestones = goal.milestones.length;
  const completedMilestones = goal.milestones.filter(
    (milestone) => milestone.status
  ).length;
  return totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;
};

export default function Dashboard() {
  const { goals } = useAuth();

  const goalData = [
    { name: "Completed", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "Not Started", value: 0 },
  ];

  for (const goal of goals) {
    if (getProgress(goal) === 100) {
      goalData[0].value++;
    } else if (getProgress(goal) > 0) {
      goalData[1].value++;
    } else {
      goalData[2].value++;
    }
  }

  const priorityGoals = goals
    .filter((goal) => goal.priority === "high" && getProgress(goal) < 100)
    .sort((a, b) => getProgress(a) - getProgress(b))
    .slice(0, 5);

  const totalMilestones = goals.reduce(
    (acc, goal) => acc + goal.milestones.length,
    0
  );

  const completedMilestones = goals.reduce(
    (acc, goal) =>
      acc + goal.milestones.filter((milestone) => milestone.status).length,
    0
  );

  const deadlineGoals = goals.filter((goal) => {
    const currentDate = new Date();
    const dueDate = new Date(goal.targetDate);
    return (
      getProgress(goal) < 100 &&
      goal.targetDate &&
      dueDate >= new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) &&
      goal.milestones.length > 0
    );
  });

  const { theme } = useTheme();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Track your progress and stay motivated.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Goals
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalData[0].value}</div>
            <p className="text-xs text-muted-foreground">
              {goals.length > 0
                ? Math.round((goalData[0].value / goals.length) * 100)
                : 0}
              % completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Milestones
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMilestones}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Milestones
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMilestones}</div>
            <p className="text-xs text-muted-foreground">
              {totalMilestones > 0
                ? Math.round((completedMilestones / totalMilestones) * 100)
                : 0}
              % completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList className="space-x-1">
          <TabsTrigger
            value="goals"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            Goals
          </TabsTrigger>
          {/* <TabsTrigger
            value="habits"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            Habits
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            Tasks
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>Your goal completion status</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={goalData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {goalData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Completed
                    </div>
                    <div className="text-lg font-bold">{goalData[0].value}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      In Progress
                    </div>
                    <div className="text-lg font-bold">{goalData[1].value}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Not Started
                    </div>
                    <div className="text-lg font-bold">{goalData[2].value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 row-span-2">
              <CardHeader>
                <CardTitle>Priority Goals</CardTitle>
                <CardDescription>Your top priority goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priorityGoals.map((goal) => PriorityGoals(goal))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Track goals by due date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                 {deadlineGoals.length > 0 ? (
                    deadlineGoals.map((goal) => (
                      PriorityGoals(goal)
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No upcoming deadlines
                    </div>
                  )}
                  <Separator className="my-4" />  
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const PriorityGoals = (goal: Goal) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{goal.category}</Badge>
          <span className="font-medium">{goal.title}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {getProgress(goal)}
        </span>
      </div>
      <Progress value={getProgress(goal)} className="h-2" />
      
    </div>
  );
};
