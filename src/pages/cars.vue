<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست موتر ها"
      :show-create="false"
      :show-delete="false"
      :show-restore="scope(['car_restore'])"
      :show-force-delete="scope(['car_force_delete'])"
      page-icon="mdi-truck-fast"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          v-if="scope(['car_create']) && datatableRefs?.selectedItems?.length > 0"
          class="ms-2"
          ripple
          prepend-icon="mdi-plus"
          @click="createExpense"
        >
          افزودن مصارف
        </VBtn>
      </template>
    </BreadCrumbs>

    <AddExpense ref="orderRef" />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:extra-total="extraTotal"
      v-model:loading="apiLoading"
      :tabs="tabs"
      :headers="headers"
      :items="tableRecords"
      @table-change="onTableChange($event)"
    >
      <template #remainder="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="error"
          class="font-weight-medium"
        >
          {{ item?.remainder?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #total_price="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item.total_price?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #extra_expense_sum_price="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="warning"
          class="font-weight-medium"
        >
          {{ item.extra_expense_sum_price?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #items_sum_weight="{ item }">
        <VChip
          small
          style="direction: ltr"
          color="info"
          class="font-weight-medium"
        >
          {{ item.items_sum_weight ?? 0 }} kg
        </VChip>
      </template>
      <template #payments_sum_amount="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item.payments_sum_amount ?? 0 }} $
        </VChip>
      </template>

      <template #benefits="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item.benefits?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #car_expense_sum_price="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="warning"
          class="font-weight-medium"
        >
          {{ item.car_expense_sum_price?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #start_date="{ item }">
        <div style="white-space: nowrap">
          {{ formateDate(item.start_date) }}
        </div>
      </template>

      <template #end_date="{ item }">
        <div style="white-space: nowrap">
          {{ formateDate(item.end_date) }}
        </div>
      </template>
      <template #status="{ item }">
        <VSwitch
          :model-value="item.status"
          inset
          :true-value="1"
          :loading="selectedItemStatus.id == item.id && statusLoading"
          @click="changeStatus(item)"
        />
      </template>

      <template #print="{ item }">
        <VBtn
          variant="text"
          icon
          class="font-weight-bold"
          :loading="printLoading && selectedItemStatus.id == item.id"
          @click="print(item)"
        >
          <VIcon
            size="30"
            icon="mdi-printer"
          />
        </VBtn>
      </template>

      <template #view_expense="{ item }">
        <VBtn
          variant="text"
          icon
          :loading="expenseLoading && selectedId ==item.id"
          @click="viewExpense(item)"
        >
          <VIcon
            size="30"
            icon="mdi-eye-arrow-right"
          />
        </VBtn>
      </template>
    </DataTable>

    <CarPrint
      ref="printRefs"
      v-model:print-item="printData"
    />
  </div>
</template>

<script setup>
import AddExpense from '@/views/pages/cars/AddExpense.vue'
import CarPrint from '@/views/pages/cars/CarPrint.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import usePageConfig from '@/config/pages/cars'
import { toast } from 'vue3-toastify'
import router from '@/router'
import { formateDate, scope } from '@/@core/utils/index'

const { tabs, headers, breadCrumbs, search } = usePageConfig()

const total = ref(0)
const isEnabled = ref(true)
const extraTotal = ref({})
const orderRef = ref()
const apiLoading = ref(false)
const datatableRefs = ref()
const searchOption = ref({})
const selectedItemStatus = ref({})
const statusLoading = ref(false)
const printLoading = ref(false)
const expenseLoading = ref(false)
const printData = ref([])
const printRefs = ref()
const selectedId = ref(null)


const options = ref({ page: 1, itemPerPage: 20, tab: 'cars' })
const tableRecords = ref([])
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const createExpense = () => {
  const selected = datatableRefs.value?.selectedItems
  if (selected.length > 1) {
    toast.error('Please select only one item!')

    return
  }

  orderRef.value.openDialog(selected)
}

const onTableChange = value => {
  options.value = value
  fetchRecord()
}

const changeStatus = async item => {
  try {
    selectedItemStatus.value = item
    statusLoading.value = true
    const { data } = await axios.post('car-status', item)
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
  statusLoading.value = false
}

const fetchRecord = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('cars', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
  } catch (error) {
    console.error('datatable', error)
  }
  apiLoading.value = false
}
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const print = async item => {
  try {
    selectedItemStatus.value = item
    printLoading.value = true
    let { data } = await axios.get('car-orders?id=' + item.id)
    printData.value = await data
    await sleep(1)
    const printable = window.open('', '_blank')

    printable.document.write('<html style="direction:rtl"><head><style>@page { size: A4 landscape }</style>')
    printable.document.write('</head><body>')
    printable.document.write(printRefs.value.$el.innerHTML)
    printable.document.write('</body></html>')
    printable.document.close()
    printable.print()
    await sleep(1)
    printable.close()
  } catch (error) {
    console.error('error', error)
  }
  printLoading.value = false
}

const viewExpense = async item => {
  expenseLoading.value = true
  selectedId.value=item.id  
  await router.replace('view-car-expense/' + item.id)
  expenseLoading.value = false
}

onMounted(() => {
  fetchRecord()
})
</script>



<style lang="scss">
.expand-card {
  height: 300px !important;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s ease-out;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>



<route lang="yaml">
meta:
  auth: true
</route>


