import type { WeekDay } from "./Time";

export type ActivityType = 'Weekly' | 'Monthly'
export type Activity = WeeklyActivity | MonthlyActivity

export interface BaseActivity {
  uid: string
  owner: string
  title: string
  startDate: Date
  endDate?: Date
  markingType: 'checkbox' | 'number'
  activityType: ActivityType
}

export type DailyRepeatOption = 'Required' | 'Optional'

export interface WeeklyActivity extends BaseActivity {
  activityType: 'Weekly'
  daysOfWeek: Partial<Record<WeekDay, DailyRepeatOption>>
}

export interface MonthlyActivity extends BaseActivity {
  activityType: 'Monthly'
  /**
   * Frequency of repeat
   * Every 1, 2, 3, ... months
   */
  frequency: number

  /**
   * If true will cause the activity to cary over until it is complete
   * Future events will be updated based on last completed date
   */
  carryOverUntilComplete: boolean

  dayOfMonth: number
}