<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="ویرایش کارمند"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <p class="text-base font-weight-medium mt-2">جزئیات حواله</p>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.sender_name"
                  label="اسم فرستنده"
                  :rules="validationRules(v$.sender_name, 'اسم فرستنده')"
                  prepend-inner-icon="mdi-account"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.amount"
                  label="مبلغ پول"
                  prepend-inner-icon="mdi-money"
                  :rules="validationRules(v$.amount, ' مبلغ پول')"
                  @input="convertToEnglishNumbers('amount')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <!--
                  <VTextField
                  v-model.trim="formData.currency"
                  label="واحد"
                  prepend-inner-icon="mdi-money"
                  :rules="validationRules(v$.currency, 'واحد پول ')"
                  /> 
                -->
                <VAutocomplete
                  v-model="formData.currency"
                  :items="['دالر', 'یورو', 'افغانی']"
                  item-text="text"
                  label="واحد پولی"
                  prepend-inner-icon="mdi-money"
                  :rules="validationRules(v$.currency, 'واحد پول ')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.province"
                  label="ولایت"
                  prepend-inner-icon="mdi-home"
                  :rules="validationRules(v$.province, 'ولایت ')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.receiver_name"
                  label="اسم گیرنده"
                  :rules="validationRules(v$.receiver_name, 'اسم گیرنده')"
                  prepend-inner-icon="mdi-account"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.receiver_father_name"
                  label="اسم پدر گیرنده"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules(v$.receiver_father_name, 'اسم پدر گیرنده')"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.receiver_id_no"
                  label="شماره تذکره گیرنده"
                  prepend-inner-icon="mdi-key"
                  :rules="validationRules(v$.receiver_id_no, 'شماره تذکره گیرنده')"
                  @input="convertToEnglishNumbers('receiver_id_no')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="formData.phone_number"
                  label="شماره تلفن"
                  prepend-inner-icon="mdi-home"
                  :rules="validationRules(v$.phone_number, 'شماره تلفن گیرنده ')"
                  @input="convertToEnglishNumbers('phone_number')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <label>تاریخ</label>

                <span style="direction: ltr">
                  <VueDatePicker
                    v-model.trim="formData.date"
                    clearable
                    auto-apply
                    dark
                    formate="MM/dd/yyyy"
                    close-on-auto-apply
                    :offset="-100"
                  />
                </span>

                <p
                  v-if="validationRules(v$.date, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.date, 'تاریخ')[0] }}
                </p>
              </VCol>
            </VRow>
            <VRow />
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              :loading="apiLoading"
              @click="validateForm"
            >
              ویرایش
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
import { computed, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minLength } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { toast } from 'vue3-toastify'


// =====================> start methods <==================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

const emit = defineEmits(['closeForm'])

// ==================================== START states =======================================
const expand = ref(false)
const apiLoading = ref(false)
const formRef = ref()
const currencies = ref([])


const formData = ref({
  id: null,
  sender_name: '',
  amount: '',
  province: '',
  phone_number: '',
  currency: '',
  receiver_name: '',
  receiver_father_name: '',
  receiver_id_no: '',
  date: new Date(),
})

const resetForm = () => {
  formData.value = {
    sender_name: null,
    amount: null,
    province: null,
    phone_number: null,
    currency: null,
    receiver_name: null,
    receiver_father_name: null,
    receiver_id_no: null,
    date: new Date(),
  }
  v$.value.$reset()
  formRef.value.resetValidation()
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.put('edit-exchanges', formData.value)
    closeDialog()
    props.fetchRecord()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}
const closeDialog = () => {
  expand.value = false
  resetForm()
}

function openDialog(item) {
  formData.value.id = structuredClone(item.id)
  formData.value.sender_name = structuredClone(item.sender_name)
  var amou = structuredClone(item.amount)
  amou = parseInt(amou)
  formData.value.amount = amou.toFixed(2)
  formData.value.currency = structuredClone(item.currency)
  formData.value.province = structuredClone(item.province)
  formData.value.receiver_name = structuredClone(item.receiver_name)
  formData.value.receiver_father_name = structuredClone(item.receiver_father_name)
  formData.value.phone_number = structuredClone(item.phone_number)
  formData.value.receiver_id_no = structuredClone(item.receiver_id_no)
  formData.value.date = structuredClone(item.date)
  expand.value = true
}

const validateForm = async () => {
  formRef.value.validate()
  if (v$.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

function convertToEnglishNumbers(model, item = null, index = null) {
  var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (item == null) {
      formData.value[model] = formData.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      formData.value[model][index][item] = formData.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}

const validationRules = useRules.validate

const rules = {
  id: { required },
  sender_name: { required, minLength: minLength(3) },
  amount: { required, numeric },
  province: { required, minLength: minLength(3) },
  phone_number: {},
  currency: { required },
  receiver_name: { required, minLength: minLength(3) },
  receiver_father_name: { required, minLength: minLength(3) },
  receiver_id_no: { required, numeric },
  date: { required },
}
const v$ = useVuelidate(rules, formData)

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
  