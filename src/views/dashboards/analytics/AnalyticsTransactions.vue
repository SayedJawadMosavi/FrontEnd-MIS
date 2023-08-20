<script setup>
const props = defineProps({
  transactions: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
})
const statistics = [
  {
    title: 'سفارش',
    stats: '245k',
    icon: 'mdi-shopping-outline',
    color: 'primary',
  },
  {
    title: 'موتر',
    stats: '12.5k',
    icon: 'mdi-truck-fast',
    color: 'info',
  },
  {
    title: 'رفت و آمد',
    stats: '12.5k',
    icon: 'mdi-gesture-tap',
    color: 'success',
  },
  {
    title: 'حواله',
    stats: '1.54k',
    icon: 'mdi-cash-multiple',
    color: 'warning',
  },

  // {
  //   title: 'Revenue',
  //   stats: '$88k',
  //   icon: 'mdi-currency-usd',
  //   color: 'info',
  // },
]

// icon: 'mdi-trending-up',
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>معاملات</VCardTitle>
    </VCardItem>

    <VCardText>
      <h6 class="text-sm mb-12">
        <!-- <span>48.5% افزایش 😎</span> -->
        <span class="font-weight-regular"> تمام معاملات سیستم</span>
      </h6>

      <VRow>
        <VCol
          v-for="(item, index) in statistics"
          :key="index"
          cols="6"
          sm="3"
        >
          <div class="d-flex align-center">
            <div class="me-3">
              <VAvatar
                :color="item.color"
                rounded
                size="42"
                class="elevation-1"
              >
                <VIcon
                  size="24"
                  :icon="item.icon"
                />
              </VAvatar>
            </div>

            <div class="d-flex flex-column">
              <span class="text-caption">
                {{ item.title }}
              </span>
              <span class="text-h6 font-weight-medium">{{ transactions[index] }}</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
