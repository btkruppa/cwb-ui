import './TopBar.scss'

interface TopBarProps {
  title: string
  leftIcon?: React.ReactNode
  onLeftIconClick?: () => void
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
}

export function TopBar({ title, leftIcon, onLeftIconClick, rightIcon, onRightIconClick }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar__slot">
        {leftIcon && (
          <button className="top-bar__icon-btn" onClick={onLeftIconClick} aria-label="Left action">
            {leftIcon}
          </button>
        )}
      </div>
      <h1 className="top-bar__title">{title}</h1>
      <div className="top-bar__slot">
        {rightIcon && (
          <button className="top-bar__icon-btn" onClick={onRightIconClick} aria-label="Right action">
            {rightIcon}
          </button>
        )}
      </div>
    </header>
  )
}
