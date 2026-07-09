import { Archive, CheckCircle2, ClipboardList, MapPinned, PencilLine, PlaneTakeoff } from 'lucide-react';

export const planningStatusOptions = [
  {
    value: 'DRAFT',
    label: 'Draft',
    description: 'Basic trip details started',
    color: 'slate',
    Icon: PencilLine,
    badgeClassName:
      'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900/45 dark:text-slate-200',
    iconClassName: 'text-slate-600 dark:text-slate-300',
  },
  {
    value: 'PLANNING',
    label: 'Planning',
    description: 'Actively adding details',
    color: 'blue',
    Icon: ClipboardList,
    badgeClassName:
      'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950/45 dark:text-blue-200',
    iconClassName: 'text-blue-600 dark:text-blue-300',
  },
  {
    value: 'READY',
    label: 'Ready',
    description: 'Plan is ready to use',
    color: 'green',
    Icon: CheckCircle2,
    badgeClassName:
      'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-200',
    iconClassName: 'text-emerald-600 dark:text-emerald-300',
  },
  {
    value: 'ONGOING',
    label: 'Ongoing',
    description: 'Trip is currently underway',
    color: 'orange',
    Icon: PlaneTakeoff,
    badgeClassName:
      'border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-950/45 dark:text-orange-200',
    iconClassName: 'text-orange-600 dark:text-orange-300',
  },
  {
    value: 'TRAVELED',
    label: 'Traveled',
    description: 'Trip has happened',
    color: 'violet',
    Icon: MapPinned,
    badgeClassName:
      'border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-800 dark:bg-violet-950/45 dark:text-violet-200',
    iconClassName: 'text-violet-600 dark:text-violet-300',
  },
  {
    value: 'ARCHIVED',
    label: 'Archived',
    description: 'No longer active',
    color: 'red',
    Icon: Archive,
    badgeClassName: 'border-red-300 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950/45 dark:text-red-200',
    iconClassName: 'text-red-600 dark:text-red-300',
  },
] as const;

export type PlanningStatusValue = (typeof planningStatusOptions)[number]['value'];

const planningStatusByValue = new Map(planningStatusOptions.map((status) => [status.value, status]));

export const getPlanningStatusOption = (status: PlanningStatusValue) => {
  return planningStatusByValue.get(status) ?? planningStatusOptions[0];
};
