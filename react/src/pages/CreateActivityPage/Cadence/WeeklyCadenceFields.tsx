import type { DailyRepeatOption, WeeklyCadence } from '../../../api/model/Cadence'
import { DAY_ABBR, WEEK_DAYS } from '../../../api/model/Time'
import { useCreateActivityStore } from '../../../store/createActivityStore'

function nextDayState(state: DailyRepeatOption): DailyRepeatOption {
  if (state === 'Skip') return 'Required'
  if (state === 'Required') return 'Optional'
  return 'Skip'
}

interface WeeklyCadenceFieldsProps {
  error?: string
}

export function WeeklyCadenceFields({ error }: WeeklyCadenceFieldsProps) {
  const { activity, updateActivity } = useCreateActivityStore()
    const { cadence } = activity
  
    if (cadence.type !== 'Weekly') return null
  
    function updateCadence(updates: Partial<WeeklyCadence>) {
      const updatedCadence: WeeklyCadence = {...cadence as WeeklyCadence, ...updates}
      updateActivity({cadence: updatedCadence})
    }

  return (
    <div className="create-activity__field">
      <span className="create-activity__field-label">Days</span>
      <div className="create-activity__day-grid">
        {WEEK_DAYS.map(day => {
          const dayState = cadence.daysOfWeek[day]
          return (
            <button
              key={day}
              type="button"
              className={`create-activity__day-chip create-activity__day-chip--${dayState}`}
              onClick={() => updateCadence({
                daysOfWeek: { ...cadence.daysOfWeek, [day]: nextDayState(dayState) },
              })}
            >
              <span className="create-activity__day-name">{DAY_ABBR[day]}</span>
              {dayState !== 'Skip' && (
                <span className="create-activity__day-state">{dayState}</span>
              )}
            </button>
          )
        })}
      </div>
      {error && <span className="create-activity__error">{error}</span>}
    </div>
  )
}
