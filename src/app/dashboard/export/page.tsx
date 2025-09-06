import { DashboardLayout } from '@/components/dashboard/layout';
import { ExportBuilder } from '@/components/export/export-builder';

export default function ExportPage() {
  return (
    <DashboardLayout
      title="Data Export"
      description="Export your collected Reddit data in various formats"
    >
      <ExportBuilder />
    </DashboardLayout>
  );
}