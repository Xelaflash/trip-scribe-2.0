export const planningStatusOptions = [
  {
    value: 'DRAFT',
    label: 'Draft',
    description: 'Basic trip details started',
  },
  {
    value: 'PLANNING',
    label: 'Planning',
    description: 'Actively adding details',
  },
  {
    value: 'READY',
    label: 'Ready',
    description: 'Plan is ready to use',
  },
  {
    value: 'ONGOING',
    label: 'Ongoing',
    description: 'Trip is currently underway',
  },
  {
    value: 'TRAVELED',
    label: 'Traveled',
    description: 'Trip has happened',
  },
  {
    value: 'ARCHIVED',
    label: 'Archived',
    description: 'No longer active',
  },
] as const;

export type PlanningStatusValue = (typeof planningStatusOptions)[number]['value'];

const planningStatusByValue = new Map(planningStatusOptions.map((status) => [status.value, status]));

export const getPlanningStatusOption = (status: PlanningStatusValue) => {
  return planningStatusByValue.get(status) ?? planningStatusOptions[0];
};
