import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import { Users, CalendarCheck, BookOpen, MessageSquare } from "lucide-react";
import { mockStaffList, mockDepartmentStats, mockMonthlyAttendance, getDepartmentAIInsights } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const HodDashboard: React.FC = () => {
  const insights = getDepartmentAIInsights(mockStaffList).slice(0, 4);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">Department Overview</h1>
      <p className="text-muted-foreground text-sm mb-8">Computer Science Department</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Staff" value={mockDepartmentStats.totalStaff} icon={Users} variant="primary" />
        <StatCard title="Avg Attendance" value={`${mockDepartmentStats.avgAttendance}%`} icon={CalendarCheck} variant="success" trend="up" trendValue="+3% vs last month" />
        <StatCard title="Avg Syllabus" value={`${mockDepartmentStats.avgSyllabus}%`} icon={BookOpen} variant="warning" />
        <StatCard title="Subjects" value={mockDepartmentStats.totalSubjects} icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
          <h2 className="text-sm font-semibold text-foreground mb-4">Monthly Attendance Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend />
                <Bar dataKey="dept" name="Department" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hod" name="HOD Target" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">🤖 AI Insights</h2>
          {insights.map((insight, i) => (
            <InsightCard key={i} type={insight.type} message={insight.message} />
          ))}
        </div>
      </div>

      {/* Staff quick view */}
      <div className="mt-6 bg-card border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-foreground mb-4">Staff Performance Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-3 pr-4 font-medium">Name</th>
                <th className="text-left py-3 pr-4 font-medium">Subject</th>
                <th className="text-center py-3 pr-4 font-medium">Attendance</th>
                <th className="text-center py-3 font-medium">Syllabus</th>
              </tr>
            </thead>
            <tbody>
              {mockStaffList.map((staff) => (
                <tr key={staff.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground">{staff.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{staff.subject}</td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      staff.attendance >= 85 ? "bg-success/10 text-success" : staff.attendance >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    }`}>{staff.attendance}%</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      staff.syllabus >= 80 ? "bg-success/10 text-success" : staff.syllabus >= 60 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    }`}>{staff.syllabus}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HodDashboard;
