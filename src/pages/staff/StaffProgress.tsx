import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockSubjectProgress } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

const StaffProgress: React.FC = () => {
  const totalTopics = mockSubjectProgress.reduce((a, s) => a + s.topicsTotal, 0);
  const completed = mockSubjectProgress.reduce((a, s) => a + s.topicsCompleted, 0);
  const overallPct = Math.round((completed / totalTopics) * 100);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">Academic Progress</h1>
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
        {mockSubjectProgress.map((unit, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{unit.unit}</h3>
                <p className="text-xs text-muted-foreground">{unit.topicsCompleted}/{unit.topicsTotal} topics</p>
              </div>
              <span className={`text-sm font-bold ${
                unit.percentage === 100 ? "text-success" : unit.percentage > 0 ? "text-warning" : "text-muted-foreground"
              }`}>
                {unit.percentage}%
              </span>
            </div>
            <Progress value={unit.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StaffProgress;
