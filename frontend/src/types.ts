export type Menu = {
  date: string
  breakfast: string
  lunch: string
  dinner: string
}

export type HomeData = {
  kitchen_name: string
  service_area: string
  fixed_prices: {
    breakfast: number
    lunch: number
    dinner: number
  }
  today_menu: Menu
  tomorrow_menu: Menu
}
