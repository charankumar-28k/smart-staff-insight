import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockSubjectProgress } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UnitData {
  subject: string;
  unit: string;
  topicsTotal: number;
  topicsCompleted: number;
  percentage: number;
}

const StaffProgress: React.FC = () => {
  const [units, setUnits] = useState<UnitData[]>([...mockSubjectProgress]);
  const [showCreate, setShowCreate] = useState(false);
  const [newUnit, setNewUnit] = useState({ unit: "", topicsTotal: "", topicsCompleted: "" });
  const { toast } = useToast();

  const totalTopics = units.reduce((a, s) => a + s.topicsTotal, 0);
  const completed = units.reduce((a, s) => a + s.topicsCompleted, 0);
  const overallPct = totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;

  const handleCreate = () => {
    const total = parseInt(newUnit.topicsTotal);
    const done = parseInt(newUnit.topicsCompleted);
    if (!newUnit.unit.trim() || isNaN(total) || total <= 0) {
      toast({ title: "Invalid input", description: "Please fill all fields correctly.", variant: "destructive" });
      return;
    }
    const completedVal = isNaN(done) ? 0 : Math.min(done, total);
    const pct = Math.round((completedVal / total) * 100);
    setUnits([...units, { subject: "Data Structures", unit: newUnit.unit.trim(), topicsTotal: total, topicsCompleted: completedVal, percentage: pct }]);
    setNewUnit({ unit: "", topicsTotal: "", topicsCompleted: "" });
    setShowCreate(false);
    toast({ title: "Unit added", description: `${newUnit.unit.trim()} has been added to your syllabus.` });
  };

  const handleUpdateCompleted = (index: number, newCompleted: number) => {
    setUnits(prev => prev.map((u, i) => {
      if (i !== index) return u;
      const clamped = Math.max(0, Math.min(newCompleted, u.topicsTotal));
      return { ...u, topicsCompleted: clamped, percentage: Math.round((clamped / u.topicsTotal) * 100) };
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-foreground">Academic Progress</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>
      <p className="text-muted-foreground text-sm mb-8">Track your syllabus completion</p>

      {/* Overall */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Overall Syllabus Completion</h2>
          <span className="text-2xl font-bold text-foreground">{overallPct}%</span>
        </div>
        <Progress value={overallPct} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">{completed} of {totalTopics} topics completed</p>
      </div>

      {/* Unit breakdown */}
      <div className="space-y-3">
        {units.map((unit, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{unit.unit}</h3>
                <p className="text-xs text-muted-foreground">{unit.topicsCompleted}/{unit.topicsTotal} topics</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleUpdateCompleted(i, unit.topicsCompleted - 1)}
                    className="w-6 h-6 rounded bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 text-xs font-bold">−</button>
                  <button onClick={() => handleUpdateCompleted(i, unit.topicsCompleted + 1)}
                    className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 text-xs font-bold">+</button>
                </div>
                <span className={`text-sm font-bold ${
                  unit.percentage === 100 ? "text-success" : unit.percentage > 0 ? "text-warning" : "text-muted-foreground"
                }`}>
                  {unit.percentage}%
                </span>
              </div>
            </div>
            <Progress value={unit.percentage} className="h-2" />
          </div>
        ))}
      </div>

      {/* Create Unit Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="unit-name">Unit Name</Label>
              <Input id="unit-name" placeholder="e.g. Unit 6 - Graph Theory" value={newUnit.unit}
                onChange={(e) => setNewUnit({ ...newUnit, unit: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="total-topics">Total Topics</Label>
              <Input id="total-topics" type="number" placeholder="e.g. 8" value={newUnit.topicsTotal}
                onChange={(e) => setNewUnit({ ...newUnit, topicsTotal: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="completed-topics">Topics Completed</Label>
              <Input id="completed-topics" type="number" placeholder="e.g. 0" value={newUnit.topicsCompleted}
                onChange={(e) => setNewUnit({ ...newUnit, topicsCompleted: e.target.value })} />
            </div>
            <button onClick={handleCreate}
              className="w-full px-4 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Add Unit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StaffProgress;
