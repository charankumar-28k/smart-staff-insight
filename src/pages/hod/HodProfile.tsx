import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Building2, BookOpen, CalendarCheck, Award } from "lucide-react";

const HodProfile: React.FC = () => {
  const { user } = useAuth();

  const profileFields = [
    { label: "Full Name", value: user?.name, icon: User },
    { label: "Email", value: user?.email, icon: Mail },
    { label: "Department", value: user?.department, icon: Building2 },
    { label: "Role", value: "Head of Department", icon: Award },
    { label: "Specialization", value: "Artificial Intelligence", icon: BookOpen },
    { label: "Joining Date", value: "June 2018", icon: CalendarCheck },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">My Profile</h1>
      <p className="text-muted-foreground text-sm mb-8">View your profile information</p>

      <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.department}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Head of Department
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileFields.map((field) => (
            <div key={field.label} className="flex items-center gap-3 p-4 bg-muted/40 rounded-lg">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <field.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HodProfile;
