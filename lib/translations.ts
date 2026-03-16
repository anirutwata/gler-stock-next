export type Lang = 'th' | 'mm'

export const T = {
  th: {
    appName: 'เกลอ ข้าวขาหมู',
    appSub: 'ระบบจัดการสต็อก',
    nav: { home: 'หน้าหลัก', stock: 'สต็อก', order: 'สั่งซื้อ', manage: 'จัดการ', settings: 'ตั้งค่า', history: 'ประวัติ', dashboard: 'ภาพรวม', sop: 'SOP' },
    home: { title: 'ภาพรวม', total: 'รายการทั้งหมด', low: 'ต้องสั่งเพิ่ม', lastCheck: 'เช็คล่าสุด', noCheck: 'ยังไม่ได้เช็ค', qStock: 'เช็คสต็อก', qOrder: 'สั่งซื้อ', alertTitle: 'สต็อกต่ำ', noAlert: 'สต็อกปกติทุกรายการ ✓' },
    stock: { title: 'เช็คสต็อก', sub: 'กรอกจำนวนสต็อกปัจจุบัน', btn: 'สรุปรายงานสต็อก', confirmTitle: 'สรุปรายงานสต็อก', search: 'ค้นหา...', sendBtn: 'บันทึกข้อมูล' },
    order: { title: 'สั่งซื้อวัตถุดิบ', sub: 'เลือกรายการที่ต้องการสั่ง', btn: 'สรุปใบสั่งซื้อ', confirmTitle: 'ใบสั่งซื้อ', search: 'ค้นหา...', sendBtn: 'ส่งใบสั่งซื้อ', note: 'หมายเหตุ', notePH: 'เพิ่มหมายเหตุ...', noItems: 'กรุณาเลือกรายการ', qty: 'จำนวน' },
    manage: { title: 'จัดการข้อมูล', sub: 'เพิ่ม/แก้ไข/ลบรายการ', addBtn: 'เพิ่มรายการ', editTitle: 'แก้ไขรายการ', search: 'ค้นหา...', name_th: 'ชื่อ (ไทย)', name_mm: 'ชื่อ (พม่า)', category: 'หมวดหมู่', supplier: 'ผู้จำหน่าย', unit_th: 'หน่วย (ไทย)', unit_mm: 'หน่วย (พม่า)', minStock: 'สต็อกขั้นต่ำ', save: 'บันทึก', cancel: 'ยกเลิก', del: 'ลบ', delConfirm: 'ยืนยันลบรายการนี้?' },
    settings: { title: 'ตั้งค่า', tgSection: 'TELEGRAM', botToken: 'Bot Token', chatId: 'Chat ID (กลุ่ม)', testBtn: 'ทดสอบส่ง', langSection: 'ภาษา', saveBtn: 'บันทึก' },
    common: { loading: 'กำลังส่ง...', success: 'ส่งสำเร็จ! ✓', error: 'เกิดข้อผิดพลาด', saved: 'บันทึกแล้ว', deleted: 'ลบแล้ว', all: 'ทั้งหมด', status_ok: 'ปกติ', status_low: 'ต่ำ', status_empty: 'หมด', edit: 'แก้ไข', add: 'เพิ่ม', close: 'ปิด' },
    sop: { title: 'SOP มาตรฐานการปฏิบัติงาน', sub: 'ขั้นตอนการทำงานมาตรฐาน', step: 'ขั้นตอนที่', note: 'หมายเหตุ', checklistSave: 'บันทึกการตรวจสอบ', checklistSaved: 'บันทึกแล้ว ✓', checklistBadge: 'CHECKLIST', noSops: 'ยังไม่มี SOP ในระบบ', manageSop: 'จัดการ SOP', manageTitle: 'จัดการ SOP', manageSub: 'เพิ่ม/แก้ไข/ลบ SOP', addSop: 'เพิ่ม SOP', sopTitle: 'ชื่อ SOP', sopDesc: 'คำอธิบาย (ไม่บังคับ)', sopCategory: 'หมวดหมู่', addStep: '+ เพิ่มขั้นตอน', stepText: 'รายละเอียดขั้นตอน', stepNote: 'หมายเหตุขั้นตอน (ไม่บังคับ)', lastDone: 'ทำล่าสุดโดย', manageCat: 'จัดการหมวดหมู่', addCat: 'เพิ่มหมวดหมู่', catName: 'ชื่อหมวดหมู่', catEmoji: 'อีโมจิ', catChecklist: 'ใช้เป็น Checklist', uploadImg: 'อัปโหลดรูป', delStep: 'ลบ', delSop: 'ลบ SOP', delConfirm: 'ยืนยันลบ SOP นี้?', catDelConfirm: 'ยืนยันลบหมวดหมู่นี้?' },
  },
  mm: {
    appName: 'သူငယ်ချင်း ဝက်ခြေသားထမင်း',
    appSub: 'ကုန်ပစ္စည်းစီမံခန့်ခွဲမှုစနစ်',
    nav: { home: 'ပင်မ', stock: 'စတော့', order: 'မှာယူ', manage: 'စီမံ', settings: 'ဆက်တင်', history: 'မှတ်တမ်း', dashboard: 'ခြုံငုံ', sop: 'SOP' },
    home: { title: 'ခြုံငုံသုံးသပ်မှု', total: 'ပစ္စည်းစုစုပေါင်း', low: 'မှာယူရမည့်ပစ္စည်း', lastCheck: 'နောက်ဆုံးစစ်ဆေးချိန်', noCheck: 'မစစ်ဆေးရသေး', qStock: 'စတော့စစ်ဆေး', qOrder: 'မှာယူ', alertTitle: 'စတော့နည်းနေသည်', noAlert: 'စတော့အားလုံးပုံမှန် ✓' },
    stock: { title: 'စတော့စစ်ဆေး', sub: 'လက်ရှိစတော့ပမာဏထည့်သွင်းပါ', btn: 'စတော့အစီရင်ခံချက်', confirmTitle: 'စတော့အစီရင်ခံချက်', search: 'ရှာဖွေ...', sendBtn: 'ဒေတာသိမ်းဆည်း' },
    order: { title: 'ကုန်ကြမ်းမှာယူ', sub: 'မှာယူလိုသောပစ္စည်းရွေးချယ်ပါ', btn: 'မှာလွှာချုပ်', confirmTitle: 'မှာယူလွှာ', search: 'ရှာဖွေ...', sendBtn: 'မှာလွှာပို့', note: 'မှတ်ချက်', notePH: 'မှတ်ချက်ထည့်ပါ...', noItems: 'ပစ္စည်းရွေးချယ်ပါ', qty: 'ပမာဏ' },
    manage: { title: 'ပစ္စည်းစီမံ', sub: 'ထည့်/ပြင်ဆင်/ဖျက်', addBtn: 'ပစ္စည်းထည့်', editTitle: 'ပစ္စည်းပြင်ဆင်', search: 'ရှာဖွေ...', name_th: 'နာမည် (ထိုင်း)', name_mm: 'နာမည် (မြန်မာ)', category: 'အမျိုးအစား', supplier: 'ကုန်ပေးသူ', unit_th: 'ယူနစ် (ထိုင်း)', unit_mm: 'ယူနစ် (မြန်မာ)', minStock: 'အနည်းဆုံးစတော့', save: 'သိမ်းဆည်း', cancel: 'မလုပ်တော့', del: 'ဖျက်', delConfirm: 'ဤပစ္စည်းကိုဖျက်မလား?' },
    settings: { title: 'ဆက်တင်', tgSection: 'TELEGRAM', botToken: 'Bot Token', chatId: 'Chat ID (အုပ်စု)', testBtn: 'စမ်းသပ်ပို့', langSection: 'ဘာသာစကား', saveBtn: 'သိမ်းဆည်း' },
    common: { loading: 'ပို့နေသည်...', success: 'ပို့ပြီး! ✓', error: 'အမှားတစ်ခုဖြစ်သည်', saved: 'သိမ်းပြီး', deleted: 'ဖျက်ပြီး', all: 'အားလုံး', status_ok: 'ပုံမှန်', status_low: 'နည်း', status_empty: 'ကုန်', edit: 'ပြင်ဆင်', add: 'ထည့်', close: 'ပိတ်' },
    sop: { title: 'SOP လုပ်ငန်းစဉ်စံချိန်', sub: 'စံလုပ်ငန်းဆောင်တာများ', step: 'အဆင့်', note: 'မှတ်ချက်', checklistSave: 'စစ်ဆေးမှုသိမ်းဆည်း', checklistSaved: 'သိမ်းပြီး ✓', checklistBadge: 'CHECKLIST', noSops: 'SOP မရှိသေး', manageSop: 'SOP စီမံ', manageTitle: 'SOP စီမံခန့်ခွဲ', manageSub: 'SOP ထည့်/ပြင်ဆင်/ဖျက်', addSop: 'SOP ထည့်', sopTitle: 'SOP နာမည်', sopDesc: 'ဖော်ပြချက် (မဖြစ်မနေမဟုတ်)', sopCategory: 'အမျိုးအစား', addStep: '+ အဆင့်ထည့်', stepText: 'အဆင့်အသေးစိတ်ဖော်ပြချက်', stepNote: 'အဆင့်မှတ်ချက် (မဖြစ်မနေမဟုတ်)', lastDone: 'နောက်ဆုံးလုပ်ဆောင်သူ', manageCat: 'အမျိုးအစားစီမံ', addCat: 'အမျိုးအစားထည့်', catName: 'အမျိုးအစားနာမည်', catEmoji: 'အီမိုဂျီ', catChecklist: 'Checklist အဖြစ်သုံး', uploadImg: 'ပုံတင်', delStep: 'ဖျက်', delSop: 'SOP ဖျက်', delConfirm: 'ဤ SOP ကိုဖျက်မလား?', catDelConfirm: 'ဤအမျိုးအစားကိုဖျက်မလား?' },
  },
} as const
