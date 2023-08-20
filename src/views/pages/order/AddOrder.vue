<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="ثبت سفارش"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <p class="text-base font-weight-medium mt-2 mb-0">
              نمبر گروپ: {{ payload.group_number }}
            </p>
            <p class="text-base font-weight-medium mt-2 mb-0">
              نمبر موتر: {{ payload.car_id }}
            </p>
            <p class="text-base font-weight-medium mt-2">
              معلومات سفارش:
            </p>

            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.date"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                  />
                </span>
                <p
                  v-if="validationRules($v.date, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules($v.date, 'Date')[0] }}
                </p>
              </VCol>


              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.group_number"
                  readonly
                  label="نمبر گروپ"
                  prepend-inner-icon="mdi-tag-arrow-up-outline"
                  :rules="validationRules($v.group_number, 'نمبر گروپ')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.customer_name"
                  label="اسم مشتری"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.customer_name, 'اسم مشتری')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.father_name"
                  label="اسم پدر"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.father_name, ' اسم پدر')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.grand_father_name"
                  label="اسم پدر کلان"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.grand_father_name, ' اسم پدر کلان')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.tazkira_id"
                  label="نمبر تذکره"
                  dir="ltr"
                  :rules="validationRules($v.tazkira_id, 'نمبر تذکره')"
                  @input="convertToEnglishNumbers('tazkira_id')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.customer_phone"
                  label="شماره تلفن مشتری"
                  dir="ltr"
                  prepend-inner-icon="mdi-phone"
                  :rules="validationRules($v.customer_phone, 'شماره تلفن مشتری')"
                  @input="convertToEnglishNumbers('customer_phone')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.price_per_killo"
                  :rules="validationRules($v.price_per_killo, 'قیمت فی کیلو')"
                  prepend-inner-icon="mdi-cash"
                  label="قیمت فی کیلو"
                  dir="ltr"
                  @input="convertToEnglishNumbers('price_per_killo')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="payload.description"
                  label="توضیحات بیشتر"
                  prepend-inner-icon="mdi-info"
                />
              </VCol>
            </VRow>

            <VRow />
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات جنس:
            </p>

            <VRow
              v-for="(item, index) in payload.items"
              :key="index"
            >
              <VCol
                class="pb-0 pt-5"
                cols="12"
              >
                <div class="d-flex align-center">
                  <p class="mb-0 font-weight-medium pe-2">
                    شماره #{{ index + 1 }}
                  </p>
                  <VBtn
                    density="compact"
                    color="error"
                    size="small"
                    icon="mdi-minus"
                    :disabled="payload.items.length == 1"
                    @click="removeItem(index, 'items')"
                  />
                </div>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="item.name"
                  label="اسم جنس"
                  prepend-inner-icon="mdi-shape"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].name, 'اسم جنس')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VCombobox
                  v-model="item.type"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].type, 'نوع')"
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
                  v-model="item.count"
                  label="تعداد"
                  prepend-inner-icon="mdi-counter"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].count, 'تعداد')"
                  dir="ltr"
                  @input="convertToEnglishNumbers('items', 'count', index)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="item.weight"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].weight, 'وزن')"
                  prepend-inner-icon="mdi-weight"
                  label="وزن"
                  dir="ltr"
                  @input="convertToEnglishNumbers('items', 'weight', index)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>

            <!-- {{ validationRules($v.items.$each.$response.$errors[0].name, 'قیمت فی کیلو') }} -->

            <div class="py-3">
              <VBtn
                size="small"
                @click="addMore('items')"
              >
                جدید<VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
          </VCardText>

          <!-- extra expense -->

          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              مصارف اضافی:
            </p>

            <VRow
              v-for="(expense, index2) in $v.extra_expense.$model"
              :key="index2"
            >
              <VCol
                cols="12"
                class="pb-0 pt-5"
              >
                <div class="d-flex align-center">
                  <p class="mb-0 font-weight-medium pe-2">
                    مصارف #{{ index2 + 1 }}
                  </p>
                  <VBtn
                    size="small"
                    density="compact"
                    color="error"
                    icon="mdi-minus"
                    @click="removeItem(index, 'extra_expense')"
                  />
                </div>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="expense.name"
                  :rules="validateCollection($v.extra_expense.$each.$response.$errors[index2]?.name, 'اسم جنس')"
                  label="اسم جنس"
                  prepend-inner-icon="mdi-shape"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="expense.price"
                  dir="ltr"
                  prepend-inner-icon="mdi-cash"
                  :rules="validateCollection($v.extra_expense.$each.$response.$errors[index2]?.price, 'قیمت')"
                  label="قیمت"
                  @input="convertToEnglishNumbers('extra_expense', 'price', index2)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <div class="py-3">
              <VBtn
                size="small"
                @click="addMore('extra_expense')"
              >
                جدید<VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
          </VCardText>

          <!-- reciever information -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات شخص گیرنده:
            </p>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.receiver_name"
                  :rules="validationRules($v.receiver_name, 'اسم گیرنده')"
                  label="اسم گیرنده"
                  prepend-inner-icon="mdi-account"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.receiver_phone"
                  :rules="validationRules($v.receiver_phone, 'شماره تلفن گیرنده')"
                  label="شماره تلفن گیرنده"
                  prepend-inner-icon="mdi-phone"
                  @keypress="useRules.preventNonNumeric"
                  @input="convertToEnglishNumbers('receiver_phone')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.delivary_type"
                  :rules="validateCollection($v.delivary_type, 'نوع تحویل دهی')"
                  label="نوع تحویل دهی"
                  prepend-inner-icon="mdi-shape"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.country"
                  :rules="validationRules($v.country, 'کشور')"
                  label="کشور"
                  prepend-inner-icon="mdi-earth"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.city"
                  :rules="validationRules($v.city, 'شهر')"
                  label="شهر"
                  prepend-inner-icon="mdi-city"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.address"
                  :rules="validationRules($v.address, 'آدرس')"
                  label="ادرس"
                  prepend-inner-icon="mdi-location"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات مالی:
            </p>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  prepend-inner-icon="mdi-cash-multiple"
                  readonly
                  :model-value="finalTotal"
                  label="ًمجموع کل"
                  dir="ltr"
                />
              </VCol>
            </VRow>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.paid_amount"
                  dir="ltr"
                  :rules="validationRules($v.paid_amount, 'مقدار پرداختی')"
                  s
                  prepend-inner-icon="mdi-cash-check"
                  label="مقدار پرداختی"
                  @input="convertToEnglishNumbers('paid_amount')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  dir="ltr"
                  prepend-inner-icon="mdi-cash-minus"
                  :model-value="remainder"
                  readonly
                  label="باقیمانده پول"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              :loading="apiLoading"
              @click="validateForm"
            >
              ذخیره
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="closeDialog"
            >
              بستن فورم
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </div>
  </VExpandTransition>
</template>

<script setup>
import { axios } from '@/plugins/axios-plugin'
import { computed, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minLength, maxLength, minValue, maxValue, email, helpers } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { toast } from 'vue3-toastify'

// ==================================== START PROPS =======================================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

// ==================================== START Computed =======================================

const itemTotalValue = computed(() => {
  const items = payload.value.items
  let total = 0
  items.forEach(row => {
    total += parseFloat(row.weight ?? 0)
  })

  return total * payload.value.price_per_killo
})

const expenseTotalValue = computed(() => {
  const items = payload.value.extra_expense
  let total = 0
  items.forEach(row => {
    total += parseFloat(row.price ?? 0)
  })

  return total
})


const finalTotal = computed(() => {
  try {
    const val = parseFloat(expenseTotalValue.value) + parseFloat(itemTotalValue.value)

    return val?.toFixed(2)
  } catch (error) {
    console.error(error)

    return 0
  }
})

const remainder = computed(() => {
  return finalTotal.value - payload.value.paid_amount
})

// ==================================== START DATA =======================================

let itemTypes = ['کارتن', 'کریت', 'بوجی']

const apiLoading = ref(false)
const isSubmited = ref(false)
const payload = ref({
  date: new Date(),
  group_number: null,
  customer_name: null,
  father_name: null,
  grand_father_name: null,
  tazkira_id: null,
  delivary_type: null,
  description: null,
  price_per_killo: null,
  car_id: null,

  customer_phone: null,
  receiver_name: null,
  receiver_phone: null,
  country: null,
  city: null,
  address: null,
  paid_amount: 0,
  items: [
    {
      name: null,
      count: 1,
      type: null,
      weight: null,
    },
  ],
  extra_expense: [],
})
const expand = ref(false)
const formRef = ref()

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const validateCollection = useRules.validateCollection

const rules = {
  date: { required },
  price_per_killo: { required, minValue: minValue(1) },
  group_number: { required, minValue: minValue(1) },

  customer_name: { required, minLength: minLength(3) },
  father_name: { required, minLength: minLength(3) },
  grand_father_name: { required, minLength: minLength(3) },
  tazkira_id: { required, numeric },

  delivary_type: { required },
  car_id: { required },
  customer_phone: { required, minLength: minLength(10) },
  receiver_name: { required, minLength: minLength(3) },
  receiver_phone: { required, minLength: minLength(10) },
  country: { required },
  city: { required },
  paid_amount: { required, minValue: minValue(0), maxValue: maxValue(finalTotal) },

  address: { required },
  items: {
    $each: helpers.forEach({
      name: { required, minLength: minLength(3) },
      count: { required, numeric, minValue: minValue(1) },
      type: { required },
      weight: { required, numeric, minValue: minValue(1) },
    }),
  },
  extra_expense: {
    $each: helpers.forEach({
      name: { required, minLength: minLength(3) },
      price: { required, numeric, minLength: minLength(1) },
    }),
  },
}

const $v = useVuelidate(rules, payload)

// ==================================== START METHODS =======================================

const downloadForm = () => {
  
}
const resetForm = () => {
  payload.value = {
    date: new Date(),
    group_number: null,
    father_name: null,
    grand_father_name: null,
    tazkira_id: null,
    delivary_type: null,
    description: null,
    car_id: null,
    customer_name: null,
    price_per_killo: null,
    customer_phone: null,
    receiver_name: null,
    receiver_phone: null,
    country: null,
    city: null,
    address: null,
    paid_amount: 0,
    father_name: null,
    grand_father_name: null,
    tazkira_id: null,
    description: null,
    items: [
      {
        name: null,
        count: 1,
        type: null,
        weight: null,
      },
    ],
    extra_expense: [],
  }
  $v.value.$reset()
  formRef.value.resetValidation()
}

function openDialog() {
  expand.value = true
  getCarNumber()
}

function closeDialog() {
  isSubmited.value = false
  expand.value = false
  resetForm()
}

function convertToEnglishNumbers(model, item = null, index = null) {
  var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (item == null) {
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.post('orders', payload.value)
    isSubmited.value = true
    resetForm()
    props.fetchRecord()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

async function getCarNumber() {
  try {
    const { data } = await axios.get('current-car')
    payload.value.car_id = data.car_id
    payload.value.order_id = data.order_id
    payload.value.group_number = data.group_number

  } catch (error) {
    console.error('error', error)
  }
}

const addMore = type => {
  const items = payload.value[type]

  if (type == 'items') {
    items.push({
      name: null,
      count: 1,
      type: null,
      weight: 0,
    })
  } else if (type == 'extra_expense') {
    items.push({
      name: null,
      price: 0,
    })
  }
}
const removeItem = (index, type) => {
  const items = payload.value[type]
  items.splice(index, 1)
}

const validateForm = async () => {
  formRef.value.validate()

  if ($v.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

// ==================================== START Expose =======================================

defineExpose({
  openDialog,
})
</script>

<style>
.dp__input {
  padding: 12px 4px 12px 40px !important;
}

.dp__theme_dark,
.dp__theme_light {
  --dp-background-color: rgb(var(--v-theme-surface));
  --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  --dp-hover-text-color: gba(var(--v-theme-on-surface), 1);
  --dp-hover-icon-color: var(--v-theme-on-surface);
  --dp-primary-color: #40A579;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #8A8D93;
  --dp-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-border-color-hover: rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) --dp-border-radius:10px !important;
  --dp-disabled-color: var(--v-disabled-opacity);
  --dp-scroll-bar-background: var(--v-theme-on-surface);
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
