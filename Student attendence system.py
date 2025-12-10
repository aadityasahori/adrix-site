student-attendance-system/
│── main.py
│── database.py
│── ui.py
│── attendance.db (auto-created)
import sqlite3

def connect_db():
    conn = sqlite3.connect("attendance.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            date TEXT,
            status TEXT,
            FOREIGN KEY(student_id) REFERENCES students(id)
        )
    """)

    conn.commit()
    return conn


def add_student(conn, name):
    conn.execute("INSERT INTO students (name) VALUES (?)", (name,))
    conn.commit()


def get_students(conn):
    return conn.execute("SELECT * FROM students").fetchall()


def mark_attendance(conn, student_id, date, status):
    conn.execute(
        "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)",
        (student_id, date, status)
    )
    conn.commit()


def fetch_attendance(conn):
    return conn.execute("""
        SELECT students.name, attendance.date, attendance.status
        FROM attendance
        JOIN students ON students.id = attendance.student_id
        ORDER BY attendance.date DESC
    """).fetchall()
import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
import database

conn = database.connect_db()


class AttendanceSystem:

    def __init__(self, root):
        self.root = root
        self.root.title("Student Attendance System")
        self.root.geometry("600x450")

        ttk.Label(root, text="Student Attendance System", font=("Arial", 20)).pack(pady=10)

        # Add Student Section
        frame1 = ttk.LabelFrame(root, text="Add Student")
        frame1.pack(fill="x", padx=10, pady=10)

        self.name_entry = ttk.Entry(frame1, width=30)
        self.name_entry.pack(side="left", padx=10)

        ttk.Button(frame1, text="Add Student", command=self.add_student).pack()

        # Mark Attendance Section
        frame2 = ttk.LabelFrame(root, text="Mark Attendance")
        frame2.pack(fill="x", padx=10, pady=10)

        self.student_list = ttk.Combobox(frame2, width=30)
        self.student_list.pack(side="left", padx=10)

        ttk.Button(frame2, text="Present", command=lambda: self.mark("Present")).pack(side="left")
        ttk.Button(frame2, text="Absent", command=lambda: self.mark("Absent")).pack(side="left")

        # View Attendance Section
        ttk.Button(root, text="View Attendance Records", command=self.view_records)\
            .pack(pady=10)

        self.load_students()

    def load_students(self):
        students = database.get_students(conn)
        self.student_list["values"] = [f"{s[0]} - {s[1]}" for s in students]

    def add_student(self):
        name = self.name_entry.get().strip()
        if name == "":
            messagebox.showerror("Error", "Enter a valid name")
            return
        database.add_student(conn, name)
        messagebox.showinfo("Success", "Student added")
        self.name_entry.delete(0, tk.END)
        self.load_students()

    def mark(self, status):
        if not self.student_list.get():
            messagebox.showerror("Error", "Select a student")
            return

        student_id = int(self.student_list.get().split(" - ")[0])
        date = datetime.now().strftime("%Y-%m-%d")

        database.mark_attendance(conn, student_id, date, status)
        messagebox.showinfo("Success", f"Attendance marked: {status}")

    def view_records(self):
        records = database.fetch_attendance(conn)

        win = tk.Toplevel()
        win.title("Attendance Records")
        win.geometry("500x300")

        table = ttk.Treeview(win, columns=("name", "date", "status"), show="headings")
        table.heading("name", text="Student")
        table.heading("date", text="Date")
        table.heading("status", text="Status")

        table.pack(fill="both", expand=True)

        for row in records:
            table.insert("", tk.END, values=row)
import tkinter as tk
from ui import AttendanceSystem

root = tk.Tk()
app = AttendanceSystem(root)
root.mainloop()
python main.py
