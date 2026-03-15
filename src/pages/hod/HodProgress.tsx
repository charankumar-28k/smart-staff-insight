import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStaffList } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const HodProgress: React.FC = () => {
  const [remindOpen, setRemindOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<typeof mockStaffList[0] | null>(null);
  const [msg, setMsg] = useState("");

  const openReminder = (staff: typeof mockStaffList[0]) => {
    setSelectedStaff(staff);
    setMsg(`Dear ${staff.name},\n\nPlease update your syllabus progress for ${staff.subject}. Current completion is at ${staff.syllabus}%.\n\nRegards,\nHOD`);
    setRemindOpen(true);
  };

  const sendReminder = () => {
    toast({ title: "Reminder Sent", description: `Reminder sent to ${selectedStaff?.name}` });
    setRemindOpen(false);
    setMsg("");
  };

  return (
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
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${
                  staff.syllabus >= 80 ? "text-success" : staff.syllabus >= 60 ? "text-warning" : "text-destructive"
                }`}>{staff.syllabus}%</span>
                <button
                  onClick={() => openReminder(staff)}
                  className="p-2 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                  title="Send reminder"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Progress value={staff.syllabus} className="h-2.5" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{staff.tasksCompleted} tasks completed</span>
              <span>{staff.tasksPending} pending</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={remindOpen} onOpenChange={setRemindOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Reminder to {selectedStaff?.name}</DialogTitle>
          </DialogHeader>
          <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setRemindOpen(false)}>Cancel</Button>
            <Button onClick={sendReminder}>Send Reminder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HodProgress;
