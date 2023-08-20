

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
      min-height="500"
    >
      <VCardText class="pt-2 text-center">
        <div v-html="logo" />

        <h5
          class="text-h5 mb-1 px-4"
          style="color: #ddd942"
        >
          ورود به سیستم مدیریت کارگو یوسف رسانی
        </h5>
      </VCardText>

      <VCardText>
        <VForm>
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                dir="ltr"
                label="ایمل ادرس"
                type="email"
                @keydown.enter="submit"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                dir="ltr"
                label="پسورد"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                @keydown.enter="submit"
              />

              <VBtn
                class="mt-8"
                block
                :loading="loading"
                @click="submit"
              >
                ورود به سیستم
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!--
      <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
      />

      <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
      /> 
    -->

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>




<script setup>
import { useTheme } from 'vuetify'
import logo from '@/assets/logo.svg?raw'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV1MaskDark from '@/assets/images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@/assets/images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@/assets/images/pages/auth-v1-tree-2.png'
import authV1Tree from '@/assets/images/pages/auth-v1-tree.png'
import useAuth from '@/plugins/authServices'
const form = ref({
  email: '',
  password: '',
  remember: false,
})
const { login, isAuthenticated } = useAuth()
const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})
const isPasswordVisible = ref(false)
const loading = ref(false)
const submit = async () => {
  // login(email,password)
  loading.value = true
  await login(form.value.email, form.value.password)
  loading.value = false
}
</script>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';
</style>






<route lang="yaml">
meta:
  layout: blank
  auth: false
</route>
