<template>
  <VRow>
    <VCol cols="12">
      <VCard title="جزئیات سفارش">
        <VCardText class="">
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              نمبر گروپ
            </p>
            #{{ payload.group_number }}
          </div>
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              نمبر موتر
            </p>
            #{{ payload.car_id }}
          </div>
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              تاریخ ثبت
            </p>
            {{ formateDate(payload.created_at) }}
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
                <VTextField
                  v-model.trim="payload.car_id"
                  :rules="validationRules(v$.car_id, 'نمبر موتر')"
                  label="نمبر موتر"
                  prepend-inner-icon="mdi-truck-fast"
                  @keypress="useRules.preventNonNumeric"
                  @input="convertToEnglishNumbers('car_id')"
                />
              </VCol>
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
                  />
                </span>
                <p
                  v-if="validationRules(v$.created_at, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.created_at, 'تاریخ')[0] }}
                </p>
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.customer_name"
                  label="اسم مشتری"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules(v$.customer_name, ' اسم مشتری')"
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
                  :rules="validationRules(v$.father_name, ' اسم پدر')"
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
                  :rules="validationRules(v$.grand_father_name, ' اسم پدر کلان')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.tazkira_id"
                  label="نمبر تذکره"
                  prepend-inner-icon="mdi-numeric"
                  dir="ltr"
                  :rules="validationRules(v$.tazkira_id, 'نمبر تذکره')"
                  @input="convertToEnglishNumbers('tazkira_id')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.customer_phone"
                  label="شماره تلفن مشتری"
                  prepend-inner-icon="mdi-phone"
                  :rules="validationRules(v$.customer_phone, 'شماره تلفن')"
                  @keypress="useRules.preventNonNumeric"
                  @input="convertToEnglishNumbers('customer_phone')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.price_per_killo"
                  prepend-inner-icon="mdi-cash"
                  label="قیمت فی کیلو"
                  :rules="validationRules(v$.price_per_killo, 'قیمت فی کیلو')"
                  @keypress="useRules.preventNonNumeric"
                  @input="convertToEnglishNumbers('price_per_killo')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.receiver_name"
                  :rules="validationRules(v$.receiver_name, 'اسم گیرنده')"
                  label="اسم گیرنده"
                  prepend-inner-icon="mdi-account"
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
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.receiver_phone"
                  :rules="validationRules(v$.receiver_phone, 'شماره تلفن گیرنده')"
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
                  v-model.trim="payload.country"
                  :rules="validationRules(v$.country, 'کشور')"
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
                  :rules="validationRules(v$.city, 'شهر')"
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
                  :rules="validationRules(v$.address, 'آدرس')"
                  label="ادرس"
                  prepend-inner-icon="mdi-location"
                />
              </VCol>
            </VRow>
            <VRow />
          </VForm>
        </VCardText>

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
            @click="resetForm"
          >
            بازنشانی
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { required, numeric, minLength } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
import { formateDate } from '@/@core/utils/index'

const props = defineProps({
  orderInfo: {
    type: Object,
    default: () => {},
  },
  resetData: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const formRef = ref()
const apiLoading = ref(false)

const payload = toRef(props, 'orderInfo')

const resetForm = () => {

  const {
    receiver_phone,
    car_id,
    customer_name,
    receiver_name,
    created_at,
    customer_phone,
    country,
    city,
    address,
    price_per_killo,
  } = props.resetData
  payload.value.car_id = car_id
  payload.value.customer_name = customer_name
  payload.value.created_at = created_at
  payload.value.customer_phone = customer_phone
  payload.value.country = country
  payload.value.city = city
  payload.value.address = address
  payload.value.receiver_phone = receiver_phone ?? ''
  payload.value.receiver_name = receiver_name
  payload.value.price_per_killo = price_per_killo

  v$.value.$reset()
}

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const rules = {
  created_at: { required },
  price_per_killo: { required, numeric, minLength: minLength(1) },

  customer_name: { required, minLength: minLength(3) },
  car_id: { required, numeric },
  customer_phone: { required, numeric, minLength: minLength(10) },
  receiver_name: { required, minLength: minLength(3) },
  receiver_phone: { required, numeric, minLength: minLength(10) },
  country: { required },
  city: { required },
  address: { required },
  father_name: { required, minLength: minLength(3) },
  grand_father_name: { required, minLength: minLength(3) },
  tazkira_id: { required, numeric },

  delivary_type: { required },
}

const v$ = useVuelidate(rules, payload)

const validateForm = async () => {
  formRef.value.validate()
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

    const data = JSON.parse(JSON.stringify(payload.value))
    delete data.items
    delete data.created_by
    delete data.updated_at
    delete data.deleted_at
    delete data.payments
    delete data.extra_expense
    await axios.put(`orders/${payload.value.id}`, data)
    await props.updateChanges()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
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
