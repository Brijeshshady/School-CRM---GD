import { BookOpen } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useStudentAssignments } from "./hooks/useStudentData";
import { AsyncWrapper } from "../../components/ui/AsyncWrapper";

export const StudentAssignments = () => {
  const { data: assignments, isLoading, isError } = useStudentAssignments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Assignments</h1>
        <p className="text-slate-500">Track and manage your homework and assignments</p>
      </div>

      <AsyncWrapper isLoading={isLoading} isError={isError}>
        <div className="grid grid-cols-1 gap-4">
          {assignments?.map((assignment) => {
            const daysLeft = differenceInDays(new Date(assignment.dueDate), new Date());
            const isOverdue = daysLeft < 0 && assignment.status !== 'graded' && assignment.status !== 'submitted';
            const isDueSoon = daysLeft <= 2 && daysLeft >= 0;
            return (
              <div
                key={assignment._id}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      assignment.status === "graded" ? "bg-green-100" : 
                      assignment.status === "submitted" ? "bg-blue-100" : 
                      isOverdue ? "bg-red-100" : 
                      isDueSoon ? "bg-orange-100" : "bg-slate-100"
                    }`}>
                      <BookOpen className={`w-6 h-6 ${
                        assignment.status === "graded" ? "text-green-600" : 
                        assignment.status === "submitted" ? "text-blue-600" : 
                        isOverdue ? "text-red-600" : 
                        isDueSoon ? "text-orange-600" : "text-slate-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-slate-500 mb-2">{assignment.subject?.name}</p>
                      <p className="text-sm text-slate-600">{assignment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium mb-2 ${
                      isOverdue ? "text-red-600" : 
                      isDueSoon ? "text-orange-600" : "text-slate-500"
                    }`}>
                      {isOverdue ? "Overdue" : `Due ${format(new Date(assignment.dueDate), "MMM dd, yyyy")}`}
                    </p>
                    <span className={`inline-block text-sm px-3 py-1 rounded-lg ${
                      assignment.status === "graded" ? "bg-green-100 text-green-700" : 
                      assignment.status === "submitted" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {assignment.status === "graded" ? `Grade: ${assignment.grade}` : (assignment.status || 'Pending').charAt(0).toUpperCase() + (assignment.status || 'Pending').slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {(!assignments || assignments.length === 0) && (
            <p className="text-center text-slate-500 py-12 bg-white rounded-xl border border-dashed border-slate-200">
              No assignments found for your class.
            </p>
          )}
        </div>
      </AsyncWrapper>
    </div>
  );
};
