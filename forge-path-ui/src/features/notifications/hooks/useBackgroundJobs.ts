import { useBackgroundStore } from "@/shared/stores/background.store";

export default function useBackgroundJobs() {
  const store = useBackgroundStore();
  return {
    jobs: store.jobs,
    addJob: store.addJob,
    updateProgress: store.updateProgress,
    completeJob: store.completeJob,
    failJob: store.failJob,
  };
}
