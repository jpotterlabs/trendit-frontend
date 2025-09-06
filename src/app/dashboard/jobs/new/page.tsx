import { DashboardLayout } from '@/components/dashboard/layout';
import { JobForm } from '@/components/collection/job-form';

export default function NewJobPage() {
  return (
    <DashboardLayout
      title="Create Collection Job"
      description="Set up a new Reddit data collection job"
    >
      <JobForm />
    </DashboardLayout>
  );
}