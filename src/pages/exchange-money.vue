<template>
  <div>
    <ReportDialog ref="reportRefs" />
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست حواله"
      create-text="اضافه نمودن حواله"
      edit-text="ویرایش حواله"
      icon="
        mdi-shopping-outline"
      :show-create="scope(['exchange_create'])"
      :show-delete="scope(['exchange_delete'])"
      :show-restore="scope(['exchange_restore'])"
      :show-force-delete="scope(['exchange_force_delete'])"
      @on-restore="restoreRecord"
      @on-create="createExchange"
      @on-delete="deleteRecord"
      @on-force-delete="deleteRecord('force-delete')"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          class="font-weight-bold"
          @click="TakeReport"
        >
          تهیه راپور
          <VIcon
            end
            icon="mdi-printer"
          />
        </VBtn>
      </template>
    </BreadCrumbs>
    <AddExchangeMoney
      ref="exchangeRef"
      :fetch-record="fetchRecord"
    />
    <EditExchangeMoney
      ref="moneyEdit"
      :fetch-record="fetchRecord"
    />
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="tableRecords"
      @table-change="onTableChange($event)"
    >
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
    </DataTable>

    <ExchangePrint
      ref="printableContent"
      :print-item="printItem"
    />
  </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import ReportDialog from '@/components/commons/ReportDialog.vue'
import DataTable from '@/components/commons/DataTable.vue'
import usePageConfig from '@/config/pages/exchange-money'
import AddExchangeMoney from '@/views/pages/exchange_money/AddExchangeMoney.vue'

import EditExchangeMoney from '@/views/pages/exchange_money/EditExchangeMoney.vue'

import ExchangePrint from '@/views/pages/exchange_money/ExchangePrint.vue'
import { formateDate, scope } from '@/@core/utils/index'

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref(0)
const exchangeRef = ref()
const reportRefs = ref()
const apiLoading = ref(false)
const searchOption = ref({})
const datatableRefs = ref()
const options = ref({ itemsPerPage: 20, page: 1, tab: 'exchange-money' })
const tableRecords = ref([])
const moneyEdit = ref()

const printItem = ref({})
const printableContent = ref()

const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const createExchange = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    moneyEdit.value.openDialog(datatableRefs.value?.selectedItems[0])
  } else {
    exchangeRef.value.openDialog()
  }
}
const onTableChange = value => {
  options.value = value
  fetchRecord()
}

const TakeReport = () => {
  reportRefs.value.showPrintConfirm('exchange')
}

const fetchRecord = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('exchange-money', { params: options.value })
    tableRecords.value = data.data
    total.value = data.data.length
    extraTotal.value = data.extraTotal
  } catch (error) {}
  apiLoading.value = false
}

// delete data from datatable
const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('exchange-money/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-exchange-money/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {}
}

const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore_exchange-money/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const print = async item => {
  try {
    printItem.value = item
    await sleep(1)
    const printable = window.open('', '_blank')
    printable.document.write('<html><head><style>@page { size: A5 }</style>')
    printable.document.write('</head><body>')
    printable.document.write(printableContent.value.$el.innerHTML)
    printable.document.write('</body></html>')
    printable.document.close()
    printable.print()

    // await sleep(1)

    printable.close()
  } catch (error) {}
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
  
  
  