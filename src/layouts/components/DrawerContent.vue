<script setup>
import upgradeBannerDark from '@/assets/images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@/assets/images/pro/upgrade-banner-light.png'
import logo from '@/assets/logo.svg?raw'
import menus from '@/config/menu/index'

import { VerticalNavLink, VerticalNavSectionTitle } from '@layouts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})
</script>

<template>
  <!-- 👉 Nav header -->
  <div class="nav-header ps-2 d-flex align-center">
    <RouterLink
      to="/"
      class="app-logo d-flex align-center gap-x-3 app-title-wrapper"
    >
      <!-- ℹ️ You can also use img tag or VImg here -->
      <div
        class="d-flex"
        v-html="logo"
      />

      <Transition name="vertical-nav-app-title">
        <h1
          class="font-weight-semibold leading-normal text-xl text-uppercase"
          style="color: #ddd942"
        >
          یوسف رسانی
        </h1>
      </Transition>
    </RouterLink>
  </div>

  <!-- 👉 Nav items -->
  <ul>
    <VerticalNavLink
      :item="{
        title: 'داشبورد',
        to: 'index',
        icon: { icon: 'mdi-home-outline' },
      }"
    />

    <VerticalNavLink
      :item="{
        title: 'تنظیمات حساب',
        to: 'account-settings',
        icon: { icon: 'mdi-account-cog-outline' },
      }"
    />

    <!-- 👉 Pages -->
    <template
      v-for="menu in menus"
      :key="menu"
    >
      <VerticalNavSectionTitle
        v-if="menu.heading"
        :item="menu"
      />
      <VerticalNavLink
        v-if="menu.title"
        :item="menu"
      />
    </template>

    <!--
      <VerticalNavLink :item="{
      title: 'Typography',
      to: 'typography',
      icon: { icon: 'mdi-alpha-t-box-outline' }
      }" />
      <VerticalNavLink :item="{
      title: 'Icons',
      to: 'icons',
      icon: { icon: 'mdi-eye-outline' }
      }" />
      <VerticalNavLink :item="{
      title: 'Cards',
      to: 'card-basic',
      icon: { icon: 'mdi-credit-card-outline' }
      }" />
      <VerticalNavLink :item="{
      title: 'Tables',
      to: 'tables',
      icon: { icon: 'mdi-table' }
      }" />
      <VerticalNavLink :item="{
      title: 'Form Layouts',
      to: 'form-layouts',
      icon: { icon: 'mdi-form-select' }
      }" /> 
    -->

    <!-- 👉 User Interface -->
  </ul>
</template>

<style lang="scss">
.v-navigation-drawer {
  height: 100%;

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;

    > ul {
      flex-grow: 1;
    }
  }
}

.upgrade-banner {
  margin-top: auto;
  // position: absolute;
  // bottom: 13px;
  // left: 50%;
  // transform: translateX(-50%);
}
</style>


