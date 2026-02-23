import { z } from 'zod';

export const WeekDaySchema = z.enum([
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]);

export type WeekDay = z.infer<typeof WeekDaySchema>;

export const WEEK_DAYS: WeekDay[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 
];

export const DAY_ABBR: Record<WeekDay, string> = {
  Sunday: 'Sun', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', 
};
