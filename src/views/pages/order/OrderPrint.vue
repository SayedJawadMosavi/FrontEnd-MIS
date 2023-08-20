<template>
  <div
    class="order-print-only"
    style="direction: rtl"
  >
    <div style="border: 1px solid #40a579; border-radius: 10px; padding: 15px">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div style="color: #40a579; font-size: 12px">Trading & Cargo Company</div>
          <div style="color: #40a579; font-size: 12px">شرکت تجارتی و کارگو</div>
        </div>

        <div style="font-size: 10px; color: #40a579">شماره تماس : 0777899358</div>
        <div style="display: flex; align-items: start; flex-wrap: nowrap">
          <div
            class="d-flex"
            style="padding-right: 12px"
          >
            <div style="color: #40a579; font-size: 12px">Yousuf Rasani</div>
            <div style="color: #40a579; font-size: 12px">یوسف رسانی</div>
          </div>
          <div
            style="scale: 1.1"
            v-html="logo"
          />
        </div>
      </div>
      <div style="font-size: 14px; color: #40a579; direction: rtl; margin-top: 10px">
        آدرس: کابل جاده میوند عقب هده سابقه مزار شریف جوار مسجد عیدگاه
      </div>
    </div>

    <div style="text-align: right; direction: rtl; margin-top: 20px; font-size: 12px !important">
      <div>تاریخ: {{ formateDateBill(new Date()) }}</div>
      <div style="display: flex; justify-content: space-between">
        <div style="min-width: 160px">نمبر بل: {{ printItem?.id }}</div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div style="min-width: 160px">نمبر گروپ: {{ printItem?.group_number }}</div>

        <div style="min-width: 160px">
          <span style="display: inline-block; min-width: 60px">نمبر موتر: </span>{{ printItem?.car_id }}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div>اسم مشتری: {{ printItem.customer_name }}</div>
        <div style="min-width: 160px">اسم پدر: {{ printItem?.father_name }}</div>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div>اسم پدر کلان: {{ printItem?.grand_father_name }}</div>
        <div style="min-width: 160px">نمبر تذکره: {{ printItem?.tazkira_id }}</div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div>اسم گیرنده: {{ printItem?.receiver_name }}</div>
        <div style="min-width: 160px">شماره تماس گیرنده: {{ printItem?.receiver_phone }}</div>
      </div>
      <div>
        <div>آدرس گیرنده: {{ printItem?.address }}</div>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px" />
    <table style="width: 100%; border-collapse: collapse; font-size: 12px !important">
      <tr style="font-weight: 500 !important">
        <th
          style="
            font-weight: 500 !important;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          قیمت
        </th>
        <th
          style="
            font-weight: 500 !important;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          تعداد
        </th>
        <th
          style="
            font-weight: 500 !important;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          وزن
        </th>
        <th
          style="
            font-weight: 500 !important ;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          نوعیت جنس
        </th>
        <th
          style="
            font-weight: 500 !important;
            width: 30.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          اسم جنس
        </th>
      </tr>
      <tr
        v-for="(item, i) in props.printItem.items"
        :key="i"
      >
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ parseFloat(item?.weight * item?.price_per_killo ?? 0) }}
        </td>
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.count }}
        </td>
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.weight }}
        </td>
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.type }}
        </td>
        <td style="width: 30.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.name }}
        </td>
      </tr>
    </table>
    <!-- <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px"> -->

    <div
      v-show="props.printItem?.extra_expense?.length > 0"
      style="font-size: 12px !important"
    >
      <p style="direction: rtl; margin-bottom: 5px">مصارف اضافی</p>
      <table
        style="width: 100%; border-collapse: collapse"
        class="order-table"
      >
        <tr>
          <th style="width: 16.66%; text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
            قیمت
          </th>
          <th style="width: 30.66%; text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
            اسم جنس
          </th>
        </tr>
        <tr
          v-for="(item, i) in props.printItem.extra_expense"
          :key="i"
        >
          <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
            {{ item.price }}
          </td>
          <td style="width: 30.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
            {{ item.name }}
          </td>
        </tr>
      </table>
      <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px" />
    </div>

    <div
      style="
        direction: rtl;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 12px !important;
      "
    >
      <div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">قیمت فی کیلو:</span> {{ printItem?.price_per_killo }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">مجموع وزن:</span> {{ printItem?.items_sum_weight }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">مجموع قیمت:</span
          >{{ printItem?.total_price?.toFixed(2) }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">پرداخت شده:</span>
          {{ printItem?.payments_sum_amount ?? 0 }}
        </div>
        <div>
          <span style="min-width: 80px; display: inline-block">باقیمانده:</span> {{ printItem?.remainder?.toFixed(2) }}
        </div>
      </div>

      <div style="">محل شصت</div>

      <div style="">محل مهر و امضا</div>
    </div>
  </div>
</template>

<script setup>
import { formateDateBill } from '@/@core/utils/index'
import logo from '@/assets/logo.svg?raw'

const props = defineProps({
  printItem: {
    type: Object,
    default: () => {},
  },
})
</script>

<style>
.order-print-only {
  display: none;
  font-family: sans-serif;
}
.order-table table,
.order-table th,
.order-table td {
  border: 1px solid grey;
}
@media print {
  .order-print-only {
    display: block;
  }
  .always-displayed {
    display: none;
  }
}
</style>
