import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Award, CheckCircle2 } from 'lucide-react';

interface Habit {
  id: number;
  title: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | '3x/week' | '2x/week';
  streak: number;
  completedDates: string[];
}

const Habits = () => {
  // Mock data
  const initialHabits: Habit[] = [
    {
      id: 1,
      title: 'Drink water',
      description: 'Drink at least 2 liters of water',
      frequency: 'Daily',
      streak: 7,
      completedDates: [
        '2025-04-11', '2025-04-12', '2025-04-13', 
        '2025-04-14', '2025-04-15', '2025-04-16', 
        '2025-04-17'
      ],
    },
    {
      id: 2,
      title: 'Meditate',
      description: 'Meditate for 10 minutes',
      frequency: 'Daily',
      streak: 5,
      completedDates: [
        '2025-04-13', '2025-04-14', '2025-04-15', 
        '2025-04-16', '2025-04-17'
      ],
    },
    {
      id: 3,
      title: 'Exercise',
      description: 'Exercise for at least 30 minutes',
      frequency: '3x/week',
      streak: 3,
      completedDates: [
        '2025-04-11', '2025-04-14', '2025-04-17'
      ],
    },
  ];
  
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const frequencies = ['Daily', 'Weekly', '3x/week', '2x/week'];
  
  const handleAddHabit = () => {
    const newHabit: Habit = {
      id: habits.length + 1,
      title: 'New Habit',
      description: 'Habit description',
      frequency: 'Daily',
      streak: 0,
      completedDates: [],
    };
    
    setHabits([...habits, newHabit]);
    setIsAddDialogOpen(false);
  };
  
  const handleEditHabit = () => {
    if (selectedHabit) {
      setHabits(habits.map(habit => habit.id === selectedHabit.id ? selectedHabit : habit));
      setIsEditDialogOpen(false);
      setSelectedHabit(null);
    }
  };
  
  const handleDeleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };
  
  const handleCompleteToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (habit.completedDates.includes(today)) {
      // Remove today from completed dates
      const updatedDates = habit.completedDates.filter(date => date !== today);
      const updatedStreak = calculateStreak(updatedDates);
      
      setHabits(habits.map(h => {
        if (h.id === habit.id) {
          return {
            ...h,
            completedDates: updatedDates,
            streak: updatedStreak,
          };
        }
        return h;
      }));
    } else {
      // Add today to completed dates
      const updatedDates = [...habit.completedDates, today].sort();
      const updatedStreak = calculateStreak(updatedDates);
      
      setHabits(habits.map(h => {
        if (h.id === habit.id) {
          return {
            ...h,
            completedDates: updatedDates,
            streak: updatedStreak,
          };
        }
        return h;
      }));
    }
  };
  
  const calculateStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;
    
    // Sort dates in ascending order
    const sortedDates = [...dates].sort();
    let streak = 1;
    
    // Simple streak calculation for demo purposes
    // In a real app, this would be more sophisticated based on frequency
    return sortedDates.length;
  };
  
  const isTodayCompleted = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habits</h2>
          <p className="text-muted-foreground">
            Build consistent habits for long-term success.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
              <DialogDescription>
                Create a new habit to track consistently.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Habit title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Habit description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select defaultValue="Daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(frequency => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHabit}>Add Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Habits</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <Card key={habit.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{habit.title}</CardTitle>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {habit.frequency}
                    </span>
                  </div>
                  <CardDescription>{habit.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {habit.streak} day streak
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant={isTodayCompleted(habit) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCompleteToday(habit)}
                  >
                    {isTodayCompleted(habit) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed Today
                      </>
                    ) : (
                      "Complete Today"
                    )}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedHabit(habit);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.filter(habit => habit.frequency === 'Daily').map((habit) => (
              <Card key={habit.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{habit.title}</CardTitle>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {habit.frequency}
                    </span>
                  </div>
                  <CardDescription>{habit.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {habit.streak} day streak
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant={isTodayCompleted(habit) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCompleteToday(habit)}
                  >
                    {isTodayCompleted(habit) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed Today
                      </>
                    ) : (
                      "Complete Today"
                    )}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedHabit(habit);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.filter(habit => habit.frequency !== 'Daily').map((habit) => (
              <Card key={habit.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{habit.title}</CardTitle>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {habit.frequency}
                    </span>
                  </div>
                  <CardDescription>{habit.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {habit.streak} day streak
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant={isTodayCompleted(habit) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCompleteToday(habit)}
                  >
                    {isTodayCompleted(habit) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed Today
                      </>
                    ) : (
                      "Complete Today"
                    )}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedHabit(habit);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Make changes to your habit.
            </DialogDescription>
          </DialogHeader>
          {selectedHabit && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedHabit.title}
                  onChange={(e) => setSelectedHabit({ ...selectedHabit, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={selectedHabit.description}
                  onChange={(e) => setSelectedHabit({ ...selectedHabit, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select
                  value={selectedHabit.frequency}
                  onValueChange={(value: 'Daily' | 'Weekly' | '3x/week' | '2x/week') => 
                    setSelectedHabit({ ...selectedHabit, frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(frequency => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditHabit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Habits;