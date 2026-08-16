type RegistrationFormProps = {
  value: {
    name: string
    phone: string
    area: string
    email: string
  }
  onChange: (field: string, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function RegistrationForm({ value, onChange, onSubmit }: RegistrationFormProps) {
  return (
    <form className="register-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Full name"
        value={value.name}
        onChange={(event) => onChange('name', event.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={value.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Area"
        value={value.area}
        onChange={(event) => onChange('area', event.target.value)}
      />
      <input
        type="email"
        placeholder="Email address"
        value={value.email}
        onChange={(event) => onChange('email', event.target.value)}
      />
      <button type="submit">Register now</button>
    </form>
  )
}
