import { create } from "zustand";
import type { Activity, Cadence } from "../api/model/Activity";
import { ActivitySchema } from "../api/model/Activity";
import z from "zod";
import type { $ZodErrorTree } from "zod/v4/core";

export interface ActivityFormStore {
  activity: Activity
  errors: $ZodErrorTree<Activity> | null
  updateActivity: (updates: Partial<Activity>) => void
}

export const useCreateActivityStore = create<ActivityFormStore>()((set) => ({
  activity: getInitialActivity(),
  errors: null,
  updateActivity(updates) {
    set((state) => {
      const updatedActivity = {...state.activity, ...updates}
      const validationErrors = ActivitySchema.safeParse(updatedActivity).error
      let errors = null;
      if (validationErrors) {
        errors = z.treeifyError(validationErrors)
      }
      return { activity: updatedActivity, errors };
    })
  }, 
}))

function getInitialActivity(): Activity {
  return {
    owner: '',
    uid: '',
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    markingType: 'checkbox',
    cadence: getDefaultCadence('Weekly')
  }
} 

export function getDefaultCadence(type: Activity["cadence"]['type']): Cadence {
  if (type === 'Weekly') {
    return {
      type: 'Weekly',
      daysOfWeek: {Sunday: 'Skip', Monday: 'Skip', Tuesday: 'Skip', Wednesday: 'Skip', Thursday: 'Skip', Friday: 'Skip', Saturday: 'Skip'}
    }
  }

  return { type: 'Monthly', frequency: 1, dayOfMonth: 1, carryOverUntilComplete: false }  
}
