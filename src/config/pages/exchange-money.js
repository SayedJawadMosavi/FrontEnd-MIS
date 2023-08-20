const tabs = [
  {title: "همه", icon: "mdi-currency",count: 0, key:'all'},
  {title: "حذف شده ها", icon: "mdi-trash",count: 0, key: "trash"},
]
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'شماره حواله',
    id: 'exchange_id',
  },
  {
    name: 'تاریخ ثبت',
    id: 'created_at',
  },
 
    

]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
      
  {
    title: 'لیست حواله',
    disabled: true,
    href: 'exchange_money',
  },
]

const headers = [
  {
    title: 'شماره',
    key: 'id',
   
  },
  {
    title: 'پرینت',
    key: 'print',
  },
  {
    title: 'اسم فرستنده',
    key: 'sender_name',
   
  },
  {
    title: 'شماره حواله',
    key: 'exchange_id',
   
  },
  
  {
    title:'تاریخ',
    key: 'date',
    
  },
  {
    title: 'واحد ',
    key: 'currency',
  },
  {
    title: 'ولایت',
    key: 'province',
  },

  {
    title: 'اسم گیرنده',
    key: 'receiver_name',
   
  },
  {
    title: 'اسم پدر گیرنده',
    key: 'receiver_father_name',
   
  },
  {
    title: 'شماره تذکره',
    key: 'receiver_id_no',
    
  },
  {
    title: 'شماره تلفن',
    key: 'phone_number',
   
  },
  {
    title: 'مبلغ پول',
    key: 'amount',
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
  