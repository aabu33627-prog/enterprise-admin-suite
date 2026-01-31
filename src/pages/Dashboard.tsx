import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign,
  Activity,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/badge';

// Sample data
const patientData = [
  { id: 'P001', name: 'John Smith', age: 45, department: 'Cardiology', status: 'Active', lastVisit: '2024-01-15' },
  { id: 'P002', name: 'Sarah Johnson', age: 32, department: 'Neurology', status: 'Active', lastVisit: '2024-01-14' },
  { id: 'P003', name: 'Michael Brown', age: 58, department: 'Orthopedics', status: 'Discharged', lastVisit: '2024-01-12' },
  { id: 'P004', name: 'Emily Davis', age: 28, department: 'Dermatology', status: 'Active', lastVisit: '2024-01-16' },
  { id: 'P005', name: 'Robert Wilson', age: 67, department: 'Cardiology', status: 'Critical', lastVisit: '2024-01-16' },
  { id: 'P006', name: 'Lisa Anderson', age: 41, department: 'Oncology', status: 'Active', lastVisit: '2024-01-15' },
  { id: 'P007', name: 'David Martinez', age: 55, department: 'Pulmonology', status: 'Active', lastVisit: '2024-01-13' },
  { id: 'P008', name: 'Jennifer Taylor', age: 36, department: 'Gynecology', status: 'Discharged', lastVisit: '2024-01-11' },
];

const billingData = [
  { invoiceId: 'INV-001', patient: 'John Smith', amount: '$1,250.00', date: '2024-01-15', status: 'Paid' },
  { invoiceId: 'INV-002', patient: 'Sarah Johnson', amount: '$850.00', date: '2024-01-14', status: 'Pending' },
  { invoiceId: 'INV-003', patient: 'Michael Brown', amount: '$2,100.00', date: '2024-01-12', status: 'Paid' },
  { invoiceId: 'INV-004', patient: 'Emily Davis', amount: '$450.00', date: '2024-01-16', status: 'Overdue' },
  { invoiceId: 'INV-005', patient: 'Robert Wilson', amount: '$3,500.00', date: '2024-01-16', status: 'Pending' },
  { invoiceId: 'INV-006', patient: 'Lisa Anderson', amount: '$1,800.00', date: '2024-01-15', status: 'Paid' },
];

const patientColumns = [
  { key: 'id' as const, header: 'Patient ID', sortable: true },
  { key: 'name' as const, header: 'Name', sortable: true },
  { key: 'age' as const, header: 'Age', sortable: true },
  { key: 'department' as const, header: 'Department', sortable: true },
  { 
    key: 'status' as const, 
    header: 'Status', 
    sortable: true,
    render: (value: unknown) => {
      const status = value as string;
      const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        Active: 'default',
        Discharged: 'secondary',
        Critical: 'destructive',
      };
      return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
    }
  },
  { key: 'lastVisit' as const, header: 'Last Visit', sortable: true },
];

const billingColumns = [
  { key: 'invoiceId' as const, header: 'Invoice ID', sortable: true },
  { key: 'patient' as const, header: 'Patient', sortable: true },
  { key: 'amount' as const, header: 'Amount', sortable: true },
  { key: 'date' as const, header: 'Date', sortable: true },
  { 
    key: 'status' as const, 
    header: 'Status', 
    sortable: true,
    render: (value: unknown) => {
      const status = value as string;
      const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        Paid: 'default',
        Pending: 'secondary',
        Overdue: 'destructive',
      };
      return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
    }
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Patients"
            value="2,847"
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
          />
          <SummaryCard
            title="New Patients"
            value="145"
            icon={UserPlus}
            trend={{ value: 8.2, isPositive: true }}
          />
          <SummaryCard
            title="Appointments"
            value="89"
            icon={Calendar}
            trend={{ value: 3.1, isPositive: false }}
          />
          <SummaryCard
            title="Revenue"
            value="$48,250"
            icon={DollarSign}
            trend={{ value: 15.3, isPositive: true }}
          />
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryCard
            title="Active Cases"
            value="234"
            icon={Activity}
          />
          <SummaryCard
            title="Reports Generated"
            value="1,456"
            icon={FileText}
          />
        </div>

        {/* Data tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DataTable
            title="Patient List"
            columns={patientColumns}
            data={patientData}
            pageSize={5}
          />
          <DataTable
            title="Recent Billing"
            columns={billingColumns}
            data={billingData}
            pageSize={5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
