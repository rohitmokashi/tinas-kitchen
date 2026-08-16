type PriceBoxProps = {
  breakfast: number
  lunch: number
  dinner: number
}

export function PriceBox({ breakfast, lunch, dinner }: PriceBoxProps) {
  return (
    <div className="price-box">
      <div>
        <span>Breakfast</span>
        <strong>₹{breakfast}</strong>
      </div>
      <div>
        <span>Lunch</span>
        <strong>₹{lunch}</strong>
      </div>
      <div>
        <span>Dinner</span>
        <strong>₹{dinner}</strong>
      </div>
    </div>
  )
}
