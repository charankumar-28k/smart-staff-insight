import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockAttendanceHistory, mockWeeklyAttendance } from "@/data/mockData";
import { CalendarCheck, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StaffAttendance: React.FC = () => {
  const [marked, setMarked] = useState(false);
  const attendance = 88;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">Attendance</h1>
      <p className="text-muted-foreground text-sm mb-8">Track and mark your daily attendance</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mark Attendance */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-sm font-semibold text-foreground mb-4">Today's Attendance</h2>
          <div className="text-center py-6">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              marked ? "bg-success/10" : "bg-muted"
            }`}>
              <CalendarCheck className={`w-8 h-8 ${marked ? "text-success" : "text-muted-foreground"}`} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {marked ? "Attendance marked for today ✓" : "March 5, 2026"}
            </p>
            <button onClick={() => setMarked(true)} disabled={marked}
              className="px-6 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-50 transition-opacity">
              {marked ? "Marked" : "Mark Present"}
            </button>
          </div>
          <div className="mt-4 p-4 bg-muted/40 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Current Attendance</p>
            <p className="text-3xl font-bold text-foreground">{attendance}%</p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-sm font-semibold text-foreground mb-4">Weekly Attendance Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-card">
        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Attendance Log</h2>
        <div className="divide-y divide-border">
          {mockAttendanceHistory.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground">{entry.date}</span>
              <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                entry.status === "present" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}>
                {entry.status === "present" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {entry.status === "present" ? "Present" : "Absent"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffAttendance;
