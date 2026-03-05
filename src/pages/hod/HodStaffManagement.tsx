import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStaffList } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

const HodStaffManagement: React.FC = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-foreground mb-1">Staff Management</h1>
    <p className="text-muted-foreground text-sm mb-8">Monitor all staff members</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockStaffList.map((staff) => (
        <div key={staff.id} className="bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{staff.name}</h3>
              <p className="text-xs text-muted-foreground">{staff.subject}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              staff.attendance >= 85 ? "bg-success/10 text-success" : staff.attendance >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
            }`}>
              {staff.attendance}% att.
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Syllabus Progress</span>
                <span className="font-medium text-foreground">{staff.syllabus}%</span>
              </div>
              <Progress value={staff.syllabus} className="h-2" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tasks: {staff.tasksCompleted} done, {staff.tasksPending} pending</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default HodStaffManagement;
