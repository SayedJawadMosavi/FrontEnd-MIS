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
          <div style="background-image: url('@/assets/yrl-logo.png'); width: 60px; height: 60px"></div>
        </div>
      </div>
      <div style="font-size: 14px; color: #40a579; direction: rtl; margin-top: 10px">
        آدرس: کابل جاده میوند عقب هده سابقه مزار شریف جوار مسجد عیدگاه
      </div>
    </div>
    <!-- <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center; flex-direction: column">
        <div>Trading & Cargo Company</div>
        <div>خدمات حواله یوسف رسانی</div>
      </div>
      <div style="display: flex; align-items: start">
        <img
          src="@/assets/yrl-logo.png"
          height="60px"
          alt="ddffddfdfdfdfdf"
          srcset=""
        >
      </div>
    </div> -->
    <!-- <div
      class="d-flex"
      style="direction: rtl; margin-bottom: 20px; margin-top: 20px"
    >
      <div style="font-size: 16px">شماره تماس : 0777899358</div>
      <div style="font-size: 16px">شماره های واتساپ: 0777465733, 0781907769 ,070296425</div>
      <div style="font-size: 16px">آدرس: کابل جاده میوند عقب هده مزار شریف جوار مسجد عیدگاه</div>
    </div> -->
    <div style="text-align: right; direction: rtl; margin-top: 30px; font-size: 12px !important">
      <div style="display: flex; justify-content: space-between">
        <div>تاریخ: {{ formateDateBill(new Date()) }}</div>
        <div style="min-width: 160px">نمبر حواله: {{ printItem?.exchange_id }}</div>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div>اسم گیرنده: {{ printItem.receiver_name }}</div>
        <div style="min-width: 160px">اسم پدر گیرنده : {{ printItem?.receiver_father_name }}</div>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div>ولایت : {{ printItem?.province }}</div>
        <div style="min-width: 160px">نمبر تذکره: {{ printItem?.receiver_id_no }}</div>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px" />
    <table style="width: 100%; border-collapse: collapse; font-size: 12px !important">
      <tr>
        <th
          style="
            font-weight: 500;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border-color: grey;
            padding: 0px 6px;
          "
        >
          واحد
        </th>
        <th
          style="
            font-weight: 500;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border-color: grey;
            padding: 0px 6px;
          "
        >
          مقدار
        </th>
        <th
          style="
            font-weight: 500;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border-color: grey;
            padding: 0px 6px;
          "
        >
          شماره تماس
        </th>
        <th
          style="
            font-weight: 500;
            width: 30.66%;
            text-align: right;
            font-size: 12px;
            border-color: grey;
            padding: 0px 6px;
          "
        >
          اسم فرستنده
        </th>
      </tr>
      <tr style="margin-top: 10px">
        <td style="width: 16.66%; text-align: right; border-color: grey; padding: 0px 6px">
          {{ printItem?.currency }}
        </td>
        <td style="width: 16.66%; text-align: right; border-color: grey; padding: 0px 6px">
          {{ printItem?.amount }}
        </td>
        <td style="width: 16.66%; text-align: right; border-color: grey; padding: 0px 6px">
          {{ printItem?.phone_number }}
        </td>
        <td style="width: 30.66%; text-align: right; border-color: grey; padding: 0px 6px">
          {{ printItem?.sender_name }}
        </td>
      </tr>
    </table>

    <div
      class=""
      style="direction: rtl; margin-top: 40px; font-size: 12px"
    >
      <div style="margin-bottom: 5px">محل مهر و امضا:</div>
    </div>
  </div>
</template>

<script setup>
import { formateDateBill } from '@/@core/utils/index'
import logo from '@/assets/yrl-logo.png'

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
  border-color: grey;
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
