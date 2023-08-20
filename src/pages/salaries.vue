<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست معاشات"
      create-text="پرداخت معاش"
      edit-text="ویرایش پرداخت معاش"
      page-icon="mdi-cash"
      :show-create="scope(['salary_create']) || true"
      :show-update="scope(['salary_create'])"
      :show-delete="scope(['salary_delete'])"
      :show-restore="scope(['salary_restore'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="addSalary"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default />
    </BreadCrumbs>

    <AddSalary
      ref="salaryRefs"
      :fetch-record="fetchRecord"
    />

    <EditUser
      ref="userEditRefs"
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
      <template #position="{ item }">
        {{ item?.employee?.job_title }}
      </template>

      <template #salary="{ item }">
        <VChip
          small
          color="info"
          class="font-weight-medium"
        >
          {{ item?.salary }}
        </VChip>
      </template>

      <template #paid="{ item }">
        <VChip
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item?.paid }}
        </VChip>
      </template>

      <template #remainder="{ item }">
        <VChip
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item.salary - item?.paid }}
        </VChip>
      </template>
      <template #employee="{ item }">
        {{ item.employee?.first_name + ' ' + item.employee?.last_name }}
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import AddSalary from '@/views/pages/employee/AddSalary.vue'
import EditUser from '@/views/pages/users/EditUser.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import usePageConfig from '@/config/pages/salary'
import router from '@/router'
import { scope } from '@/@core/utils/index'

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref({})
const salaryRefs = ref()
const userEditRefs = ref()

const apiLoading = ref(false)
const datatableRefs = ref()

const options = ref({ page: 1, itemPerPage: 20, tab: 'incomings' })
const searchOption = ref({})
const tableRecords = ref([])

const addSalary = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    salaryRefs.value.openDialog(datatableRefs.value?.selectedItems[0])
  } else {
    salaryRefs.value.openDialog()
  }
}

const viewProfile = item => {
  router.replace('view-user/' + item.id)
}
const onTableChange = value => {
  options.value = value
  fetchRecord()
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('salary-payments/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-salary-payments/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore/salary-payments/' + ids)
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
const fetchRecord = async () => {
  try {
    datatableRefs.value.selectedItems = []
    apiLoading.value = true
    const { data } = await axios.get('salary-payments', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
  } catch (error) {
    console.error('datatable', error)
  }
  apiLoading.value = false
}

const getRole = item => {
  let color = ''
  let name = ''
  if (item.role == 'admin') {
    name = 'ادمین'
    color = 'primary'
  } else if (item.role == 'finance_manager') {
    name = 'مدیر مالی'
    color = 'info'
  } else {
    name = 'مدیر صرافی'
    color = 'warning'
  }

  return { name, color }
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
