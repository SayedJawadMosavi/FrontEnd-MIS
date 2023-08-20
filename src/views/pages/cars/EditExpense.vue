<template>
  <VDialog
    v-model="showDialog"
    :class="`${'v-dialog-sm'}`"
    persistent
  >
    <VCard title="ویرایش مصرف ">
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
                label="توضیحات"
                append-inner-icon="mdi-note"
                :rules="validationRules($v2.name, 'توضیحات')"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="expense.price"
                :rules="validationRules($v2.price, 'مقدار مصرف')"
                prepend-inner-icon="mdi-cash"
                label="مقدار مصرف"
                dir="ltr"
                @input="convertToEnglishNumbers('expense.price')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>

            <!-- 👉 Create Key Button -->
            <VCol cols="12">
              <VBtn
                :loading="apiLoading2"
                @click="validateExpenseForm"
              >
                ذخیره
              </VBtn>
              <VBtn
                class="ms-2"
                color="secondary"
                variant="tonal"
                @click="closeDialog"
              >
                لغو
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { required, numeric, minLength, minValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'

import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
const props = defineProps({
  updateChanges: {
    type: Function,
    default: () => {},
  },
})

const validationRules = useRules.validate

const expense = ref({})
const payload = ref({})

const editType = ref(null)
const apiLoading2 = ref(false)
const apiLoading = ref(false)

const formRef = ref()
const expenseForm = ref()

const showDialog = ref(false)
const expenseRule = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  price: { required, minValue: minValue(1) },
}

const $v2 = useVuelidate(expenseRule, expense)

function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (model == 'expense.price') {
      expense.value.price = expense.value.price.replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    }
  }
}

const validateExpenseForm = async () => {
  expenseForm.value.validate()
  $v2.value.$touch()
  if ($v2.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  try {
    apiLoading2.value = true
    await axios.put(`car-expenses/id`, expense.value)
    await props.updateChanges()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading2.value = false
}

function openDialog(data) {
  showDialog.value = true
  expense.value = JSON.parse(JSON.stringify(data))
  
}

function closeDialog() {
  showDialog.value = false
}
defineExpose({
  openDialog,
})
</script>
