import { EmployeeForm } from '@/components/employee-form';

export default function NewEmployeePage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Add employee</h2>
      <EmployeeForm />
    </div>
  );
}
