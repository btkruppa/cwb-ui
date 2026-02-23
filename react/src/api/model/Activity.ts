import { z } from 'zod';
import { CadenceSchema } from './Cadence';

export const MarkingTypeSchema = z.enum(['checkbox', 'number']);

export const ActivitySchema = z.object({
  uid: z.uuid(),
  owner: z.string(),
  title: z.string().max(25),
  startDate: z.coerce.date(),
  markingType: MarkingTypeSchema,
  cadence: CadenceSchema,
});

export const CreateActivitySchema = ActivitySchema
  .omit({ uid: true, owner: true })

export const PatchActivitySchema = ActivitySchema
  .omit({ uid: true, owner: true, markingType: true })
  .partial()
  .strict();

export type MarkingType = z.infer<typeof MarkingTypeSchema>;

export type Cadence = z.infer<typeof CadenceSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;
export type PatchActivity = z.infer<typeof PatchActivitySchema>;
