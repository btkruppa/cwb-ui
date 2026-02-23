import { z } from "zod";
import { create } from "zustand";
import type { Activity, Cadence, DailyRepeatOption, MarkingType } from "../api/model/Activity";
import { ActivitySchema, CadenceSchema } from "../api/model/Activity";
import type { WeekDay } from "../api/model/Time";

type FieldKey = 'title' | 'startDate' | 'endDate' | 'cadence'

export interface ActivityFormErrors {
  title?: string
  startDate?: string
  endDate?: string
  cadence?: string
}

export interface ActivityFormStore {
  title: string
  startDate: string
  endDate: string
  markingType: MarkingType
  cadence: Cadence

  touched: Partial<Record<FieldKey, true>>

  setTitle: (v: string) => void
  setStartDate: (v: string) => void
  setEndDate: (v: string) => void
  setMarkingType: (v: MarkingType) => void
  setCadence: (v: Cadence) => void

  touchAll: () => void
  reset: () => void
  init: (activity: Activity) => void
}

const INITIAL_STATE = {
  title: '',
  startDate: '',
  endDate: '',
  markingType: 'checkbox' as const,
  cadence: {
    type: 'Weekly' as const,
    daysOfWeek: {
      Monday: 'Skip', Tuesday: 'Skip', Wednesday: 'Skip', Thursday: 'Skip',
      Friday: 'Skip', Saturday: 'Skip', Sunday: 'Skip',
    } as Record<WeekDay, DailyRepeatOption>,
  },
  touched: {} as Partial<Record<FieldKey, true>>,
}

const ActivityFormSchema = z.object({
  title: ActivitySchema.shape.title
    .refine(s => s.trim().length > 0, 'Required'),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string(),
  cadence: CadenceSchema,
}).superRefine((data, ctx) => {
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    ctx.addIssue({ code: 'custom', message: 'Must be after start date', path: ['endDate'] })
  }
})

export function validateActivityForm(state: Pick<ActivityFormStore, 'title' | 'startDate' | 'endDate' | 'cadence'>): ActivityFormErrors {
  const result = ActivityFormSchema.safeParse(state)
  if (result.success) return {}
  const errors: ActivityFormErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ActivityFormErrors
    if (field && !errors[field]) errors[field] = issue.message
  }
  return errors
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export const useActivityFormStore = create<ActivityFormStore>()((set) => ({
  ...INITIAL_STATE,

  setTitle: (v) => set(s => ({ title: v, touched: { ...s.touched, title: true } })),
  setStartDate: (v) => set(s => ({ startDate: v, touched: { ...s.touched, startDate: true } })),
  setEndDate: (v) => set(s => ({ endDate: v, touched: { ...s.touched, endDate: true } })),
  setMarkingType: (v) => set(() => ({ markingType: v })),
  setCadence: (v) => set(s => ({ cadence: v, touched: { ...s.touched, cadence: true } })),

  touchAll: () => set(() => ({
    touched: { title: true, startDate: true, endDate: true, cadence: true },
  })),

  reset: () => set(() => ({ ...INITIAL_STATE, touched: {} })),

  init: (activity) => set(() => ({
    title: activity.title,
    startDate: toDateString(activity.startDate),
    endDate: activity.endDate ? toDateString(activity.endDate) : '',
    markingType: activity.markingType,
    cadence: activity.cadence,
    touched: {},
  })),
}))
