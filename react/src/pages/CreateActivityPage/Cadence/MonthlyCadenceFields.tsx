import type { MonthlyCadence } from '../../../api/model/Cadence'
import { FormField } from '../../../components/FormField/FormField'
import { useCreateActivityStore } from '../../../store/createActivityStore'

export function MonthlyCadenceFields() {
  const { activity, updateActivity } = useCreateActivityStore()
  const {cadence} = activity

  if (cadence.type !== 'Monthly') return null

  function updateCadence(updates: Partial<MonthlyCadence>) {
    const updatedCadence: MonthlyCadence = {...cadence as MonthlyCadence, ...updates}
    updateActivity({cadence: updatedCadence})
  }

  return (
    <>
      <FormField
        label="Every N months"
        type="number"
        inputWidth="compact"
        min={1}
        value={cadence.frequency}
        onChange={e => updateCadence({ frequency: Number(e.target.value) })}
      />

      <FormField
        label="Day of month"
        type="number"
        inputWidth="compact"
        min={1}
        max={31}
        value={cadence.dayOfMonth}
        onChange={e => updateCadence({ dayOfMonth: Number(e.target.value) })}
      />

      <div className="create-activity__field create-activity__field--row">
        <span className="create-activity__field-label">Carry over until complete</span>
        <input
          type="checkbox"
          checked={cadence.carryOverUntilComplete}
          onChange={e => updateCadence({ carryOverUntilComplete: e.target.checked })}
        />
      </div>
    </>
  )
}
