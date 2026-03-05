import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStaffList, mockWeeklyAttendance } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const HodAttendance: React.FC = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-foreground mb-1">Attendance Monitoring</h1>
    <p className="text-muted-foreground text-sm mb-8">Track staff attendance across the department</p>

    <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">Department Attendance Trend</h2>
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

    <div className="bg-card border border-border rounded-xl p-6 shadow-card">
      <h2 className="text-sm font-semibold text-foreground mb-4">Staff Attendance Report</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left py-3 pr-4 font-medium">Staff</th>
              <th className="text-left py-3 pr-4 font-medium">Subject</th>
              <th className="text-center py-3 pr-4 font-medium">Attendance %</th>
              <th className="text-center py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockStaffList.map((s) => (
              <tr key={s.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{s.subject}</td>
                <td className="py-3 pr-4 text-center font-mono text-foreground">{s.attendance}%</td>
                <td className="py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    s.attendance >= 85 ? "bg-success/10 text-success" : s.attendance >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                  }`}>
                    {s.attendance >= 85 ? "Good" : s.attendance >= 75 ? "Average" : "Low"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default HodAttendance;
