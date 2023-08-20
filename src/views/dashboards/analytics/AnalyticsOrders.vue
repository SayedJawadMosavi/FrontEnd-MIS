
<template>
  <VCard>
    <VTable
      :headers="headers"
      :items="usreList"
      item-key="fullName"
      class="table-rounded"
      hide-default-footer
      disable-sort
    >
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
        >
          <td v-text="row.id" />
          <td v-text="row.car_id" />
          <td v-text="row.customer_name" />
          <td v-text="row.customer_phone" />
          <td v-text="row.price_per_killo" />
          <td v-text="row.total_price" />
          <td v-text="row.payments_sum_amount" />
          <td v-text="row.remainder" />

          <!-- status -->
          <td>
            {{ formateDate(row.created_at) }}
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCard>
</template>

<script setup>
import { formateDate } from '@/@core/utils/index'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const headers = [
  {
    title: '#آی دی',
    key: 'id',
    width: '80px',
  },
  {
    title: 'نمبر موتر',
    key: 'car_id',
    width: '100px',
  },
  {
    title: 'اسم مشتری',
    key: 'customer_name',
    width: '140px',
  },
  {
    title: 'شماره تلفون',
    key: 'customer_phone',
    width: '140px',
  },

  {
    title: 'قیمت فی کیلو',
    key: 'price_per_killo',
    width: '120px',
  },

  {
    title: 'مجموع قیمت',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'مقدار پرداخت شده',
    key: 'paid_amount',
    width: '130px',
  },
  {
    title: 'باقیمانده',
    key: 'remainder',
    width: '180px',
  },

  {
    title: 'تاریخ ثبت',
    key: 'created_at',
  },
]
</script>

