import { EmployeeForm } from '@/components/employee-form';

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Edit employee</h2>
      <EmployeeForm employeeId={id} />
    </div>
  );
}
