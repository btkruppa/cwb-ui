import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SegmentField } from '../../components/SegmentField/SegmentField'
import { useCreateActivity } from '../../api/client/apiHooks'
import { FormField } from '../../components/FormField/FormField'
import { WeeklyCadenceFields } from './Cadence/WeeklyCadenceFields'
import { MonthlyCadenceFields } from './Cadence/MonthlyCadenceFields'
import './CreateActivityPage.scss'
import { getDefaultCadence, useCreateActivityStore } from '../../store/createActivityStore'
import { CreateActivitySchema, type Activity } from '../../api/model/Activity'
import z from 'zod'

export function CreateActivityPage() {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { mutate: createActivity, isPending } = useCreateActivity()
  const { activity, updateActivity } = useCreateActivityStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validationError = CreateActivitySchema.safeParse(activity).error
    if (validationError) {
      setSubmitError(z.prettifyError(validationError))
      return;
    }
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

        {/* todo i broke this field */}
        <FormField
          label="Start date"
          type="date"
          value={activity.startDate}
          onChange={e => updateActivity({ startDate: e.target.value })}
          // error={touched.startDate ? errors.startDate : undefined}
        />

        <SegmentField
          label="Marking type"
          options={['checkbox', 'number'] as const}
          value={activity.markingType}
          onSelect={type => updateActivity({ markingType: type })}
        />

        <SegmentField
          label="Cadence"
          options={['Weekly', 'Monthly'] as const}
          value={activity.cadence.type}
          onSelect={type => updateActivity({cadence: getDefaultCadence(type)})}
        />

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
