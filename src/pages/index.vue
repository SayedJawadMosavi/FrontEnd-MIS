
<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsCurrentBalance
        v-if="scope(['income_view'])"
        v-model:account-money="accountMoney"
      />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <AnalyticsTransactions :transactions="transactions" />
    </VCol>

    <!--
      <VCol cols="12">
      <AnalyticsWeeklyOverview />
      </VCol> 
    -->

    <!--
      <VCol
      cols="12"
      md="4"
      >
      <AnalyticsTotalEarning />
      </VCol> 
    -->

    <!--
      <VCol
      cols="12"
      md="6"
      >
      <VRow class="match-height">
      <VCol
      cols="12"
      sm="6"
      >
      <AnalyticsTotalProfitLineCharts />
      </VCol>

      <VCol
      cols="12"
      sm="6"
      >
      <CardStatisticsVertical v-bind="totalProfit" />
      </VCol>

      <VCol
      cols="12"
      sm="6"
      >
      <CardStatisticsVertical v-bind="newProject" />
      </VCol>

      <VCol
      cols="12"
      sm="6"
      >
      <AnalyticsBarCharts />
      </VCol>
      </VRow>
      </VCol> 
    -->

    <VCol
      cols="12"
      md="12"
    >
      <AnalyticsSalaryPaments
        v-if="scope(['salary_view'])"
        v-model:data="salaries"
      />
    </VCol>

    <VCol
      cols="12"
      md="12"
    >
      <AnalyticsDepositWithdraw
        v-if="scope(['income_view'])"
        :data="incomes"
      />
    </VCol>

    <VCol cols="12">
      <AnalyticsOrders
        v-if="scope(['order_view'])"
        :data="orders"
      />
    </VCol>
  </VRow>
</template>

<script setup>
import AnalyticsCurrentBalance from '@/views/dashboards/analytics/AnalyticsCurrentBalance.vue'
import AnalyticsBarCharts from '@/views/dashboards/analytics/AnalyticsBarCharts.vue'
import AnalyticsOrders from '@/views/dashboards/analytics/AnalyticsOrders.vue'
import AnalyticsDepositWithdraw from '@/views/dashboards/analytics/AnalyticsDepositWithdraw.vue'
import AnalyticsSalaryPaments from '@/views/dashboards/analytics/AnalyticsSalaryPaments.vue'
import AnalyticsTotalEarning from '@/views/dashboards/analytics/AnalyticsTotalEarning.vue'
import AnalyticsTotalProfitLineCharts from '@/views/dashboards/analytics/AnalyticsTotalProfitLineCharts.vue'
import AnalyticsTransactions from '@/views/dashboards/analytics/AnalyticsTransactions.vue'
import AnalyticsWeeklyOverview from '@/views/dashboards/analytics/AnalyticsWeeklyOverview.vue'
import CardStatisticsVertical from '@core/components/CardStatisticsVertical.vue'
import { scope } from '@/@core/utils/index'

import { onMounted } from 'vue'
import { axios } from '@/plugins/axios-plugin'

const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'mdi-poll',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
}
const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'mdi-briefcase-variant-outline',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
}
const accountMoney = ref(0)
const transactions = ref({})
const incomes = ref({})
const salaries = ref([])
const orders = ref([])
const getAnalytics = async () => {
  try {
    const { data } = await axios.get('analytics')
    accountMoney.value = data.account_money
    transactions.value = data.transactions
    incomes.value = data.incomes
    salaries.value = data.salaries
    orders.value = data.orders
  } catch (error) {}
}
onMounted(async () => {
  await getAnalytics()
})
</script>



<route lang="yaml">
meta:
  auth: true
</route>

