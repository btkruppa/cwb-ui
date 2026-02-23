import z from "zod";
import { WeekDaySchema } from "./Time";

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

export type WeeklyCadence = z.infer<typeof WeeklyCadenceSchema>;
export type MonthlyCadence = z.infer<typeof MonthlyCadenceSchema>;
export type DailyRepeatOption = z.infer<typeof DailyRepeatOptionSchema>;