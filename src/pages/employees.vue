<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست کارمندان"
      icon="mdi-people"
      create-text="اضافه کردن کارمند"
      :show-create="scope(['employee_create'])"
      :show-delete="scope(['employee_delete'])"
      :show-restore="scope(['employee_restore'])"
      :show-force-delete="scope(['employee_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createEmployee"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default />
    </BreadCrumbs>
    <InsertEmployee
      ref="employeeRef"
      :fetch-record="fetchRecord"
    />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="employees"
      @table-change="onTableChange($event)"
    >
      <template #salary="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.salary ?? 0 }} $
        </VChip>
      </template>
      <template #profile="{ item }">
        <VBtn
          variant="plain"
          class="font-weight-bold px-1"
          :loading="profileLoading && selectedId==item.id"

          @click="viewProfile(item)"
        >
          <VIcon
            size="30"
            start
            icon="mdi-eye-arrow-right"
          />
        </VBtn>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import InsertEmployee from '@/views/pages/employee/InsertEmployee.vue'
import usePageConfig from '@/config/pages/employee'
import router from '@/router'
import { scope } from '@/@core/utils/index'

const CaloriesTemplate = defineComponent({
  props: ['data'],
  template: `
    <div>
      {{ data }}
    </div>
  `,
})

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const apiLoading = ref(false)
const expand = ref(false)
const searchOption = ref({})

const total = ref(0)
const options = ref({ itemsPerPage: 20, page: 1, tab: 'employees' })
const employees = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const employeeRef = ref()
const profileLoading = ref(false)
const selectedId = ref(null)
const createEmployee = () => {
  employeeRef.value.toggleDialog()
}
const viewProfile = async item => {
  profileLoading.value = true
  selectedId.value=item.id  
  await router.replace('view-employee/' + item.id)
}
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}

const onTableChange = value => {
  options.value = value
  fetchRecord()
}

const fetchRecord = async () => {
  try {
    apiLoading.value = true
    datatableRefs.value.selectedItems = []
    const res = await axios.get('employees', { params: options.value })
    employees.value = res.data.data
    total.value = res.data.data.length
    extraTotal.value = res.data.extraTotal
  } catch (error) {
   
  }
  apiLoading.value = false
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('employees/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-employees/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    
  }
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-employees/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchRecord()
})
</script>

<route lang="yaml">
meta:
  auth: true
</route>


