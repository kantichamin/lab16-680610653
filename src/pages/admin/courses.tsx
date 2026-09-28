import { useState } from "react";
import { PlusCircle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminCoursesPage() {
  const { courses, addCourse, removeCourse, removeInstructor } =
    useEnrollmentStore();

  const [formCourseCode, setFormCourseCode] = useState("");
  const [formCourseTitle, setFormCourseTitle] = useState("");
  const [formInstructors, setFormInstructors] = useState<string[]>([]);
  const [searchInstructor, setSearchInstructor] = useState("");
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const anchor = useComboboxAnchor();

  const trimmed = searchInstructor.trim();
  const canCreate =
    trimmed.length > 0 &&
    !formInstructors.some((i) => i.toLowerCase() === trimmed.toLowerCase());

  const isDuplicateCode = courses.some(
    (c) => c.courseCode.toLowerCase() === formCourseCode.trim().toLowerCase(),
  );

  const handleAddCourse = () => {
    if (!formCourseCode.trim() || !formCourseTitle.trim() || isDuplicateCode)
      return;
    addCourse(formCourseCode.trim(), formCourseTitle.trim(), formInstructors);
    setCourseDialogOpen(false);
    setFormCourseCode("");
    setFormCourseTitle("");
    setFormInstructors([]);
    setSearchInstructor("");
  };

  const handleCourseDialogOpenChange = (open: boolean) => {
    setCourseDialogOpen(open);
    if (!open) {
      setFormCourseCode("");
      setFormCourseTitle("");
      setFormInstructors([]);
      setSearchInstructor("");
    }
  };

  const isdupicate = courses.some(
    (c) => c.courseCode === formCourseCode?.trim().toUpperCase(),
  );

  const allinstructor = Array.from(
    new Set(courses.flatMap((c) => c.instructors)),
  );

  const rows = courses;
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก
            ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
          </p>
        </div>

        <Dialog
          open={courseDialogOpen}
          onOpenChange={handleCourseDialogOpenChange}
        >
          <DialogTrigger render={<Button />}>
            <PlusCircle className="h-4 w-4" />
            เพิ่มวิชา
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>
            <div className="grid min-w-0 gap-4">
              <div className="grid min-w-0 gap-1.5">
                <Label htmlFor="formCourseCode">รหัสวิชา</Label>
                <Input
                  id="formCourseCode"
                  value={formCourseCode}
                  onChange={(c) => setFormCourseCode(c.target.value)}
                  placeholder="เช่น CPE303"
                  aria-invalid={isDuplicateCode}
                  aria-describedby={
                    isDuplicateCode ? "formCourseCode-error" : undefined
                  }
                />
                {isDuplicateCode && (
                  <FieldDescription
                    id="formCourseCode-error"
                    className="text-red-500"
                  >
                    มีรหัสวิชา {formCourseCode.toUpperCase()} นี้แล้ว
                  </FieldDescription>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="formCourseTitle">ชื่อวิชา</Label>
                <Input
                  id="formCourseTitle"
                  value={formCourseTitle}
                  onChange={(c) => setFormCourseTitle(c.target.value)}
                  placeholder="เช่น Mobile Application Development"
                />
              </div>

              <div className="grid min-w-0 gap-1.5">
                <Label htmlFor="formInstructor">ผู้สอน</Label>
                <Combobox
                  multiple
                  autoHighlight
                  id="formInstructor"
                  items={allinstructor}
                  value={formInstructors}
                  onValueChange={(v) => setFormInstructors(v as string[])}
                  inputValue={searchInstructor}
                  onInputValueChange={setSearchInstructor}
                >
                  <ComboboxChips
                    ref={anchor}
                    className="flex min-h-8 flex-wrap items-center gap-1 rounded-lg min-w-0"
                  >
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput
                            placeholder={
                              formInstructors?.length
                                ? ""
                                : "เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)"
                            }
                          />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                    {canCreate && (
                      <div className="border-t p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleAddCourse}
                        >
                          +เพิ่มผู้สอน "{trimmed}"
                        </Button>
                      </div>
                    )}
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={
                  !formCourseCode.trim() ||
                  !formCourseTitle.trim() ||
                  !formInstructors?.length ||
                  isdupicate
                }
                onClick={handleAddCourse}
              >
                <PlusCircle className="h-4 w-4" />
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((course) => (
              <TableRow key={course.courseCode}>
                <TableCell className="font-medium">
                  {course.courseCode.toUpperCase()}
                </TableCell>
                <TableCell>{course.courseTitle}</TableCell>

                <TableCell>
                  {course.instructors?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {course.instructors.map((instructor) => (
                        <Badge
                          key={instructor}
                          variant="outline"
                          className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                        >
                          {instructor}
                          <Button
                            size="xs"
                            variant="ghost"
                            className="rounded-full p-0.5 hover:bg-blue-800/60"
                            onClick={() =>
                              removeInstructor(course.courseCode, instructor)
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      ยังไม่มีผู้สอน
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ลบวิชา?</AlertDialogTitle>
                        <AlertDialogDescription>
                          ลบ {course.courseCode.toUpperCase()} —{" "}
                          {course.courseTitle} ออกจากรายวิชาที่เปิดสอน
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => removeCourse(course.courseCode)}
                        >
                          ยืนยัน
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
