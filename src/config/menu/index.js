import employee_menu from "./employee_menu"
import exchange_money_menu from "./exchange_money_menu"
import order_menu from './order_menu'
import user_menu from "./user_menu"
const menus = [
  ...user_menu,
  ...employee_menu,
  ...order_menu,
  ...exchange_money_menu,
]
export default menus
