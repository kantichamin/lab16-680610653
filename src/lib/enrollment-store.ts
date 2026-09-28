import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  /** Admin ลงทะเบียนวิชาให้นักศึกษาคนใดก็ได้ (ไม่ซ้ำกับที่มีอยู่แล้ว) */
  enroll: (studentId: string[], courseCode: string) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  drop: (studentId: string, courseCode: string) => void;
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string) => void;
  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  removeCourse: (courseCode: string) => void;

  addCourse: (courseCode: string, courseTitle: string, instructors: string[]) => void;
  removeInstructor: (courseCode: string, instructorName: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,

      enroll: (studentNames, courseCode) =>
        set((state) => ({
          students: state.students.map((student) => {
            if (studentNames.includes(`${student.firstName} ${student.lastName}`)) {
              if (student.enrolledCourses.includes(courseCode)) return student;
              return {
                ...student,
                enrolledCourses: [...student.enrolledCourses, courseCode],
              };
            }
            return student;
          }),
        })),

      drop: (studentId, courseCode) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.studentId === studentId
              ? {
                  ...student,
                  enrolledCourses: student.enrolledCourses.filter(
                    (code) => code !== courseCode
                  ),
                }
              : student
          ),
        })),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
        })),

      removeCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          students: state.students.map((student) => {
            if (!student.enrolledCourses.includes(courseCode)) return student;
            return {
              ...student,
              enrolledCourses: student.enrolledCourses.filter(
                (code) => code !== courseCode
              ),
            };
          }),
        })),

      addCourse: (courseCode, courseTitle, instructors) =>
        set((state) => {
          const normalizedCode = courseCode.trim().toUpperCase();
          const exists = state.courses.some((c) => c.courseCode === normalizedCode);
          if (exists) return state;
          return {
            courses: [
              ...state.courses,
              {
                courseCode: normalizedCode,
                courseTitle: courseTitle,
                instructors: instructors,
              },
            ],
          };
        }),

      removeInstructor: (courseCode, instructorName) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseCode === courseCode
              ? {
                  ...c,
                  instructors: c.instructors?.filter((i) => i !== instructorName) || [],
                }
              : c
          ),
        })),
    }),
    {
      name: "lab16-2569-680610653",
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    }
  )
);