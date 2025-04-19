import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  CheckCircle2,
  Edit,
  Plus,
  Trash2,
  Target,
  Calendar as CalendarIcon2,
  Flag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

import { Milestone, useAuth } from "@/contexts/auth-context";
import axios from "axios";
import { BASE_URL } from "../constants.ts";
import { Goal } from "@/contexts/auth-context";
import { useTheme } from "@/components/theme-provider.tsx";

const Goals = () => {
  const { user, goals, isLoading, fetchGoals } = useAuth();

  // Fetch goals on mount and whenever user changes
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    targetDate: new Date(),
  });
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isViewGoalOpen, setIsViewGoalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");

  const [isEditMilestoneOpen, setIsEditMilestoneOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(
    null
  );
  const [updatedMilestoneTitle, setUpdatedMilestoneTitle] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedGoal) {
      const updatedGoal = goals.find((goal) => goal.id === selectedGoal.id);
      if (updatedGoal) setSelectedGoal(updatedGoal);
    }
  }, [goals]);

  const handleEditMilestone = (goalId: number, milestoneId: number) => {
    const goal = goals.find((g) => g.id === goalId);
    const milestone = goal?.milestones.find((m) => m.id === milestoneId);

    if (milestone) {
      setSelectedGoalId(goalId);
      setEditingMilestoneId(milestoneId);
      setUpdatedMilestoneTitle(milestone.title);
      setIsEditMilestoneOpen(true);
    }
  };

  const saveUpdatedMilestone = async () => {
    if (!editingMilestoneId || !selectedGoalId) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/goal/update_milestone/${editingMilestoneId}/`,
        {
          title: updatedMilestoneTitle,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      toast({
        title: "Milestone updated",
        description: "New milestone has been updated to your goal",
      });
      fetchGoals(); // Fetch updated goals after deleting
    } catch (error) {
      console.error("Error updating Milestone:", error);
      toast({
        title: "Error",
        description: "Failed to update Milestone",
        variant: "destructive",
      });
    }

    setIsEditMilestoneOpen(false);
    setEditingMilestoneId(null);
    setUpdatedMilestoneTitle("");
  };

  const handleAddGoal = async () => {
    if (
      !newGoal.title ||
      !newGoal.description ||
      !newGoal.category ||
      !date ||
      !newGoal.priority
    ) {
      toast({
        title: "All the fields are required",
        description: "Please fill in all the fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    if (editGoalId !== -1) {
      try {
        const response = await axios.put(
          `${BASE_URL}/goal/update_goal/${editGoalId}/`,
          {
            id: user.id,
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            targetDate: format(date, "yyyy-MM-dd"), // "YYYY-MM-DD"
            priority: newGoal.priority,
          },
          {
            withCredentials: true,
          }
        );
        // setGoals(response.data);
        console.log("Fetched goals:", response.data); // This logs correct data
        setNewGoal({
          title: "",
          description: "",
          category: "",
          targetDate: new Date(),
          priority: "medium",
        });
        setDate(undefined);
        setIsAddGoalOpen(false);

        toast({
          title: "Goal updated",
          description: "Your goal has been updated successfully",
        });

        fetchGoals(); // Fetch updated goals after adding a new one
      } catch (error) {
        console.error("Error updating goal:", error);
        toast({
          title: "Error",
          description: "Failed to update goal",
          variant: "destructive",
        });
      }
      setEditGoalId(-1);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/goal/create_goal/`,
        {
          id: user.id,
          title: newGoal.title,
          description: newGoal.description,
          category: newGoal.category,
          targetDate: format(date, "yyyy-MM-dd"), // "YYYY-MM-DD"

          priority: newGoal.priority,
        },
        {
          withCredentials: true,
        }
      );
      // setGoals(response.data);
      console.log("Fetched goals:", response.data); // This logs correct data
      setNewGoal({
        title: "",
        description: "",
        category: "",
        targetDate: new Date(),
        priority: "medium",
      });
      setDate(undefined);
      setIsAddGoalOpen(false);

      toast({
        title: "Goal added",
        description: "Your goal has been added successfully",
      });

      fetchGoals(); // Fetch updated goals after adding a new one
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/goal/delete_goal/${id}/`,
        {
          withCredentials: true,
        }
      );
      // setGoals(response.data);
      console.log("Fetched goals:", response.data); // This logs correct data

      toast({
        title: "Goal deleted",
        description: "Goal has been deleted successfully",
      });
      fetchGoals(); // Fetch updated goals after deleting
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  const [editGoalId, setEditGoalId] = useState(-1);

  const editGoal = (id: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    setEditGoalId(id);
    if (goal) {
      setNewGoal({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        targetDate: goal.targetDate,
        priority: goal.priority,
      });
      setDate(goal.targetDate);
      setIsAddGoalOpen(true);
    }
  };

  const viewGoalDetails = (id: number) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      setSelectedGoal(goal);
      setIsViewGoalOpen(true);
    }
  };

  const toggleMilestoneCompletion = async (milestone: Milestone) => {
    try {
      await axios.put(
        `${BASE_URL}/goal/update_milestone/${milestone.id}/`,
        {
          status: !milestone.status,
        },
        {
          withCredentials: true,
        }
      );

      toast({
        title: "Milestone updated",
        description: "New milestone has been updated to your goal",
      });
      fetchGoals(); // Fetch updated goals after deleting
    } catch (error) {
      console.error("Error updating Milestone:", error);
      toast({
        title: "Error",
        description: "Failed to update Milestone",
        variant: "destructive",
      });
    }
  };

  const addMilestone = async () => {
    if (!selectedGoal || !newMilestone) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/goal/create_milestone/`,
        {
          goal_id: selectedGoal.id,
          title: newMilestone,
        },
        {
          withCredentials: true,
        }
      );
      // setGoals(response.data);
      console.log("Fetched goals:", response.data); // This logs correct data

      toast({
        title: "Milestone added",
        description: "New milestone has been added to your goal",
      });
      fetchGoals(); // Fetch updated goals after deleting
    } catch (error) {
      console.error("Error adding Milestone:", error);
      toast({
        title: "Error",
        description: "Failed to add Milestone",
        variant: "destructive",
      });
    }

    setNewMilestone("");

    toast({
      title: "Milestone added",
      description: "New milestone has been added to your goal",
    });
  };

  const deleteMilestone = async (milestoneId: number) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/goal/delete_milestone/${milestoneId}/`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched goals:", response.data); // This logs correct data

      toast({
        title: "Milestone deleted",
        description: "Milestone has been deleted successfully",
      });
      fetchGoals(); // Fetch updated goals after deleting
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
    }
  };

  const getProgress = (goal: Goal) => {
    const totalMilestones = goal.milestones.length;
    const completedMilestones = goal.milestones.filter(
      (milestone) => milestone.status
    ).length;
    return totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === "all") return true;
    if (filter === "completed") return getProgress(goal) === 100;
    if (filter === "in-progress")
      return getProgress(goal) > 0 && getProgress(goal) < 100;
    if (filter === "not-started") return getProgress(goal) === 0;
    if (filter === "high-priority") return goal.priority === "high";

    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Health":
        return "bg-blue-500/10 text-blue-500";
      case "Career":
        return "bg-purple-500/10 text-purple-500";
      case "Finance":
        return "bg-green-500/10 text-green-500";
      case "Personal":
        return "bg-orange-500/10 text-orange-500";
      case "Education":
        return "bg-yellow-500/10 text-yellow-500";
      case "Wellness":
        return "bg-teal-500/10 text-teal-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: Number) => {
    switch (status) {
      case 100:
        return "bg-green-500/10 text-green-500";
      case 0:
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-blue-500/10 text-blue-500";
    }
  };

  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
          <p className="text-muted-foreground">
            Set, track, and achieve your personal goals.
          </p>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editGoalId !== -1 ? "Edit Goal" : "Add Goal"}
              </DialogTitle>
              <DialogDescription>
                Create a new goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  placeholder="Enter goal title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  placeholder="Enter goal description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Wellness">Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  defaultValue="medium"
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal}>
                {editGoalId !== -1 ? "Edit Goal" : "Add Goal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setFilter}>
        <TabsList className="space-x-1">
          <TabsTrigger
            value="all"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            All Goals
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="not-started"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            Not Started
          </TabsTrigger>
          <TabsTrigger
            value="high-priority"
            className={`text-primary ${theme === "light" ? "bg-white" : ""}`}
          >
            High Priority
          </TabsTrigger>
        </TabsList>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No goals found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {filter === "completed"
                    ? "You haven't completed any goals yet."
                    : filter === "not-started"
                    ? "You don't have any goals waiting to be started."
                    : "Add a new goal to get started."}
                </p>
                <Button className="mt-4" onClick={() => setIsAddGoalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        className={cn("mb-2", getCategoryColor(goal.category))}
                      >
                        {goal.category}
                      </Badge>
                      <CardTitle className="line-clamp-1">
                        {goal.title}
                      </CardTitle>
                    </div>
                    <Badge variant={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {goal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{getProgress(goal)}%</span>
                      </div>
                      <Progress value={getProgress(goal)} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon2 className="h-3 w-3" />
                        <span>
                          Target: {format(goal.targetDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      <Badge className={getStatusColor(getProgress(goal))}>
                        {getProgress(goal) > 0
                          ? "In Progress"
                          : getProgress(goal) == 0
                          ? "Not Started"
                          : "Completed"}
                      </Badge>
                    </div>

                    {goal.milestones.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium">
                          Key Milestones:
                        </span>
                        <ul className="space-y-1 text-xs">
                          {goal.milestones.slice(0, 2).map((milestone) => (
                            <li
                              key={milestone.id}
                              className="flex items-center gap-1"
                            >
                              {milestone.status ? (
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border" />
                              )}
                              <span
                                className={
                                  milestone.status
                                    ? "text-muted-foreground line-through"
                                    : ""
                                }
                              >
                                {milestone.title}
                              </span>
                            </li>
                          ))}
                          {goal.milestones.length > 2 && (
                            <li className="text-muted-foreground">
                              +{goal.milestones.length - 2} more milestones
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => viewGoalDetails(goal.id)}
                  >
                    View Details
                  </Button>
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      onClick={() => editGoal(goal.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </Tabs>

      {/* Goal Details Dialog */}
      <Dialog open={isViewGoalOpen} onOpenChange={setIsViewGoalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedGoal && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className={getCategoryColor(selectedGoal.category)}>
                      {selectedGoal.category}
                    </Badge>
                    <DialogTitle className="mt-2">
                      {selectedGoal.title}
                    </DialogTitle>
                  </div>
                  <Badge
                    className="mt-10"
                    variant={getPriorityColor(selectedGoal.priority)}
                  >
                    {selectedGoal.priority}
                  </Badge>
                </div>
                <DialogDescription>
                  {selectedGoal.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Progress</h4>
                    <span className="text-sm font-medium">
                      {getProgress(selectedGoal)}%
                    </span>
                  </div>
                  <Progress value={getProgress(selectedGoal)} className="h-2" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Target Date</p>
                        <p className="text-sm text-muted-foreground">
                          {format(selectedGoal.targetDate, "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge
                          className={getStatusColor(getProgress(selectedGoal))}
                        >
                          {getProgress(selectedGoal) > 0
                            ? "In Progress"
                            : getProgress(selectedGoal) === 0
                            ? "Not Started"
                            : "Completed"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Milestones</h4>
                  {selectedGoal.milestones.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No milestones added yet.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedGoal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-2 justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={milestone.status}
                              onCheckedChange={() =>
                                toggleMilestoneCompletion(milestone)
                              }
                            />
                            <span
                              className={cn(
                                milestone.status &&
                                  "line-through text-muted-foreground"
                              )}
                            >
                              {milestone.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleEditMilestone(
                                  selectedGoal.id,
                                  milestone.id
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMilestone(milestone.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Add a new milestone"
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                    />
                    <Button onClick={addMilestone} disabled={!newMilestone}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewGoalOpen(false)}
                >
                  Close
                </Button>
                <Button onClick={() => editGoal(selectedGoal.id)}>
                  Edit Goal
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Milestone update Dialog */}
      <Dialog open={isEditMilestoneOpen} onOpenChange={setIsEditMilestoneOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Milestone</DialogTitle>
            <DialogDescription>
              Update the milestone title below.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={updatedMilestoneTitle}
            onChange={(e) => setUpdatedMilestoneTitle(e.target.value)}
            placeholder="Enter milestone title"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditMilestoneOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveUpdatedMilestone}
              disabled={!updatedMilestoneTitle.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete milestone dialog */}
    </div>
  );
};

export default Goals;
