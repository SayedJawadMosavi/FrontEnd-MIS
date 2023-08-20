<template>
  <div class="car-print-only">
    <div style="display: flex; justify-content: space-between; margin: 10px 0px">
      <div style="display: flex; align-items: center; flex-direction: column">
        <div>شرکت تجارتی و کارگو یوسف رسانی</div>
      </div>
    </div>
    <div style="text-align: right">
      <div style="display: flex; justify-content: space-between">
        <div>نمبر موتر: {{ printItem[0]?.car_id }}</div>
        <div>تاریخ: {{ format(new Date()) }}</div>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px">
    <table
      style="width: 100%; border-collapse: collapse"
      class="print-table"
    >
      <tr class="">
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          شماره
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          نمبر گروپ
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          اسم مشتری
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          قیمت فی کیلو
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          وزن
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          تعداد
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          مصارف اضافی
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          مجموع قیمت
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          پرداخت شده
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          باقیمانده
        </th>
        <th style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          تاریخ ثبت
        </th>
      </tr>

      <tr
        v-for="(item, i) in printItem"
        :key="i"
      >
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ i + 1 }}
        </td>
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.group_number?? 99 }}
        </td>
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.customer_name ?? 'name' }}
        </td>
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.price_per_killo ?? 3 }}
        </td>
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.items_sum_weight ?? 43 }}
        </td>

        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.items_sum_count ?? '43' }}
        </td>

        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.extra_expense_sum_price ?? 0 }}
        </td>
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.total_price ?? 30 }}
        </td>

        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.payments_sum_amount ?? 90 }}
        </td>

        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.remainder ?? 43 }}
        </td>
        <td style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ format(item?.created_at) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { format } from '@/@core/utils/index'
import logo from '@/assets/logo.svg?raw'

const props = defineProps({
  printItem: {
    type: Array,
    default: () => [],
  },
})
</script>

<style>
.car-print-only {
  display: none;
  font-family: sans-serif;
}
.print-table table,
.print-table th,
.print-table td {
  border: 1px solid grey;
}
@media print {
  .car-print-only {
    display: block;
  }
  .always-displayed {
    display: none;
  }
}
</style>
