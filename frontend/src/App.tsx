import { useEffect, useState } from 'react'
import './App.css'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminLoginPage } from './components/AdminLoginPage'
import { Header } from './components/Header'
import { MenuCard } from './components/MenuCard'
import { PriceBox } from './components/PriceBox'
import { RegistrationForm } from './components/RegistrationForm'
import type { HomeData, Menu } from './types'

const emptyMenu: Menu = {
  date: '',
  breakfast: 'Menu not updated yet',
  lunch: 'Menu not updated yet',
  dinner: 'Menu not updated yet',
}

const emptyHomeData: HomeData = {
  kitchen_name: 'Tinas Wholesome kitchen',
  service_area: 'Hinjewadi Phase 1, Pune',
  fixed_prices: {
    breakfast: 50,
    lunch: 150,
    dinner: 150,
  },
  today_menu: emptyMenu,
  tomorrow_menu: emptyMenu,
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function App() {
  const [homeData, setHomeData] = useState<HomeData>(emptyHomeData)
  const [registration, setRegistration] = useState({
    name: '',
    phone: '',
    area: 'Hinjewadi Phase 1',
    email: '',
  })
  const [notice, setNotice] = useState('')
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
  })
  const [adminError, setAdminError] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('tinas-admin-auth') === 'true'
  })

  const isAdminRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/'))

  const fetchHomeData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/home/`)
      if (!response.ok) {
        return
      }
      const data = await response.json()
      setHomeData({
        ...emptyHomeData,
        ...data,
        today_menu: data.today_menu || emptyMenu,
        tomorrow_menu: data.tomorrow_menu || emptyMenu,
      })
    } catch (error) {
      console.error('Failed to fetch home data', error)
    }
  }

  useEffect(() => {
    fetchHomeData()
  }, [])

  const handleRegistrationChange = (field: string, value: string) => {
    setRegistration((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice('')

    try {
      const response = await fetch(`${apiUrl}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(registration).toString(),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to register customer')
      }

      setNotice('Registration successful.')
      setRegistration({ name: '', phone: '', area: 'Hinjewadi Phase 1', email: '' })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to register customer')
    }
  }

  const handleAdminChange = (field: string, value: string) => {
    setAdminForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAdminLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAdminError('')

    if (adminForm.username === 'admin' && adminForm.password === 'admin123') {
      localStorage.setItem('tinas-admin-auth', 'true')
      setIsAdminAuthenticated(true)
      window.history.pushState({}, '', '/admin')
      return
    }

    setAdminError('Invalid username or password.')
  }

  const handleAdminLogout = () => {
    localStorage.setItem('tinas-admin-auth', 'false')
    setIsAdminAuthenticated(false)
    setAdminForm({ username: '', password: '' })
    window.history.pushState({}, '', '/')
  }

  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          form={adminForm}
          onChange={handleAdminChange}
          onSubmit={handleAdminLogin}
          onBack={() => {
            window.history.pushState({}, '', '/')
            window.location.reload()
          }}
          error={adminError}
        />
      )
    }

    return <AdminDashboard onBack={handleAdminLogout} />
  }

  return (
    <div className="app-shell">
      <Header kitchenName={homeData.kitchen_name} />

      <main className="client-view">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Fresh, wholesome meals for busy days</p>
            <h2>Healthy home-style meals delivered across Hinjewadi Phase 1</h2>
            <p className="hero-copy">
              Nutritious breakfast, lunch, and dinner with fixed daily pricing and a rotating
              menu updated every day for your convenience.
            </p>
            <PriceBox
              breakfast={homeData.fixed_prices.breakfast}
              lunch={homeData.fixed_prices.lunch}
              dinner={homeData.fixed_prices.dinner}
            />
          </div>
        </section>

        <section className="info-grid">
          <article className="info-card">
            <h3>About us</h3>
            <p>
              Tinas Wholesome kitchen serves balanced, flavourful meals with simple ingredients,
              honest nutrition, and no compromise on freshness.
            </p>
          </article>
          <article className="info-card">
            <h3>Service area</h3>
            <p>{homeData.service_area}</p>
          </article>
          <article className="info-card">
            <h3>Daily pricing</h3>
            <p>Breakfast ₹50 | Lunch ₹150 | Dinner ₹150</p>
          </article>
        </section>

        <section className="register-panel">
          <div className="section-heading">
            <h3>Register</h3>
            <p>Join our customer list and get meal updates.</p>
          </div>

          <RegistrationForm
            value={registration}
            onChange={handleRegistrationChange}
            onSubmit={handleRegister}
          />
        </section>

        <section className="menu-panel">
          <MenuCard label="Today's menu" menu={homeData.today_menu} />
          <MenuCard label="Tomorrow's menu" menu={homeData.tomorrow_menu} alt />
        </section>
      </main>

      {notice ? <div className="notice">{notice}</div> : null}
    </div>
  )
}

export default App
