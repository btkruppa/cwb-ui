import './SegmentField.scss'

interface SegmentFieldProps<T extends string> {
  label: string
  options: readonly T[]
  value: T
  onSelect: (value: T) => void
  renderLabel?: (option: T) => string
}

export function SegmentField<T extends string>({ label, options, value, onSelect, renderLabel }: SegmentFieldProps<T>) {
  const display = renderLabel ?? ((o: T) => o.charAt(0).toUpperCase() + o.slice(1))

  return (
    <div className="segment-field">
      <span className="segment-field__label">{label}</span>
      <div className="segment-field__options">
        {options.map(option => (
          <button
            key={option}
            type="button"
            className={`segment-field__btn${value === option ? ' segment-field__btn--active' : ''}`}
            onClick={() => onSelect(option)}
          >
            {display(option)}
          </button>
        ))}
      </div>
    </div>
  )
}
