<template>
  <div>
    <EditExpense
      ref="editRef"
      :data="editData"
      :update-changes="getExpenses"
    />

    <VBtn
      class="mb-2"
      to="/cars"
    >
      <VIcon
        start
        icon="mdi-undo-variant"
      />
      بازگشت
    </VBtn>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
      :style="`pointer-events: ${expenseData?.deleted_at ? 'none' : 'auto'}`"
    >
      <!-- Notification -->
      <VWindowItem value="expense">
        <VRow>
          <ConfirmDialog
            ref="confirmRef"
            @confirm="onConfirm"
          />

          <VCol cols="12">
            <!-- 👉 Table -->
            <VCard style="min-height: 300px">
              <VTable class="text-no-wrap">
                <thead>
                  <tr>
                    <th scope="col">
                      #آی دی
                    </th>
                    <th scope="col">
                      توضیحات
                    </th>
                    <th scope="col">
                      ثبت توسط
                    </th>
                    <th scope="col">
                      مقدار مصرف
                    </th>
                    <th scope="col">
                      تاریخ مصرف
                    </th>
                    <th
                      scope="col"
                      class="text-center"
                    >
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in expenseData"
                    :key="index"
                    :class="`${item.deleted_at ? 'text-error' : ''}`"
                  >
                    <td>
                      {{ item.id }}
                    </td>
                    <td>
                      {{ item.name }}
                    </td>
                    <td>
                      {{ item?.user?.name }}
                    </td>
                    <td>
                      <VChip
                        style="direction: ltr"
                        small
                        :color="`${item.deleted_at ? 'error' : 'success'}`"
                        class="font-weight-medium"
                      >
                        {{ item.price ?? 0 }} $
                      </VChip>
                    </td>
                    <td>{{ formateDate(item.created_at) }}</td>

                    <td class="text-center">
                      <div v-if="item.deleted_at">
                        <VBtn
                          variant="text"
                          icon
                          size="small"
                          color="info"
                          :loading="restoreLoading"
                          @click="restoreExpense(item)"
                        >
                          <VIcon
                            start
                            icon="mdi-restore"
                            color="info"
                          />
                          بازیابی
                        </VBtn>
                        <VBtn
                          class="ms-2"
                          variant="text"
                          icon
                          size="small"
                          :loading="apiLoading2"
                          @click="forceDelete(item)"
                        >
                          <VIcon
                            icon="mdi-trash"
                            color="error"
                          />
                        </VBtn>
                      </div>

                      <div v-else>
                        <VBtn
                          variant="text"
                          icon
                          size="small"
                          @click="editForm(item)"
                        >
                          <VIcon
                            icon="mdi-pencil"
                            color="primary"
                          />
                        </VBtn>

                        <VBtn
                          variant="text"
                          icon
                          size="small"
                          :loading="apiLoading2"
                          @click="deleteExpense(item)"
                        >
                          <VIcon
                            icon="mdi-trash"
                            color="error"
                          />
                        </VBtn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

      <VWindowItem value="orders">
        <VRow>
          <VCol cols="12">
            <VCard style="min-height: 300px">
              <VTable
                class="text-no-wrap"
                height="400px"
              >
                <thead>
                  <tr>
                    <th
                      v-for="header, index in order_headers"
                      :key="index"
                      scope="col"
                    >
                      {{ header.title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in orderData"
                    :key="index"
                    :class="`${item.deleted_at ? 'text-error' : ''}`"
                  >
                    <td
                      v-for="header,i in order_headers"
                      :key="i"
                    > 
                      {{ header.key=='created_at'?formateDate(item[header.key]): item[header.key] }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
    </VWindow>
  </div>
</template>


<script setup>
import { axios } from '@/plugins/axios-plugin'
import EditExpense from '@/views/pages/cars/EditExpense.vue'
import { required, numeric, minLength, minValue, maxValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { computed, ref, toRef } from 'vue'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import { formateDate } from '@/@core/utils/index'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'

const route = useRoute()
const activeTab = ref('details')
const car_id = ref(route.params.car_id)

const apiLoading = ref(false)
const expenseData = ref([])
const orderData = ref([])
const resetData = ref({})
const snackbar = ref(false)
const editRef = ref(false)
const order_headers = [
  {
    title: '#آی دی',
    key: 'id',
    width: '80px',
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

// tabs
const tabs = [
  {
    title: 'لیست مصارف',
    icon: 'mdi-cash-multiple',
    tab: 'expense',
  },
  {
    title: 'لیست سفارشات ',
    icon: 'mdi-cart',
    tab: 'orders',
  },
]

const getExpenses = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('car-expenses/' + car_id.value)
    expenseData.value = data.expenses
    orderData.value = data.orders
    console.log('dart',orderData.value)
    resetData.value = JSON.parse(JSON.stringify(data))
    if (data.deleted_at) {
      snackbar.value = true
    }
  } catch (error) {
    console.error('datatable', expenseData.value)
  }
  apiLoading.value = false
}

const formRefs = ref()
const editData = ref({
  id: null,
  amount: 0,
})

const apiLoading2 = ref(false)
const restoreLoading = ref(false)

const confirmRef = ref()
const selectedItem = ref({})

const payload = ref({
  created_at: new Date(),
  amount: null,
  car_id: car_id,
  car_id: car_id,
})

const remaining = computed(() => {
  return 0
})

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const expenseRule = {
  created_at: { required },
  car_id: { required },
  car_id: { required },
  amount: { required, minValue: minValue(0), maxValue: maxValue(remaining) },
}

const v$ = useVuelidate(expenseRule, payload)
const resetForm = (type = 'items') => {
  payload.value = {
    created_at: new Date(),
    amount: null,
    car_id: car_id,
    car_id: car_id,
  }
  v$.value.$reset()
  formRefs.value.resetValidation()
}

const editForm = async item => {
  editRef.value.openDialog(item)
}
const deleteExpense = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('delete')
}

const restoreExpense = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('restore')
}

const forceDelete = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('forceDelete')
}
const onConfirm = async event => {
  if (event == 'delete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`car-expenses/` + selectedItem.value.id)
      await getExpenses()
    } catch (error) {
      console.error('error', error)
    }
    apiLoading2.value = false
  }
  if (event == 'forceDelete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`force-delete-car-expenses/` + selectedItem.value.id)
      await getExpenses()
    } catch (error) {
      console.error('error', error)
    }
    apiLoading2.value = false
  }

  if (event == 'restore') {
    try {
      restoreLoading.value = true
      const { data } = await axios.post(`restore-car-expenses/` + selectedItem.value.id)
      await getExpenses()
    } catch (error) {
      console.error('error', error)
    }
    restoreLoading.value = false
  }
}

const validateForm = async () => {
  formRefs.value.validate()
  v$.value.$touch()
  if (v$.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

async function submit() {
  try {
    apiLoading.value = true

    const { data } = await axios.post(`order-payment`, payload.value)

    resetForm()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

function convertToEnglishNumbers(model, var_name = 'payload') {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (var_name == 'payload')
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    if (var_name == 'editData')
      editData.value[model] = editData.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  }
}
getExpenses()
</script>



<style>
.dp__input{
padding: 12px 4px 12px 40px !important;
}
.dp__menu dp__menu_index  {
background: red !important;

}

.dp__theme_dark ,.dp__theme_light  {
--dp-background-color:  rgb(var(--v-theme-surface));
--dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
--dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
--dp-hover-text-color: gba(var(--v-theme-on-surface),1);
--dp-hover-icon-color: var(--v-theme-on-surface);
--dp-primary-color: #40A579;
--dp-primary-text-color:#fff;
--dp-secondary-color: #8A8D93;
--dp-border-color:rgba(var(--v-border-color), var(--v-border-opacity));
--dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
--dp-border-color-hover:rgba(var(--v-border-color),var(--v-medium-emphasis-opacity) )
--dp-border-radius:10px  !important;
--dp-disabled-color:var(--v-disabled-opacity);
--dp-scroll-bar-background: var(--v-theme-on-surface);
--dp-scroll-bar-color: #484848;
--dp-success-color: #00701a;
--dp-success-color-disabled: #428f59;
--dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
--dp-danger-color: #e53935;
--dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style> 


<route lang="yaml">
meta:
  navActiveLink: pages-account-settings-tab
  auth: true
</route>
