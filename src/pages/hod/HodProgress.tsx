import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStaffList } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

const HodProgress: React.FC = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-foreground mb-1">Academic Progress</h1>
    <p className="text-muted-foreground text-sm mb-8">Department-wide syllabus tracking</p>

    <div className="space-y-4">
      {mockStaffList.map((staff) => (
        <div key={staff.id} className="bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{staff.name}</h3>
              <p className="text-xs text-muted-foreground">{staff.subject}</p>
            </div>
            <span className={`text-lg font-bold ${
              staff.syllabus >= 80 ? "text-success" : staff.syllabus >= 60 ? "text-warning" : "text-destructive"
            }`}>{staff.syllabus}%</span>
          </div>
          <Progress value={staff.syllabus} className="h-2.5" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{staff.tasksCompleted} tasks completed</span>
            <span>{staff.tasksPending} pending</span>
          </div>
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default HodProgress;
