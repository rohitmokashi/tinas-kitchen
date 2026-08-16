import type { Menu } from '../types'

type MenuCardProps = {
  label: string
  menu: Menu
  alt?: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Date'
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function MenuCard({ label, menu, alt = false }: MenuCardProps) {
  return (
    <div className={`menu-card ${alt ? 'alt' : ''}`}>
      <span className="menu-label">{label}</span>
      <h3>{formatDate(menu.date)}</h3>
      <ul>
        <li>
          <strong>Breakfast:</strong> {menu.breakfast}
        </li>
        <li>
          <strong>Lunch:</strong> {menu.lunch}
        </li>
        <li>
          <strong>Dinner:</strong> {menu.dinner}
        </li>
      </ul>
    </div>
  )
}
