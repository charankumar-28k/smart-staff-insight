import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useCollege } from "@/contexts/CollegeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Users, GraduationCap, Download, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const months = ["Month 1", "Month 2", "Month 3", "Month 4"];

const StaffAcademicProgress: React.FC = () => {
  const { user } = useAuth();
  const { departments, getStaffAssignments, updateStudentMark, addStudent } = useCollege();
  const assignments = getStaffAssignments(user?.id || "");

  const [selectedIdx, setSelectedIdx] = useState("0");
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRoll, setNewRoll] = useState("");
  const [newEmail, setNewEmail] = useState("");

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

  const handleAddStudent = () => {
    if (!assignment || !newName.trim() || !newRoll.trim()) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    addStudent(assignment.dept.id, assignment.year.id, assignment.section.id, { name: newName.trim(), rollNo: newRoll.trim(), email: newEmail.trim() });
    setNewName(""); setNewRoll(""); setNewEmail("");
    setAddOpen(false);
    toast({ title: "Student Added", description: `${newName.trim()} has been added successfully` });
  };

  const handleExport = () => {
    if (!section || !assignment) return;
    const rows: any[] = [];
    section.students.forEach(stu => {
      const mark = stu.marks[assignment.subject.id] || 0;
      const row: any = { "Roll No": stu.rollNo, "Name": stu.name, "Email": stu.email };
      months.forEach((m, mi) => {
        row[`${assignment.subject.code} - ${m}`] = Math.max(0, Math.min(100, mark + Math.floor((mi - 1.5) * 3)));
      });
      row["Current Mark"] = mark;
      row["Status"] = mark >= 80 ? "Excellent" : mark >= 60 ? "Average" : "At Risk";
      rows.push(row);
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, assignment.subject.code);
    XLSX.writeFile(wb, `Academic_Progress_${assignment.subject.code}_${assignment.section.name}.xlsx`);
    toast({ title: "Exported", description: "Excel file downloaded successfully" });
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
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-foreground">Academic Progress</h1>
        <div className="flex gap-2">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={!assignment}>
                <UserPlus className="w-4 h-4 mr-1" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Student Name *" value={newName} onChange={e => setNewName(e.target.value)} />
                <Input placeholder="Roll Number *" value={newRoll} onChange={e => setNewRoll(e.target.value)} />
                <Input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                <Button className="w-full" onClick={handleAddStudent}>Add Student</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleExport} disabled={!section}>
            <Download className="w-4 h-4 mr-1" /> Export Excel
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Update student marks — 4 month breakdown</p>

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
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{section?.students.length || 0}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Table with 4-month columns and editable marks */}
      {section && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Student Marks — {assignment?.subject.name} (4 Month View)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    {months.map(m => (
                      <TableHead key={m} className="text-center text-xs">{m}</TableHead>
                    ))}
                    <TableHead className="text-center">Current (0-100)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.students.map(stu => {
                    const mark = stu.marks[assignment!.subject.id] || 0;
                    return (
                      <TableRow key={stu.id}>
                        <TableCell className="font-mono text-xs">{stu.rollNo}</TableCell>
                        <TableCell className="font-medium text-sm whitespace-nowrap">{stu.name}</TableCell>
                        {months.map((_, mi) => {
                          const monthMark = Math.max(0, Math.min(100, mark + Math.floor((mi - 1.5) * 3)));
                          return (
                            <TableCell key={mi} className="text-center text-xs">
                              <span className={monthMark >= 80 ? "text-primary font-medium" : monthMark >= 60 ? "text-foreground" : "text-destructive font-medium"}>
                                {monthMark}
                              </span>
                            </TableCell>
                          );
                        })}
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
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default StaffAcademicProgress;
