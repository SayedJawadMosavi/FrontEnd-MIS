<template>
  <VRow>
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />

    <EditDialog
      ref="editRef"
      :order-info="orderInfo"
      :update-changes="updateChanges"
    />

    <VCol cols="12">
      <VCard title="افزودن جنس">
        <VCardText class="">
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              نمبر گروپ
            </p>
            #{{ orderInfo.group_number }}
          </div>
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              نمبر موتر
            </p>
            #{{ orderInfo.car_id }}
          </div>
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              قیمت فی کیلو
            </p>
            $ {{ orderInfo.price_per_killo }}
          </div>
        </VCardText>
        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="formRef"
            class="mt-6"
          >
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model.trim="payload.created_at"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    teleport-center
                  />
                </span>
                <p
                  v-if="validationRules($v.created_at, 'Date').length > 0"
                  class="text-error mb-0"
                >
                  {{ validationRules($v.created_at, 'تاریخ')[0] }}
                </p>
              </VCol>
            </VRow>

            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.name"
                  label="اسم جنس"
                  prepend-inner-icon="mdi-shape"
                  :rules="validationRules($v.name, 'اسم جنس')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VCombobox
                  v-model="payload.type"
                  :rules="validationRules($v.type, 'نوع')"
                  label="نوع"
                  prepend-inner-icon="mdi-palette-swatch"
                  :items="itemTypes"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.count"
                  label="تعداد"
                  dir="ltr"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.count, 'تعداد')"
                  @input="convertToEnglishNumbers('count')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.weight"
                  prepend-inner-icon="mdi-weight"
                  :rules="validationRules($v.weight, 'وزن')"
                  label="وزن"
                  dir="ltr"
                  @input="convertToEnglishNumbers('weight')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <VRow />
          </VForm>
        </VCardText>

        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn @click="validateForm">
            ذخیره
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="resetForm"
          >
            کنسل
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="لیست اجناس"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #آی دی
              </th>
              <th scope="col">
                اسم جنس
              </th>
              <th scope="col">
                نوع
              </th>
              <th scope="col">
                تعداد
              </th>
              <th scope="col">
                وزن
              </th>
              <th scope="col">
                تاریخ ثبت
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
              v-for="(item, index) in orderInfo.items"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.weight }}</td>
              <td>{{ formateDate(item.created_at) }}</td>

              <td class="text-center">
                <div v-if="item.deleted_at">
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading && selectedItem.id == item.id"
                    @click="restoreRecord(item, 'items')"
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
                    :loading="apiLoading2 && selectedItem == item"
                    @click="forceDelete(item, 'items')"
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
                    @click="editForm(item, 'item')"
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
                    :loading="apiLoading2 && selectedItem == item"
                    @click="deleteRecord(item, 'items')"
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

    <VCol cols="12">
      <!-- SECTION: create extra expense -->
      <VCard title="افزودن مصرف اضافی">
        <VRow>
          <!-- 👉 Choose API Key -->
          <VCol
            cols="12"
            md="6"
            order-md="0"
            order="1"
          >
            <VCardText>
              <VForm ref="expenseForm">
                <VRow>
                  <VCol cols="12">
                    <span style="direction: ltr">
                      <VueDatePicker
                        v-model.trim="expense.created_at"
                        clearable
                        auto-apply
                        dark
                        close-on-auto-apply
                        formate="MM/dd/yyyy"
                        :offset="-120"
                        menu-class-name="dp-custom-menu"
                      />
                    </span>
                    <p
                      v-if="validationRules($v2.created_at, 'Date').length > 0"
                      class="text-error mb-0"
                    >
                      {{ validationRules($v2.created_at, 'تاریخ')[0] }}
                    </p>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      v-model="expense.name"
                      label="اسم جنس"
                      prepend-inner-icon="mdi-shape"
                      :rules="validationRules($v2.name, 'اسم جنس')"
                    />
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="expense.price"
                      :rules="validationRules($v2.price, 'قیمت')"
                      prepend-inner-icon="mdi-cash"
                      label="قیمت"
                      dir="ltr"
                      @input="convertToEnglishNumbers('expense.price')"
                      @keypress="useRules.preventNonNumeric"
                    />
                  </VCol>

                  <!-- 👉 Create Key Button -->
                  <VCol cols="12">
                    <VBtn
                      block
                      :loading="apiLoading2 && selectedItem == {}"
                      @click="validateExpenseForm"
                    >
                      ذخیره
                    </VBtn>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <!-- !SECTION -->
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="لیست مصارف اضافی"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #آی دی
              </th>
              <th scope="col">
                اسم جنس
              </th>
              <th scope="col">
                قیمت
              </th>
              <th scope="col">
                تاریخ
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
              v-for="(item, index) in orderInfo.extra_expense"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
              <td>{{ formateDate(item.created_at) }}</td>

              <td class="text-center">
                <div v-if="item.deleted_at">
                  <VBtn
                    v-if="scope(['order_restore'])"
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading && selectedItem.id == item.id"
                    @click="restoreRecord(item, 'expenses')"
                  >
                    <VIcon
                      start
                      icon="mdi-restore"
                      color="info"
                    />
                    بازیابی
                  </VBtn>

                  <VBtn
                    v-if="scope(['order_force_delete'])"
                    class="ms-2"
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem.id == item.id"
                    @click="forceDelete(item, 'expenses')"
                  >
                    <VIcon
                      icon="mdi-trash"
                      color="error"
                    />
                  </VBtn>
                </div>

                <div v-else>
                  <VBtn
                    v-if="scope(['order_create'])"
                    variant="text"
                    icon
                    size="small"
                    @click="editForm(item, 'expense')"
                  >
                    <VIcon
                      icon="mdi-pencil"
                      color="primary"
                    />
                  </VBtn>

                  <VBtn
                    v-if="scope(['order_force_delete'])"
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem.id == item.id"
                    @click="deleteRecord(item, 'expenses')"
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
</template>

<script setup>
import { required, numeric, minLength, minValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import { formateDate , scope } from '@/@core/utils/index'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import EditDialog from './EditDialog.vue'

const props = defineProps({
  orderInfo: {
    type: Object,
    default: () => {},
  },

  updateChanges: {
    type: Function,
    default: () => {},
  },
})

const route = useRoute()

const order_id = ref(route.params.order_id)

const formRef = ref()
const expenseForm = ref()

const apiLoading = ref(false)
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const confirmRef = ref()
const editRef = ref()

const selectedItem = ref({})
const selectedType = ref(null)
const showDialog = ref(false)

const payload = ref({
  created_at: new Date(),
  name: null,
  type: null,
  count: 1,
  weight: null,
  order_id: order_id.value,
  car_id: props.orderInfo.car_id,
})

const expense = ref({
  created_at: new Date(),
  name: null,
  price: null,
  order_id: order_id.value,
  car_id: props.orderInfo.car_id,
})

let itemTypes = ['کارتن', 'کریت', 'بوجی']

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const rules = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  type: { required },
  count: { required, minValue: minValue(1) },
  weight: { required },
}

// const rules = {
//   created_at: {},
//   name: {},
//   type: {},
//   count: {},
//   weight: {},
// }

const expenseRule = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  price: { required, minValue: minValue(0) },
}

const $v = new useVuelidate(rules, payload)
const $v2 = new useVuelidate(expenseRule, expense)
const resetForm = (type = 'items') => {
  if (type == 'items') {
    payload.value = {
      created_at: new Date(),
      name: null,
      type: null,
      count: 1,
      weight: null,
      order_id: order_id.value,
      car_id: props.orderInfo.car_id,
    }

    $v.value.$reset()
    formRef.value.resetValidation()
  } else {
    expense.value = {
      created_at: new Date(),
      name: null,
      price: null,
      order_id: order_id.value,
      car_id: props.orderInfo.car_id,
    }
    $v2.value.$reset()
    expenseForm.value.resetValidation()
  }
}

const validateForm = async () => {
  formRef.value.validate()
  $v.value.$touch()

  // if ($v.value.$invalid) {
  //   toast.error('لطفا فورم را دقیق خانه پری کنید!')

  //   return false
  // }
  submit()
}
const validateExpenseForm = async () => {
  expenseForm.value.validate()
  $v2.value.$touch()

  // if ($v2.value.$invalid) {
  //   toast.error('لطفا فورم را دقیق خانه پری کنید!')

  //   return false
  // }
  submitExpense()
}

async function submit() {
  try {
    apiLoading.value = true

    const { data } = await axios.post(`order-item`, payload.value)
    await props.updateChanges()

    resetForm('items')
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

async function submitExpense() {
  try {
    apiLoading2.value = true

    await axios.post(`order-expense`, expense.value)
    await props.updateChanges()
    resetForm('extra_expense')
  } catch (error) {
    console.error('error', error)
  }
  apiLoading2.value = false
}

function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (model == 'expense.price') {
      expense.value.price = expense.value.price.replace(persianNumbers[i], i).replace(englishNumbers[i], i)

      return
    }
    if (item == null) {
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}

const restoreRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  confirmRef.value.showDialog('restore')
}

const editForm = async (item, type = 'epense') => {
  editRef.value.openDialog(item, type)
}

const deleteRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type

  confirmRef.value.showDialog('delete')
}

const forceDelete = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type

  confirmRef.value.showDialog('forceDelete')
}

const onConfirm = async event => {
  if (event == 'delete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`delete/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }

  if (event == 'forceDelete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`force-delete/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  if (event == 'restore') {
    try {
      restoreLoading.value = true
      const { data } = await axios.post(`restore/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  restoreLoading.value = false
  apiLoading2.value = false
  selectedItem.value = {}
}
</script>



<style>
.dp__input{
padding: 12px 4px 12px 40px !important;
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
