import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { MarkingType } from '../../api/model/Activity'
import { useCreateActivity } from '../../api/client/apiHooks'
import { FormField } from '../../components/FormField/FormField'
import { WeeklyCadenceFields } from './Cadence/WeeklyCadenceFields'
import { MonthlyCadenceFields } from './Cadence/MonthlyCadenceFields'
import './CreateActivityPage.scss'
import { useCreateActivityStore } from '../../store/createActivityStore'

export function CreateActivityPage() {
  const navigate = useNavigate()
  const { mutate: createActivity, isPending } = useCreateActivity()

  const { activity, updateActivity } = useCreateActivityStore();
  // useEffect(() => { reset() }, [reset])

  // const errors = validateActivityForm(store)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // touchAll()
    // if (Object.keys(validateActivityForm(useActivityFormStore.getState())).length > 0) return

    // const parsed = CreateActivitySchema.safeParse({
    //   title: activity,
    //   startDate: new Date(store.startDate),
    //   endDate: store.endDate ? new Date(store.endDate) : undefined,
    //   markingType: store.markingType,
    //   cadence: store.cadence,
    // })
    // if (!parsed.success) {
    //   setSubmitError(parsed.error.issues[0].message)
    //   return
    // }

    setSubmitError(null)
    createActivity(activity, {
      onSuccess: () => { void navigate(-1) },
    })
  }

  return (
    <div className="create-activity">
      <form onSubmit={handleSubmit} className="create-activity__form">

        <FormField
          label="Title"
          type="text"
          value={activity.title}
          onChange={e => updateActivity({title: e.target.value})}
          placeholder="e.g. Morning run"
          // error={touched.title ? errors.title : undefined}
        />

        <FormField
          label="Start date"
          type="date"
          value={activity.startDate.getTime()}
          onChange={e => updateActivity({ startDate: new Date(e.target.value)})}
          // error={touched.startDate ? errors.startDate : undefined}
        />

        {/* <FormField
          label="End date"
          hint="(optional)"
          type="date"
          value={store.endDate}
          onChange={e => setEndDate(e.target.value)}
          // error={touched.endDate ? errors.endDate : undefined}
        /> */}

        <div className="create-activity__field">
          <span className="create-activity__field-label">Marking type</span>
          <div className="create-activity__segment">
            {(['checkbox', 'number'] as MarkingType[]).map(type => (
              <button
                key={type}
                type="button"
                className={`create-activity__segment-btn${activity.markingType === type ? ' create-activity__segment-btn--active' : ''}`}
                onClick={() => updateActivity({markingType: type})}
              >
                {type === 'checkbox' ? 'Checkbox' : 'Number'}
              </button>
            ))}
          </div>
        </div>

        <div className="create-activity__field">
          <span className="create-activity__field-label">Cadence</span>
          <div className="create-activity__segment">
            {(['Weekly', 'Monthly'] as const).map(type => (
              <button
                key={type}
                type="button"
                className={`create-activity__segment-btn${activity.cadence.type === type ? ' create-activity__segment-btn--active' : ''}`}
                onClick={() => {
                  if (type === 'Weekly') {
                    updateActivity({
                      cadence: {
                        type: 'Weekly',
                        daysOfWeek: {
                          Monday: 'Skip', Tuesday: 'Skip', Wednesday: 'Skip', Thursday: 'Skip',
                          Friday: 'Skip', Saturday: 'Skip', Sunday: 'Skip',
                        },
                      }
                    })
                  } else {
                    updateActivity({
                      cadence: { 
                        type: 'Monthly', frequency: 1, dayOfMonth: 1, carryOverUntilComplete: false 
                      }
                    })
                  }
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <WeeklyCadenceFields 
          // error={touched.cadence ? errors.cadence : undefined}
        />
        <MonthlyCadenceFields />

        {submitError && <span className="create-activity__error">{submitError}</span>}

        <button type="submit" className="create-activity__submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Create Activity'}
        </button>

      </form>
    </div>
  )
}
