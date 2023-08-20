


const tabs = [
  { title: 'کاربران', icon: 'mdi-accounts', count: 0 ,key:'users'},
  { title: 'حذف شده ها', icon:'mdi-trash',count:0,key:'trash'},
]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
    
  {
    title: 'لیست کاربران',
    disabled: true,
    href: 'users',
  },


]

const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name:'آی دی',
    id: 'id',
  },
  {
    name:'بر اساس تاریخ',
    id: 'created_at',
  },
]


const headers= [
 
  {
    title: '#آی دی',
    key: 'id',
    width:'80px',
  },
 
 
  {
    title: 'ایمل',
    key: 'email',
  },
  {
    title:'نقش',
    key: 'role',
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
