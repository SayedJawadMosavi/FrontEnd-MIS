

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>پرداخت معاشات</VCardTitle>
      <template #append>
        <div class="me-n3">
          <VBtn
            icon
            size="x-small"
            variant="text"
            color="default"
          >
            <VIcon
              size="24"
              icon="mdi-dots-vertical"
            />
          </VBtn>
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="(salary, index) in data"
          :key="index"
        >
          <!-- {{ salary }} -->
          <template #prepend>
            <VAvatar
              size="40"
              variant="tonal"
              color="primary"
              class="me-3"
            >
              s
            </VAvatar>
          </template>

          <VListItemTitle class="mb-1">
            <span class="text-sm font-weight-semibold">{{
              salary?.employee?.first_name + ' ' + salary?.employee?.last_name
            }}</span>
          </VListItemTitle>
          <VListItemSubtitle class="text-xs text-primary"> معاش: {{ salary.salary }}$ </VListItemSubtitle>

          <template #append>
            <div style="direction: ltr">
              <h4 class="font-weight-semibold text-error">${{ salary?.paid }}</h4>
              <span class="text-xs text-medium-emphasis">{{ formateDateBill(salary.created_at) }}</span>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<script setup>
import { formateDateBill } from '@/@core/utils/index'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const salesByCountries = [
  {
    abbr: 'US',
    amount: '$8,656k',
    country: 'United states of america',
    change: '+25.8%',
    sales: '894k',
    color: 'success',
  },
  {
    abbr: 'UK',
    amount: '$2,415k',
    country: 'United kingdom',
    change: '-6.2%',
    sales: '645k',
    color: 'error',
  },
  {
    abbr: 'IN',
    amount: '$865k',
    country: 'India',
    change: '+12.4%',
    sales: '148k',
    color: 'warning',
  },
  {
    abbr: 'JA',
    amount: '$745k',
    country: 'Japan',
    change: '-11.9%',
    sales: '86k',
    color: 'secondary',
  },
  {
    abbr: 'KO',
    amount: '$45k',
    country: 'Korea',
    change: '+16.2%',
    sales: '42k',
    color: 'error',
  },
]
</script>


  <style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>


