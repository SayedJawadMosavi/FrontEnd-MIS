<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست سفارشات"
      create-text="افزودن سفارش"
      print-text="پرنت"
      page-icon="mdi-shopping-outline"
      :show-create="scope(['order_create'])"
      :show-delete="scope(['order_delete'])"
      :show-restore="scope(['order_restore'])"
      :show-force-delete="scope(['order_force_delete'])"
      @on-create="createOrder"
      @on-force-delete="deleteRecord('force-delete')"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
      @on-print="printRecord"
    />

    <AddOrder
      ref="orderRef"
      :fetch-record="fetchRecord"
    />

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
      <template #paid_amount="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.payments_sum_amount?.toFixed(2) ?? 0 }} $
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
      <template #remainder="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="error"
          class="font-weight-medium"
        >
          {{ item.remainder?.toFixed(2) ?? 0 }} $
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
          color="info"
          class="font-weight-medium"
          style="direction: ltr"
        >
          {{ item.items_sum_weight }} kg
        </VChip>
      </template>
      <template #price_per_killo="{ item }">
        <VChip
          small
          style="direction: ltr"
          color="info"
          class="font-weight-medium"
        >
          {{ item.price_per_killo?.toFixed(2) }} $
        </VChip>
      </template>
      <template #view_profile="{ item }">
        <VBtn
          variant="text"
          icon
          :loading="profileLoading && selectedId==item.id"
          @click="viewProfile(item)"
        >
          <VIcon
            size="30"
            icon="mdi-eye-arrow-right"
          />
        </VBtn>
      </template>
      <template #print="{ item }">
        <VBtn
          variant="text"
          icon
          class="font-weight-bold"
          @click="print(item)"
        >
          <VIcon
            size="30"
            icon="mdi-printer"
          />
        </VBtn>
      </template>
      <template #description="{ item }">
        <div
          style="white-space: nowrap"
        >
          {{ item.description }}
        </div>
      </template>
      <template #customer_name="{ item }">
        <div
          style="white-space: nowrap"
        >
          {{ item.customer_name }}
        </div>
      </template>
      <template #father_name="{ item }">
        <div
          style="white-space: nowrap"
        >
          {{ item.father_name }}
        </div>
      </template>
      <template #grand_father_name="{ item }">
        <div
          style="white-space: nowrap"
        >
          {{ item.grand_father_name }}
        </div>
      </template>

    

      <template #delivary_type="{ item }">
        <div
          style="white-space: nowrap"
        >
          {{ item.delivary_type }}
        </div>
      </template>
      <template #address="{ item }">
        <div
          style="white-space: nowrap"
        >
          {{ item.address }}
        </div>
      </template>
    </DataTable>
    <OrderPrint
      ref="printableContent"
      :print-item="printItem"
    />
    <!-- <OrderPrint2 /> -->
  </div>
</template>

<script setup>
import AddOrder from '@/views/pages/order/AddOrder.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import usePageConfig from '@/config/pages/order'
import router from '@/router'
import OrderPrint from '@/views/pages/order/OrderPrint.vue'
import { scope } from '@/@core/utils/index'

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref({})
const orderRef = ref()
const apiLoading = ref(false)
const datatableRefs = ref()
const printItem = ref({})
const printableContent = ref()

const options = ref({ page: 1, itemPerPage: 20, tab: 'incomings' })
const searchOption = ref({})
const tableRecords = ref([])
const profileLoading = ref(false)
const selectedId = ref(null)

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const print = async item => {
  try {
    let res = await getOrderInfo(item.id)
    printItem.value = res
    await sleep(1)
    const printable = window.open('', '_blank')
    printable.document.write('<html><head><style>@page {size: A5}</style>')
    printable.document.write('</head><body>')
    printable.document.write(printableContent.value.$el.innerHTML)
    printable.document.write('</body></html>')
    printable.document.close()
    printable.print()
    await sleep(1)
    printable.close()
    
  } catch (error) {
    console.error('error', error)
  }
}

const getOrderInfo = async id => {
  try {
    // apiLoading.value = true

    const { data } = await axios.get('orders/' + id)

    // apiLoading.value = false

    return data
  } catch (error) {
    return null
  }
}

const createOrder = () => {
  orderRef.value.openDialog()
}

const viewProfile = async item => {
  profileLoading.value = true
  selectedId.value=item.id  

  await router.replace('view-order/' + item.id)
  profileLoading.value = false
}

const onTableChange = value => {
  options.value = value

  fetchRecord()
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.delete(`${type}/orders/${ids}`)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore/orders/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const printRecord = () => {
 
}
const fetchRecord = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('orders', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
  } catch (error) {
    console.error('datatable', error)
  }
  apiLoading.value = false
}

onMounted(() => {
  fetchRecord()
})
</script>

<!--
  <script>
  import AddOrder from '@/views/pages/order/AddOrder.vue'

  export default {
  components: {
  AddOrder,
  },
  }
  </script> 
-->

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
