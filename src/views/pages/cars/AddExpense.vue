

<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        :title="payload.id ? 'ویرایش مصرف' : 'افزودن مصرف'"
        class="my-5"
      >
        <VForm>
          <VCardText>
            <p class="text-base font-weight-medium mb-3">نمبر موتر:#{{ payload.car_id }}</p>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <p class="mb-1">تاریخ</p>
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.created_at"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    :offset="-170"
                  />
                </span>
                <p
                  v-if="validationRules($v.created_at, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules($v.created_at, 'Date')[0] }}
                </p>
              </VCol>
            </VRow>
          </VCardText>

          <!-- extra expense -->

          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.name"
                  label="توضیحات"
                  append-inner-icon="mdi-note"
                  :rules="validationRules($v.name, 'توضیحات')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.price"
                  label="مقدار پول"
                  append-inner-icon="mdi-cash"
                  :rules="validationRules($v.price, 'مقدار پول')"
                  dir="ltr"
                  @input="convertToEnglishNumbers('price')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
          </VCardText>
          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              :loading="apiLoading"
              @click="submit"
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
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minLength, maxLength, email, helpers, minValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'

// ==================================== START PROPS =======================================

const props = defineProps({
  fetchRecord: { type: Function, default: () => {} },
})

const apiLoading = ref(false)
const expand = ref(false)

const payload = ref({
  created_at: new Date(),
  name: null,
  car_id: null,
  price: 0,
})

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const rules = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  car_id: { required },
  price: { required, numeric, minValue: minValue(0) },
}

const $v = useVuelidate(rules, payload)

// ==================================== START METHODS =======================================

const resetForm = () => {
  payload.value = {
    created_at: new Date(),
    name: null,
    car_id: null,
    price: 0,
  }
}

function openDialog(data) {

  payload.value.car_id = data[0]?.id
  expand.value = true
}

function closeDialog() {
  expand.value = false
  resetForm()
}
async function submit() {
  try {
    apiLoading.value = true
    await axios.post('car-expenses', payload.value)
    props.fetchRecord()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

function convertToEnglishNumbers(model) {
  var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  }
}

// ==================================== START Expose =======================================

defineExpose({
  openDialog,
})
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




