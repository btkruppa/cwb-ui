import { NavLink } from 'react-router'
import { House, Calendar, SquarePen, ChartNoAxesCombined } from 'lucide-react'
import './BottomBar.scss'

const NAV_ITEMS = [
  { to: '/', icon: House, label: 'Home' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/manage', icon: SquarePen, label: 'Manage' },
  { to: '/dashboard', icon: ChartNoAxesCombined, label: 'Dashboard' },
] as const

export function BottomBar() {
  return (
    <nav className="bottom-bar" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `bottom-bar__item ${isActive ? 'bottom-bar__item--active' : ''}`
          }
        >
          <item.icon size={24} strokeWidth={2} aria-hidden="true" />
          {/* <span className="bottom-bar__label">{item.label}</span> */}
        </NavLink>
      ))}
    </nav>
  )
}
