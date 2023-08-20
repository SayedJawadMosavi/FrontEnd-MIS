

const search=[
  {
    name: 'همه',
    id: 'all',
  },
   
  {
    name: 'شماره موتر ',
    id: 'id',
  },

]
const tabs = [
  { title: 'موتر ها', icon: 'mdi-truck-fast', count: 0 ,key:'cars'},

  // { title: 'trash', icon:'mdi-trash',count:0},
]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
    
  {
    title: 'موتر ها',
    disabled: true,
    href: 'orders',
  },
]


const headers = [

  {
    title: '#آی دی',
    key: 'id',
  },
  {
    title: 'دیدن مصارف',
    key: 'view_expense',
  },
  {
    title: 'پرینت',
    key: 'print',
  },
  {
    title: 'حالت بارگیری ',
    key: 'status',
    width:'80px',
  },
  {
    title: 'مجموع سفارش',
    key: 'orders_count',
  },
  {
    title: 'تعداد جنس ها',
    key: 'items_count',
  },
  {
    title: 'مجموع کارتن',
    key: 'items_sum_count',
  },
  {
    title: 'وزن مجموعی',
    key: 'items_sum_weight',
  },
  {
    title: 'مجموع مصارف اضافی',
    key: 'extra_expense_sum_price',
  },
  {
    title: 'مجموع پول',
    key: 'total_price',
  },
  {
    title: 'مجموع پرداختی',
    key: 'payments_sum_amount',
  },
  {
    title: 'مجموعه باقیمانده',
    key: 'remainder',
  },
 
  {
    title: 'مجموعه مصارف موتر',
    key: 'car_expense_sum_price',
  },
  {
    title: 'فایده',
    key: 'benefits',
  },
  {
    title: 'شروع تاریخ',
    key: 'start_date',
  },
  {
    title: 'ختم تاریخ',
    key: 'end_date',
  },
    
]

export default function usePageConfig() {
  return {
    headers,
    tabs,
    breadCrumbs,
    search,
  }
}
