import { create } from 'zustand';
import { CollectionJobResponse, DataSummary, PostAnalyticsResponse } from '@/lib/types';
import { api } from '@/lib/api/client';

interface DashboardState {
  jobs: CollectionJobResponse[];
  dataSummary: DataSummary | null;
  selectedJob: CollectionJobResponse | null;
  jobAnalytics: PostAnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadJobs: () => Promise<void>;
  loadDataSummary: () => Promise<void>;
  loadJobAnalytics: (jobId: string) => Promise<void>;
  selectJob: (job: CollectionJobResponse | null) => void;
  refreshJob: (jobId: string) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  jobs: [],
  dataSummary: null,
  selectedJob: null,
  jobAnalytics: null,
  isLoading: false,
  error: null,

  loadJobs: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await api.listJobs({ per_page: 50 });
      
      set({
        jobs: response.jobs,
        isLoading: false,
      });
      
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to load jobs';
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  loadDataSummary: async () => {
    try {
      const dataSummary = await api.getDataSummary();
      set({ dataSummary });
    } catch (error: any) {
      console.error('Failed to load data summary:', error);
      // Don't set error state for summary as it's not critical
    }
  },

  loadJobAnalytics: async (jobId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const analytics = await api.getJobAnalytics(jobId);
      
      set({
        jobAnalytics: analytics,
        isLoading: false,
      });
      
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to load analytics';
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  selectJob: (job: CollectionJobResponse | null) => {
    set({ selectedJob: job, jobAnalytics: null });
    
    if (job && job.status === 'completed') {
      // Auto-load analytics for completed jobs
      get().loadJobAnalytics(job.job_id);
    }
  },

  refreshJob: async (jobId: string) => {
    try {
      const updatedJob = await api.getJob(jobId);
      
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.job_id === jobId ? updatedJob : job
        ),
        selectedJob: state.selectedJob?.job_id === jobId ? updatedJob : state.selectedJob,
      }));
      
    } catch (error: any) {
      console.error('Failed to refresh job:', error);
    }
  },

  cancelJob: async (jobId: string) => {
    try {
      await api.cancelJob(jobId);
      
      // Refresh the job to get updated status
      await get().refreshJob(jobId);
      
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to cancel job';
      set({ error: message });
      throw error;
    }
  },

  deleteJob: async (jobId: string) => {
    try {
      await api.deleteJob(jobId);
      
      set((state) => ({
        jobs: state.jobs.filter((job) => job.job_id !== jobId),
        selectedJob: state.selectedJob?.job_id === jobId ? null : state.selectedJob,
        jobAnalytics: state.selectedJob?.job_id === jobId ? null : state.jobAnalytics,
      }));
      
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete job';
      set({ error: message });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));