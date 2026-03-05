import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import InsightCard from "@/components/InsightCard";
import StatCard from "@/components/StatCard";
import { mockStaffList, mockMonthlyAttendance, getDepartmentAIInsights, mockDepartmentStats } from "@/data/mockData";
import { Brain, BarChart3, Users, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(152, 60%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const HodAnalytics: React.FC = () => {
  const insights = getDepartmentAIInsights(mockStaffList);
  const performanceDistribution = [
    { name: "High (>85%)", value: mockStaffList.filter((s) => s.attendance >= 85).length },
    { name: "Medium (75-85%)", value: mockStaffList.filter((s) => s.attendance >= 75 && s.attendance < 85).length },
    { name: "Low (<75%)", value: mockStaffList.filter((s) => s.attendance < 75).length },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">Analytics & AI Insights</h1>
      <p className="text-muted-foreground text-sm mb-8">Department performance powered by AI</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Dept. Performance" value={`${mockDepartmentStats.avgAttendance}%`} icon={BarChart3} variant="primary" />
        <StatCard title="Active Staff" value={mockDepartmentStats.totalStaff} icon={Users} variant="success" />
        <StatCard title="Syllabus Target" value={`${mockDepartmentStats.avgSyllabus}%`} icon={Target} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
          <h2 className="text-sm font-semibold text-foreground mb-4">Monthly Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend />
                <Bar dataKey="dept" name="Department Avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h2 className="text-sm font-semibold text-foreground mb-4">Performance Distribution</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={performanceDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {performanceDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" /> AI-Powered Staff Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} type={insight.type} message={insight.message} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HodAnalytics;
