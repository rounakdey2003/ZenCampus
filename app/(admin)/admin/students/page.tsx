"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Users, UserPlus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface Student {
  _id: string;
  usn: string;
  name: string;
  mobile: string;
  room?: string;
  email?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  course?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

export default function StudentsManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: students, loading, error, refetch, post, put, del } = useApi<Student[]>("/api/students");

  useEffect(() => {
    if (searchQuery) {
      refetch({ search: searchQuery });
    } else {
      refetch();
    }
  }, [searchQuery, refetch]);

  const filteredStudents = students || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      await post({
        usn: formData.get("usn"),
        name: formData.get("name"),
        email: formData.get("email"),
        mobile: formData.get("mobile"),
        room: formData.get("room"),
        password: formData.get("password"),
      });
      toast.success("Student added successfully!");
      setShowAddModal(false);
      form.reset();
      refetch();
    } catch (err) {
      toast.error("Failed to add student: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      try {
        await put(selectedStudent._id, {
          name: formData.get("name"),
          email: formData.get("email"),
          mobile: formData.get("mobile"),
          room: formData.get("room"),
        });
        toast.success("Student updated successfully!");
        setShowEditModal(false);
        setSelectedStudent(null);
        refetch();
      } catch (err) {
        toast.error("Failed to update student: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const handleDelete = async (id: string, usn: string) => {
    if (confirm(`Are you sure you want to delete student ${usn}?`)) {
      try {
        await del(id);
        toast.success("Student deleted successfully!");
        refetch();
      } catch (err) {
        toast.error("Failed to delete student: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove students</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full md:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold">{loading ? "..." : filteredStudents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active This Month</p>
            <p className="text-2xl font-bold">{loading ? "..." : filteredStudents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Rooms Occupied</p>
            <p className="text-2xl font-bold">{loading ? "..." : new Set(filteredStudents.map(s => s.room).filter(Boolean)).size}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Search Results</p>
            <p className="text-2xl font-bold">{loading ? "..." : filteredStudents.length}</p>
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, USN, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading students...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No students found. {searchQuery && "Try adjusting your search."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{student.name}</h4>
                      <p className="text-sm text-gray-600">
                        USN: {student.usn} {student.room && `• Room: ${student.room}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Mobile: {student.mobile} {student.email && `• Email: ${student.email}`}
                      </p>
                      {(student.bloodGroup || student.course) && (
                        <p className="text-sm text-gray-600">
                          {student.bloodGroup && `Blood: ${student.bloodGroup}`}
                          {student.bloodGroup && student.course && ' • '}
                          {student.course}
                        </p>
                      )}
                      {student.dateOfBirth && (
                        <p className="text-sm text-gray-600">
                          DOB: {new Date(student.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      {student.emergencyContact?.name && (
                        <p className="text-sm text-gray-600">
                          Emergency: {student.emergencyContact.name} ({student.emergencyContact.relation}) - {student.emergencyContact.phone}
                        </p>
                      )}
                      {student.address && (
                        <p className="text-sm text-gray-600 mt-1">
                          Address: {student.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(student._id, student.usn)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalHeader onClose={() => setShowAddModal(false)}>Add New Student</ModalHeader>
        <ModalBody>
          <form onSubmit={handleAdd} id="add-form" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usn">USN</Label>
              <Input name="usn" id="usn" placeholder="e.g., 1MS21CS001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input name="name" id="name" placeholder="Enter student name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" placeholder="student@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input name="mobile" id="mobile" type="tel" placeholder="10-digit mobile" pattern="\d{10}" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room Number</Label>
              <Input name="room" id="room" placeholder="e.g., A-101" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (default: 123456)</Label>
              <Input name="password" id="password" type="password" placeholder="Enter password (optional)" minLength={6} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button type="submit" form="add-form" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add Student
          </Button>
        </ModalFooter>
      </Modal>

      {selectedStudent && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <ModalHeader onClose={() => setShowEditModal(false)}>Edit Student</ModalHeader>
          <ModalBody>
            <form onSubmit={handleUpdate} id="edit-form" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-usn">USN</Label>
                <Input id="edit-usn" defaultValue={selectedStudent.usn} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input name="name" id="edit-name" defaultValue={selectedStudent.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input name="email" id="edit-email" type="email" defaultValue={selectedStudent.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mobile">Mobile Number</Label>
                <Input
                  name="mobile"
                  id="edit-mobile"
                  type="tel"
                  defaultValue={selectedStudent.mobile}
                  pattern="\d{10}"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room">Room Number</Label>
                <Input name="room" id="edit-room" defaultValue={selectedStudent.room} />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-form" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Student
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
