type HeaderProps = {
  kitchenName: string
}

export function Header({ kitchenName }: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="brand-badge">Cloud kitchen</p>
        <h1>{kitchenName}</h1>
      </div>
    </header>
  )
}
