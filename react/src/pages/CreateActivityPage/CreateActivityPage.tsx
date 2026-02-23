import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { DailyRepeatOption, MarkingType } from '../../api/model/Activity'
import { CreateActivitySchema } from '../../api/model/Activity'
import type { WeekDay } from '../../api/model/Time'
import { useCreateActivity } from '../../api/client/apiHooks'
import { FormField } from '../../components/FormField/FormField'
import { useActivityFormStore, validateActivityForm } from '../../store/createActivity'
import './CreateActivityPage.scss'

const WEEK_DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DAY_ABBR: Record<WeekDay, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

function nextDayState(state: DailyRepeatOption): DailyRepeatOption {
  if (state === 'Skip') return 'Required'
  if (state === 'Required') return 'Optional'
  return 'Skip'
}

export function CreateActivityPage() {
  const navigate = useNavigate()
  const { mutate: createActivity, isPending } = useCreateActivity()

  const store = useActivityFormStore()
  const { touched, setTitle, setStartDate, setEndDate, setMarkingType, setCadence, touchAll, reset } = store

  useEffect(() => { reset() }, [reset])

  const errors = validateActivityForm(store)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    touchAll()
    if (Object.keys(validateActivityForm(useActivityFormStore.getState())).length > 0) return

    const parsed = CreateActivitySchema.safeParse({
      title: store.title,
      startDate: new Date(store.startDate),
      endDate: store.endDate ? new Date(store.endDate) : undefined,
      markingType: store.markingType,
      cadence: store.cadence,
    })
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0].message)
      return
    }

    setSubmitError(null)
    createActivity(parsed.data, {
      onSuccess: () => { void navigate(-1) },
    })
  }

  return (
    <div className="create-activity">
      <form onSubmit={handleSubmit} className="create-activity__form">

        <FormField
          label="Title"
          type="text"
          value={store.title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Morning run"
          error={touched.title ? errors.title : undefined}
        />

        <FormField
          label="Start date"
          type="date"
          value={store.startDate}
          onChange={e => setStartDate(e.target.value)}
          error={touched.startDate ? errors.startDate : undefined}
        />

        <FormField
          label="End date"
          hint="(optional)"
          type="date"
          value={store.endDate}
          onChange={e => setEndDate(e.target.value)}
          error={touched.endDate ? errors.endDate : undefined}
        />

        <div className="create-activity__field">
          <span className="create-activity__field-label">Marking type</span>
          <div className="create-activity__segment">
            {(['checkbox', 'number'] as MarkingType[]).map(type => (
              <button
                key={type}
                type="button"
                className={`create-activity__segment-btn${store.markingType === type ? ' create-activity__segment-btn--active' : ''}`}
                onClick={() => setMarkingType(type)}
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
                className={`create-activity__segment-btn${store.cadence.type === type ? ' create-activity__segment-btn--active' : ''}`}
                onClick={() => {
                  if (type === 'Weekly') {
                    setCadence({
                      type: 'Weekly',
                      daysOfWeek: {
                        Monday: 'Skip', Tuesday: 'Skip', Wednesday: 'Skip', Thursday: 'Skip',
                        Friday: 'Skip', Saturday: 'Skip', Sunday: 'Skip',
                      },
                    })
                  } else {
                    setCadence({ type: 'Monthly', frequency: 1, dayOfMonth: 1, carryOverUntilComplete: false })
                  }
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {store.cadence.type === 'Weekly' && (
          <div className="create-activity__field">
            <span className="create-activity__field-label">Days</span>
            <div className="create-activity__day-grid">
              {WEEK_DAYS.map(day => {
                const dayState = store.cadence.type === 'Weekly' ? store.cadence.daysOfWeek[day] : 'Skip'
                return (
                  <button
                    key={day}
                    type="button"
                    className={`create-activity__day-chip create-activity__day-chip--${dayState}`}
                    onClick={() => {
                      if (store.cadence.type === 'Weekly') {
                        setCadence({
                          ...store.cadence,
                          daysOfWeek: { ...store.cadence.daysOfWeek, [day]: nextDayState(dayState) },
                        })
                      }
                    }}
                  >
                    <span className="create-activity__day-name">{DAY_ABBR[day]}</span>
                    {dayState !== 'Skip' && (
                      <span className="create-activity__day-state">{dayState}</span>
                    )}
                  </button>
                )
              })}
            </div>
            {touched.cadence && errors.cadence && (
              <span className="create-activity__error">{errors.cadence}</span>
            )}
          </div>
        )}

        {store.cadence.type === 'Monthly' && (
          <>
            <FormField
              label="Every N months"
              type="number"
              inputWidth="compact"
              min={1}
              value={store.cadence.frequency}
              onChange={e => {
                if (store.cadence.type === 'Monthly') {
                  setCadence({ ...store.cadence, frequency: Number(e.target.value) })
                }
              }}
            />

            <FormField
              label="Day of month"
              type="number"
              inputWidth="compact"
              min={1}
              max={31}
              value={store.cadence.dayOfMonth}
              onChange={e => {
                if (store.cadence.type === 'Monthly') {
                  setCadence({ ...store.cadence, dayOfMonth: Number(e.target.value) })
                }
              }}
            />

            <div className="create-activity__field create-activity__field--row">
              <span className="create-activity__field-label">Carry over until complete</span>
              <input
                type="checkbox"
                checked={store.cadence.carryOverUntilComplete}
                onChange={e => {
                  if (store.cadence.type === 'Monthly') {
                    setCadence({ ...store.cadence, carryOverUntilComplete: e.target.checked })
                  }
                }}
              />
            </div>
          </>
        )}

        {submitError && <span className="create-activity__error">{submitError}</span>}

        <button type="submit" className="create-activity__submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Create Activity'}
        </button>

      </form>
    </div>
  )
}
