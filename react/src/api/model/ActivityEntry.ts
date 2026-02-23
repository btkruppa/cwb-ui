import { z } from 'zod';

const BaseActivityEntrySchema = z.object({
  activityId: z.uuid(),
  entryId: z.uuid(),
  entryTime: z.string(),
});

export const CheckboxActivityEntrySchema = BaseActivityEntrySchema.extend({
  markingType: z.literal('checkbox'),
  value: z.boolean(),
});

export const NumberActivityEntrySchema = BaseActivityEntrySchema.extend({
  markingType: z.literal('number'),
  value: z.number(),
});

export const ActivityEntrySchema = z.discriminatedUnion('markingType', [
  CheckboxActivityEntrySchema,
  NumberActivityEntrySchema,
]);

export type CheckboxActivityEntry = z.infer<typeof CheckboxActivityEntrySchema>;
export type NumberActivityEntry = z.infer<typeof NumberActivityEntrySchema>;
export type BaseActivityEntry = z.infer<typeof ActivityEntrySchema>;
