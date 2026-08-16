import { useEffect, useMemo, useState } from 'react'

type Customer = {
  id: number
  name: string
  phone: string
  area: string
  email: string | null
}

type Order = {
  id: number
  customer_id: number
  customer_name: string
  meal_type: string
  quantity: number
  total_price: number
  status: string
}

type MenuEntry = {
  date: string
  breakfast: string
  lunch: string
  dinner: string
}

type AdminDashboardProps = {
  onBack: () => void
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [menu, setMenu] = useState<MenuEntry>({
    date: new Date().toISOString().slice(0, 10),
    breakfast: '',
    lunch: '',
    dinner: '',
  })
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderForm, setOrderForm] = useState({
    customer_id: '',
    meal_type: 'breakfast',
    quantity: '1',
    status: 'pending',
  })
  const [message, setMessage] = useState('')

  const fetchCustomers = async () => {
    const response = await fetch(`${apiUrl}/api/customers/`)
    if (response.ok) {
      const data = await response.json()
      setCustomers(data.customers || [])
    }
  }

  const fetchOrders = async () => {
    const response = await fetch(`${apiUrl}/api/orders/`)
    if (response.ok) {
      const data = await response.json()
      setOrders(data.orders || [])
    }
  }

  const fetchMenu = async () => {
    const response = await fetch(`${apiUrl}/api/home/`)
    if (response.ok) {
      const data = await response.json()
      setMenu({
        date: new Date().toISOString().slice(0, 10),
        breakfast: data.today_menu?.breakfast || '',
        lunch: data.today_menu?.lunch || '',
        dinner: data.today_menu?.dinner || '',
      })
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchOrders()
    fetchMenu()
  }, [])

  const handleMenuSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = new URLSearchParams({
      date: menu.date,
      breakfast: menu.breakfast,
      lunch: menu.lunch,
      dinner: menu.dinner,
    })

    const response = await fetch(`${apiUrl}/api/menu/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    })

    if (response.ok) {
      setMessage('Menu saved successfully.')
    } else {
      setMessage('Unable to save menu.')
    }
  }

  const handleOrderCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const response = await fetch(`${apiUrl}/api/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer_id: orderForm.customer_id,
        meal_type: orderForm.meal_type,
        quantity: orderForm.quantity,
        status: orderForm.status,
      }).toString(),
    })

    if (response.ok) {
      setMessage('Order created successfully.')
      setOrderForm({ customer_id: '', meal_type: 'breakfast', quantity: '1', status: 'pending' })
      fetchOrders()
    } else {
      setMessage('Unable to create order.')
    }
  }

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0),
    [orders],
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-badge">Admin dashboard</p>
          <h1>Tinas Wholesome kitchen</h1>
        </div>
        <button type="button" className="admin-login-link" onClick={onBack}>
          Back to home
        </button>
      </header>

      <main className="admin-dashboard">
        <section className="admin-panel">
          <div className="section-heading">
            <h3>Daily menu</h3>
            <p>Update today’s food items for customers.</p>
          </div>

          <form className="menu-form" onSubmit={handleMenuSave}>
            <label>
              Date
              <input
                type="date"
                value={menu.date}
                onChange={(event) => setMenu({ ...menu, date: event.target.value })}
              />
            </label>
            <label>
              Breakfast
              <textarea
                value={menu.breakfast}
                onChange={(event) => setMenu({ ...menu, breakfast: event.target.value })}
              />
            </label>
            <label>
              Lunch
              <textarea
                value={menu.lunch}
                onChange={(event) => setMenu({ ...menu, lunch: event.target.value })}
              />
            </label>
            <label>
              Dinner
              <textarea
                value={menu.dinner}
                onChange={(event) => setMenu({ ...menu, dinner: event.target.value })}
              />
            </label>
            <button type="submit">Save menu</button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="section-heading">
            <h3>Create order</h3>
            <p>Add a new meal order for a customer.</p>
          </div>

          <form className="menu-form" onSubmit={handleOrderCreate}>
            <label>
              Customer
              <select
                value={orderForm.customer_id}
                onChange={(event) => setOrderForm({ ...orderForm, customer_id: event.target.value })}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Meal type
              <select
                value={orderForm.meal_type}
                onChange={(event) => setOrderForm({ ...orderForm, meal_type: event.target.value })}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={(event) => setOrderForm({ ...orderForm, quantity: event.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={orderForm.status}
                onChange={(event) => setOrderForm({ ...orderForm, status: event.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
              </select>
            </label>
            <button type="submit">Create order</button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="section-heading">
            <h3>Customers</h3>
            <p>Registered customer list.</p>
          </div>

          <div className="customer-list">
            {customers.length === 0 ? (
              <p>No customers registered yet.</p>
            ) : (
              customers.map((customer) => (
                <div key={customer.id} className="customer-card">
                  <div>
                    <strong>{customer.name}</strong>
                    <p>{customer.phone}</p>
                  </div>
                  <div>
                    <span>{customer.area}</span>
                    <small>{customer.email || 'No email'}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="admin-panel">
          <div className="section-heading">
            <h3>Orders</h3>
            <p>Total revenue: ₹{revenue}</p>
          </div>

          <div className="customer-list">
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="customer-card">
                  <div>
                    <strong>{order.customer_name}</strong>
                    <p>{order.meal_type} × {order.quantity}</p>
                  </div>
                  <div>
                    <span>₹{order.total_price}</span>
                    <small>{order.status}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {message ? <div className="notice">{message}</div> : null}
    </div>
  )
}
