import { Link } from 'react-router-dom'
import classes from './ActionIcon.module.css'

/**
 * Standard icon button for CRUD actions used across the whole project.
 *
 * Props:
 *  - type     "edit" | "delete" | "confirm" | "email" | "view"  (required)
 *  - to       route path -> renders a <Link> (for edit navigation)
 *  - onClick  click handler -> renders a <button> (for modal openers etc.)
 *  - disabled disable the button (button mode only)
 *  - title    tooltip / aria-label (falls back to a sensible default)
 */
const TYPES = {
  edit: { icon: 'far fa-edit', label: 'Edit' },
  delete: { icon: 'far fa-trash-alt', label: 'Delete' },
  confirm: { icon: 'fas fa-check', label: 'Confirm' },
  email: { icon: 'fas fa-envelope', label: 'Send email' },
  view: { icon: 'far fa-eye', label: 'Preview' },
}

const ActionIcon = ({ type, to, onClick, disabled = false, title }) => {
  const config = TYPES[type] || { icon: '', label: '' }
  const className = `${classes.action} ${classes[type] || ''}`
  const label = title || config.label
  const icon = <i className={config.icon}></i>

  if (to) {
    return (
      <Link to={to} className={className} title={label} aria-label={label}>
        {icon}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

export default ActionIcon
