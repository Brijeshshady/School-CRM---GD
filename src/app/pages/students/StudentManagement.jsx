import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { toast } from "sonner";
export function StudentManagement() {
  const { students, addStudent, updateStudent, deleteStudent } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) || student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.class.includes(classFilter);
    return matchesSearch && matchesClass;
  });
  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteStudent(id);
      toast.success("Student deleted successfully");
    }
  };
  const activeCount = students.filter((s) => s.status === "active").length;
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Management</h1>
          <p className="text-muted-foreground">View and manage all students</p>
        </div>
        <button
    onClick={() => setShowAddForm(true)}
    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
  >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Students</div>
          <div className="text-2xl font-bold">{students.length}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Active</div>
          <div className="text-2xl font-bold text-accent">{activeCount}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">New This Month</div>
          <div className="text-2xl font-bold text-primary">12</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Alumni</div>
          <div className="text-2xl font-bold text-muted-foreground">{students.filter((s) => s.status === "alumni").length}</div>
        </div>
      </div>

      {
    /* Filters */
  }
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
    type="text"
    placeholder="Search by name, roll number, or parent..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  />
          </div>
          <select
    value={classFilter}
    onChange={(e) => setClassFilter(e.target.value)}
    className="px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  >
            <option value="all">All Classes</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>
      </div>

      {
    /* Table */
  }
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-sm">Roll No.</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Student Name</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Class</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Parent Name</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => <tr key={student.id} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium">{student.rollNo}</td>
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.class} {student.section}</td>
                  <td className="py-3 px-4">{student.parentName}</td>
                  <td className="py-3 px-4">{student.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${student.status === "active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
    to={`/students/${student.id}`}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
    title="View"
  >
                        <Eye className="w-4 h-4 text-primary" />
                      </Link>
                      <button
    onClick={() => setEditingStudent(student)}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
    title="Edit"
  >
                        <Edit className="w-4 h-4 text-secondary" />
                      </button>
                      <button
    onClick={() => handleDelete(student.id, student.name)}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
    title="Delete"
  >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Pagination */
  }
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {
    /* Add/Edit Student Modal */
  }
      {(showAddForm || editingStudent) && <StudentFormModal
    student={editingStudent}
    onClose={() => {
      setShowAddForm(false);
      setEditingStudent(null);
    }}
    onSave={(student) => {
      if (editingStudent) {
        updateStudent(editingStudent.id, student);
        toast.success("Student updated successfully");
      } else {
        addStudent(student);
        toast.success("Student added successfully");
      }
      setShowAddForm(false);
      setEditingStudent(null);
    }}
  />}
    </div>;
}
function StudentFormModal({ student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    rollNo: student?.rollNo || "",
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    class: student?.class || "",
    section: student?.section || "",
    parentName: student?.parentName || "",
    parentEmail: student?.parentEmail || "",
    parentPhone: student?.parentPhone || "",
    address: student?.address || "",
    dateOfBirth: student?.dateOfBirth || "",
    admissionDate: student?.admissionDate || "",
    bloodGroup: student?.bloodGroup || "",
    status: student?.status || "active"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-2xl font-bold">{student ? "Edit Student" : "Add New Student"}</h2>
          <button
    onClick={onClose}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Roll Number</label>
                <input
    type="text"
    value={formData.rollNo}
    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                <input
    type="tel"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Class</label>
                <input
    type="text"
    value={formData.class}
    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Section</label>
                <input
    type="text"
    value={formData.section}
    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Date of Birth</label>
                <input
    type="date"
    value={formData.dateOfBirth}
    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Admission Date</label>
                <input
    type="date"
    value={formData.admissionDate}
    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Blood Group</label>
                <input
    type="text"
    value={formData.bloodGroup}
    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Status</label>
                <select
    value={formData.status}
    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground mb-1 block">Address</label>
                <textarea
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    rows={2}
    required
  />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Parent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Parent Name</label>
                <input
    type="text"
    value={formData.parentName}
    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Parent Email</label>
                <input
    type="email"
    value={formData.parentEmail}
    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Parent Phone</label>
                <input
    type="tel"
    value={formData.parentPhone}
    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              {student ? "Update Student" : "Add Student"}
            </button>
            <button
    type="button"
    onClick={onClose}
    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
  >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>;
}
