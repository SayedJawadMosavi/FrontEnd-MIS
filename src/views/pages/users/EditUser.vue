<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="ویرایش کاربر"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.name"
                  label="نام کاربر"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.name, 'نام کاربر')"
                  :autocomplete="false"
                />
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.email"
                  :autocomplete="false"
                  label="ایمل"
                  append-inner-icon="mdi-email"
                  :rules="validationRules($v.email, 'ایمل')"
                  dir="ltr"
                />
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="payload.role"
                  :items="roles"
                  label="نقش"
                  append-inner-icon="mdi-shield-sun-outline"
                  class="search-by"
                  item-title="name"
                  item-value="id"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <p class="text-base font-weight-medium mt-2">
                  صلاحیت ها:
                </p>
                <p class="font-weight-medium">
                  تعیین کنید که کاربر کدام صلاحیت ها ر داشته باشد.
                </p>

                <VTable class="text-no-wrap">
                  <thead>
                    <tr>
                      <th scope="col">
                        دسترسی به سیستم
                      </th>
                      <th scope="col">
                        دیدن معلومات
                      </th>
                      <th scope="col">
                        ایجاد و ویرایش معلومات
                      </th>
                      <th scope="col">
                        حذف معلومات
                      </th>
                      <th scope="col">
                        بازیابی معلومات
                      </th>
                      <th scope="col">
                        حذف دائمی
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(per, index) in systems"
                      :key="index"
                    >
                      <tr v-if="per.allowed_roles.includes(payload.role)">
                        <td>
                          {{ per.system_name }}
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[0]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[1]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[2]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[3]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[4]"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </VTable>
              </VCol>
            </VRow>
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
import { axios } from '@/plugins/axios-plugin'
import { computed, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  numeric,
  minLength,
  maxLength,
  minValue,
  maxValue,
  email,
  helpers,
  sameAs,
} from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { toast } from 'vue3-toastify'

// ==================================== START PROPS =======================================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

const emit = defineEmits(['closeForm'])

// ==================================== START DATA =======================================

const apiLoading = ref(false)
const roles = [
  { id: 'admin', name: 'ادمین' },
  { id: 'finance_manager', name: 'مدیر مالی' },
  { id: 'bank_manager', name: 'مدیر صرافی' },
]

const payload = ref({
  id: null,
  name: null,
  email: null,
  role: null,
  permissions: [],
})
const expand = ref(false)
const formRef = ref()
const systems = [
  {
    system_id: 'users',
    system_name: 'کاربران',
    actions: ['user_view', 'user_create', 'user_delete', 'user_restore', "user_force_delete"],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'employees',
    system_name: 'کارمندان',
    actions: ['employee_view', 'employee_create', 'employee_delete', 'employee_restore',"employee_force_delete"],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'salaries',
    system_name: 'معاشات',
    actions: ['salary_view', 'salary_create', 'salary_delete', 'salary_restore',"salary_force_delete"],
    allowed_roles: ['admin', 'finance_manager'],
  },
  {
    system_id: 'exchanges',
    system_name: 'حواله',
    actions: ['exchange_view', 'exchange_create', 'exchange_delete', 'exchange_restore','exchange_force_delete'],
    allowed_roles: ['admin', 'finance_manager', 'bank_manager'],
  },
  {
    system_id: 'orders',
    system_name: 'سفارشات',
    actions: ['order_view', 'order_create', 'order_delete', 'order_restore', 'order_force_delete'],
    allowed_roles: ['admin', 'finance_manager'],
  },
  {
    system_id: 'cars',
    system_name: 'موتر ها',
    actions: ['car_view', 'car_create', 'car_delete', 'car_restore', "car_force_delete"],
    allowed_roles: ['admin', 'finance_manager'],
  },
  {
    system_id: 'incomes',
    system_name: 'رفت و آمد',
    actions: ['income_view', 'income_create', 'income_delete', 'income_restore',"income_force_delete"],
    allowed_roles: ['admin', 'finance_manager'],
  },
]

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const samePassword = computed(() => {
  return payload.value.password
})

const rules = {
  id: { required },
  name: { required, minLength: minLength(3) },
  email: { required, email },
  role: { required },
  permissions: { required },
}

const $v = useVuelidate(rules, payload)

// ==================================== START METHODS =======================================

const downloadForm = () => {
 
}
const resetForm = () => {
  payload.value = {
    id: null,
    name: null,
    password: null,
    email: null,
    confirm_password: null,
    role: null,
    permissions: [],
  }
  $v.value.$reset()
  formRef.value.resetValidation()
}

function openDialog(item) {
  payload.value.id = structuredClone(item.id)
  payload.value.name = structuredClone(item.name)
  payload.value.email = structuredClone(item.email)
  payload.value.role = structuredClone(item.role)
  payload.value.permissions = JSON.parse(JSON.stringify(item.permissions))
  expand.value = true
}

function closeDialog() {
  expand.value = false
  resetForm()
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.put('edit-users', payload.value)
    closeDialog()
    props.fetchRecord()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

const validateForm = async () => {
  formRef.value.validate()
  if ($v.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

watch(payload.value.role, async () => {
  payload.value.permissions = []
})

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
