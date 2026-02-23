import { z } from 'zod';

export const WeekDaySchema = z.enum([
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]);

export type WeekDay = z.infer<typeof WeekDaySchema>;
