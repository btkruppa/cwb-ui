import { create } from "zustand";
import type { Activity } from "../api/model/Activity";
import { ActivitySchema } from "../api/model/Activity";
import z from "zod";
import type { $ZodErrorTree } from "zod/v4/core";

export interface ActivityFormStore {
  activity: Activity
  errors: $ZodErrorTree<Activity> | null
  updateActivity: (updates: Partial<Activity>) => void
}

function getInitialActivity(): Activity {
  return {
    owner: '',
    uid: '',
    title: '',
    startDate: new Date(),
    markingType: 'checkbox',
    cadence: {
      type: 'Weekly',
      daysOfWeek: {Sunday: 'Skip', Monday: 'Skip', Tuesday: 'Skip', Wednesday: 'Skip', Thursday: 'Skip', Friday: 'Skip', Saturday: 'Skip'}
    }
  }
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
