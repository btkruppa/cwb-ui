import { z } from 'zod';
import { WeekDaySchema } from './Time';

export const DailyRepeatOptionSchema = z.enum(['Required', 'Optional', 'Skip']);

export const WeeklyCadenceSchema = z.object({
  type: z.literal('Weekly'),
  daysOfWeek: z.record(WeekDaySchema, DailyRepeatOptionSchema),
}).superRefine((cadence, ctx) => {
  const hasDay = Object.values(cadence.daysOfWeek).some(d => d !== 'Skip')
  if (!hasDay) ctx.addIssue({ code: 'custom', message: 'Select at least one day' })
});

export const MonthlyCadenceSchema = z.object({
  type: z.literal('Monthly'),
  /**
   * Frequency of repeat
   * Every 1, 2, 3, ... months
   */
  frequency: z.number(),
  /**
   * If true will cause the activity to carry over until it is complete
   * Future events will be updated based on last completed date
   */
  carryOverUntilComplete: z.boolean(),
  dayOfMonth: z.number(),
});

export const CadenceSchema = z.discriminatedUnion('type', [
  WeeklyCadenceSchema,
  MonthlyCadenceSchema,
]);

export const MarkingTypeSchema = z.enum(['checkbox', 'number']);

export const ActivitySchema = z.object({
  uid: z.uuid(),
  owner: z.string(),
  title: z.string().max(25),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  markingType: MarkingTypeSchema,
  cadence: CadenceSchema,
}).superRefine((data, ctx) => {
  if (data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({ code: 'custom', message: 'Must be after start date', path: ['endDate'] })
  }
});

export const CreateActivitySchema = ActivitySchema.omit({ uid: true, owner: true });

export const PatchActivitySchema = ActivitySchema
  .omit({ uid: true, owner: true, markingType: true })
  .partial()
  .strict();

export type DailyRepeatOption = z.infer<typeof DailyRepeatOptionSchema>;
export type MarkingType = z.infer<typeof MarkingTypeSchema>;
export type WeeklyCadence = z.infer<typeof WeeklyCadenceSchema>;
export type MonthlyCadence = z.infer<typeof MonthlyCadenceSchema>;
export type Cadence = z.infer<typeof CadenceSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;
export type PatchActivity = z.infer<typeof PatchActivitySchema>;
