import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import InsightCard from "@/components/InsightCard";
import { getAIInsights } from "@/data/mockData";
import { Brain } from "lucide-react";

const StaffInsights: React.FC = () => {
  const insights = getAIInsights(88, 72);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">AI Performance Insights</h1>
      <p className="text-muted-foreground text-sm mb-8">AI-powered analysis of your performance</p>

      <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Performance Analysis</h2>
            <p className="text-xs text-muted-foreground">Based on your attendance and academic data</p>
          </div>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} type={insight.type} message={insight.message} />
          ))}
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Recommendations</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span>•</span> Complete Unit 3 topics to reach 80% syllabus target</li>
          <li className="flex items-start gap-2"><span>•</span> Maintain current attendance streak for 3 more weeks</li>
          <li className="flex items-start gap-2"><span>•</span> Submit pending lab reports before deadline</li>
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default StaffInsights;
