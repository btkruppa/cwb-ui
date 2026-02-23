import { useId } from 'react'
import './FormField.scss'

interface FormFieldProps extends React.ComponentProps<'input'> {
  label: string
  hint?: string
  inputWidth?: 'full' | 'compact'
  error?: string
}

export function FormField({ label, hint, id: idProp, inputWidth = 'full', error, ...inputProps }: FormFieldProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
        {hint && <span className="form-field__hint">{hint}</span>}
      </label>
      <input
        id={id}
        className={`form-field__input form-field__input--${inputWidth}`}
        data-error={error ? true : undefined}
        {...inputProps}
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  )
}
