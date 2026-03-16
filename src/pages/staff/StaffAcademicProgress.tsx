import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useCollege } from "@/contexts/CollegeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const StaffAcademicProgress: React.FC = () => {
  const { user } = useAuth();
  const { departments, getStaffAssignments, updateStudentMark } = useCollege();
  const assignments = getStaffAssignments(user?.id || "");

  const [selectedIdx, setSelectedIdx] = useState("0");
  const assignment = assignments[parseInt(selectedIdx)] || null;

  const section = assignment
    ? departments
        .find(d => d.id === assignment.dept.id)
        ?.years.find(y => y.id === assignment.year.id)
        ?.sections.find(s => s.id === assignment.section.id)
    : null;

  const handleMarkUpdate = (studentId: string, value: string) => {
    if (!assignment) return;
    const mark = Math.min(100, Math.max(0, parseInt(value) || 0));
    updateStudentMark(assignment.dept.id, assignment.year.id, assignment.section.id, studentId, assignment.subject.id, mark);
  };

  if (assignments.length === 0) {
    return (
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-foreground mb-1">Academic Progress</h1>
        <p className="text-sm text-muted-foreground mb-6">View and update student performance</p>
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No subjects assigned to you yet.</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">Academic Progress</h1>
      <p className="text-sm text-muted-foreground mb-6">Update student marks for your assigned subjects</p>

      {/* Assignment Selector */}
      <div className="mb-6">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your Assignments</label>
        <Select value={selectedIdx} onValueChange={setSelectedIdx}>
          <SelectTrigger className="max-w-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {assignments.map((a, i) => (
              <SelectItem key={i} value={String(i)}>
                {a.subject.code} - {a.subject.name} ({a.year.name}, Sec {a.section.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info Cards */}
      {assignment && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{assignment.subject.name}</p>
                <p className="text-xs text-muted-foreground">{assignment.subject.code}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{assignment.year.name}</p>
                <p className="text-xs text-muted-foreground">Section {assignment.section.name}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{section?.students.length || 0}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Table with editable marks */}
      {section && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Student Marks — {assignment?.subject.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Marks (0-100)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.students.map(stu => {
                  const mark = stu.marks[assignment!.subject.id] || 0;
                  return (
                    <TableRow key={stu.id}>
                      <TableCell className="font-mono text-xs">{stu.rollNo}</TableCell>
                      <TableCell className="font-medium text-sm">{stu.name}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={mark}
                          onChange={e => handleMarkUpdate(stu.id, e.target.value)}
                          className="w-20 mx-auto text-center h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={mark >= 80 ? "default" : mark >= 60 ? "secondary" : "destructive"} className="text-xs">
                          {mark >= 80 ? "Excellent" : mark >= 60 ? "Average" : "At Risk"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default StaffAcademicProgress;
