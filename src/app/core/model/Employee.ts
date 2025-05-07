export interface Employee {
  id?: number;
  fullName: string;
  email: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  departmentId: number;
  department?: {
    id: number | string;
    name: string;
    description: string;
  };
}