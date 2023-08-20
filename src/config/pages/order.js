const tabs = [
  { title: 'سفارشات', icon: 'mdi-shopping-outline', count: 0, key: 'orders' },
  { title: 'حذف شده ها', icon: 'mdi-trash', count: 0, key: 'trash' },
]
const breadCrumbs = [
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },

  {
    title: 'لیست سفارشات',
    disabled: true,
    href: 'orders',
  },
]

const search = [
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'آی دی',
    id: 'id',
  },
  {
    name: 'نمبر گروپ',
    id: 'group_number',
  },
  {
    name: 'نمبر موتر',
    id: 'car_id',
  },
  {
    name: 'تاریخ ثبت',
    id: 'created_at',
  },
]

const headers = [
  {
    title: '#آی دی',
    key: 'id',
  },
  {
    title: 'دیدن بیشتر',
    key: 'view_profile',
  },
  {
    title: 'پرینت',
    key: 'print',
  },

  {
    title: 'نمبر گروپ',
    key: 'group_number',
  },
  {
    title: 'نمبر موتر',
    key: 'car_id',
    width: '100px',
  },
  {
    title: 'اسم مشتری',
    key: 'customer_name',
  },
  {
    title: 'اسم پدر',
    key: 'father_name',
  },
  {
    title: 'اسم پدر کلان',
    key: 'grand_father_name',
  },
  {
    title:'نمبر تذکره',
    key: 'tazkira_id',
  },
  {
    title: 'شماره تلفن مشتری',
    key: 'customer_phone',
    width: '160px',
  },
  
  {
    title: 'قیمت فی کیلو',
    key: 'price_per_killo',
    width: '120px',
  },
  {
    title: 'مجموع وزن',
    key: 'items_sum_weight',
    width: '130px',
  },

  {
    title: 'تعداد کارتن',
    key: 'items_sum_count',
    width: '130px',
  },
  {
    title: 'مجموع مصارف دیگر',
    key: 'extra_expense_sum_price',
    width: '140px',
  },
  {
    title: 'مجموع قیمت',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'مقدار پرداخت شده',
    key: 'paid_amount',
    width: '130px',
  },
  {
    title: 'باقیمانده',
    key: 'remainder',
    width: '180px',
  },
  {
    title: 'اسم گیرنده',
    key: 'receiver_name',
    width: '120px',
  },
  {
    title: 'نوع تحویل دهی',
    key: 'delivary_type',
    width: '100px',
  },
  {
    title: 'شماره تلفن گیرنده',
    key: 'receiver_phone',
    width: '100px',
  },
  {
    title: 'کشور',
    key: 'country',
  },
  {
    title: 'شهر',
    key: 'city',
  },
  {
    title: 'ادرس',
    key: 'address',
  },
  {
    title: 'توضیحات',
    key: 'description',
  },
  {
    title: 'تاریخ ثبت',
    key: 'created_at',
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
