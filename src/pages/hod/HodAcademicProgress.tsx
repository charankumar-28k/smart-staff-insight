import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useCollege } from "@/contexts/CollegeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, BookOpen } from "lucide-react";

const HodAcademicProgress: React.FC = () => {
  const { departments } = useCollege();
  const [deptId, setDeptId] = useState(departments[0]?.id || "");
  const [yearId, setYearId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const dept = departments.find(d => d.id === deptId);
  const year = dept?.years.find(y => y.id === yearId);
  const section = year?.sections.find(s => s.id === sectionId);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-1">Academic Progress</h1>
      <p className="text-sm text-muted-foreground mb-6">View student performance by department, year, and section</p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Department</label>
          <Select value={deptId} onValueChange={v => { setDeptId(v); setYearId(""); setSectionId(""); }}>
            <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
            <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Academic Year</label>
          <Select value={yearId} onValueChange={v => { setYearId(v); setSectionId(""); }} disabled={!deptId}>
            <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
            <SelectContent>{dept?.years.map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Section</label>
          <Select value={sectionId} onValueChange={setSectionId} disabled={!yearId}>
            <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
            <SelectContent>{year?.sections.map(s => <SelectItem key={s.id} value={s.id}>Section {s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      {section && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{section.students.length}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{section.subjects.length}</p>
                <p className="text-xs text-muted-foreground">Subjects</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {section.students.length > 0
                    ? Math.round(section.students.reduce((a, stu) => {
                        const vals = Object.values(stu.marks);
                        return a + (vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0);
                      }, 0) / section.students.length)
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Table */}
      {section ? (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {dept?.name} — {year?.name} — Section {section.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  {section.subjects.map(sub => (
                    <TableHead key={sub.id} className="text-center">{sub.code}</TableHead>
                  ))}
                  <TableHead className="text-center">Avg</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.students.map(stu => {
                  const marks = section.subjects.map(sub => stu.marks[sub.id] || 0);
                  const avg = marks.length > 0 ? Math.round(marks.reduce((a, b) => a + b, 0) / marks.length) : 0;
                  return (
                    <TableRow key={stu.id}>
                      <TableCell className="font-mono text-xs">{stu.rollNo}</TableCell>
                      <TableCell className="font-medium text-sm">{stu.name}</TableCell>
                      {section.subjects.map(sub => (
                        <TableCell key={sub.id} className="text-center text-sm">
                          <span className={stu.marks[sub.id] >= 80 ? "text-success font-medium" : stu.marks[sub.id] >= 60 ? "text-foreground" : "text-destructive font-medium"}>
                            {stu.marks[sub.id] || "—"}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-bold text-sm">{avg}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={avg >= 80 ? "default" : avg >= 60 ? "secondary" : "destructive"} className="text-xs">
                          {avg >= 80 ? "Excellent" : avg >= 60 ? "Average" : "At Risk"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Select a department, year, and section to view student progress</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default HodAcademicProgress;
