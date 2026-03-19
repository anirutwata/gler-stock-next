export type Lang = 'th' | 'shn'

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
  shn: {
    appName: 'မိတ်ၵေႃႉ ၶဝ်ႈၶႃႈမူ',
    appSub: 'ၶဵင်ႇၵၢၼ်ၶပ်ႉမၢႆၶိူင်ႈၵိၼ်',
    nav: { home: 'ၼႃႈလူင်', stock: 'ၶပ်ႉမၢႆ', order: 'သင်ႈသိုဝ်ႈ', manage: 'ၸတ်းၵၢၼ်', settings: 'တင်ႈၶၼ်', history: 'ဝၢင်ႈၵၢၼ်', dashboard: 'ၽႃႇႁူမ်ႈ', sop: 'SOP' },
    home: { title: 'ၽႃႇႁူမ်ႈ', total: 'ၶႅင်ၵၢၼ်တင်ႈမူတင်', low: 'လူဝ်ႇသင်ႈထႅင်ႈ', lastCheck: 'ၸႅတ်ႈၸႂ်ႉလိုၼ်းသုတ်း', noCheck: 'ဢမ်ႇပႆႇၸႅတ်ႈ', qStock: 'ၸႅတ်ႈၶပ်ႉမၢႆ', qOrder: 'သင်ႈသိုဝ်ႈ', alertTitle: 'ၶပ်ႉမၢႆတႅမ်ႇ', noAlert: 'ၶပ်ႉမၢႆတင်ႈမူတင်ပိူင်ၵဝ်ႇ ✓' },
    stock: { title: 'ၸႅတ်ႈၶပ်ႉမၢႆ', sub: 'ၵဵင်းၼမ်ႉမႅၼ်ႈၶပ်ႉမၢႆမိူဝ်ႈလဵဝ်', btn: 'တိုၼ်းတၢၼ်းၶပ်ႉမၢႆ', confirmTitle: 'တိုၼ်းတၢၼ်းၶပ်ႉမၢႆ', search: 'ၵႂႃႇႁႃ...', sendBtn: 'သိမ်ႇၶေႃႈမုၼ်' },
    order: { title: 'သင်ႈသိုဝ်ႈၶိူင်ႈၵိၼ်', sub: 'လိူၵ်ႈၶႅင်ၵၢၼ်တီႈလူဝ်ႇသင်ႈ', btn: 'ၶၢဝ်ႇသင်ႈသိုဝ်ႈ', confirmTitle: 'ၶၢဝ်ႇသင်ႈသိုဝ်ႈ', search: 'ၵႂႃႇႁႃ...', sendBtn: 'ၸူင်ၶၢဝ်ႇသင်ႈ', note: 'ၶေႃႈမၢႆ', notePH: 'တင်ႈၶေႃႈမၢႆ...', noItems: 'ယုၵ်ႉလိူၵ်ႈၶႅင်ၵၢၼ်', qty: 'ၼမ်ႉမႅၼ်ႈ' },
    manage: { title: 'ၸတ်းၵၢၼ်ၶေႃႈမုၼ်', sub: 'တိူဝ်း/မႄးၵႄႈ/ဢဝ်ပႅတ်ႈ', addBtn: 'တိူဝ်းၶႅင်ၵၢၼ်', editTitle: 'မႄးၶႅင်ၵၢၼ်', search: 'ၵႂႃႇႁႃ...', name_th: 'ၸိုဝ်ႈ (ထႆး)', name_mm: 'ၸိုဝ်ႈ (တႆး)', category: 'မူႇပဵင်း', supplier: 'ၽူႈၶၢႆ', unit_th: 'ဢၼ် (ထႆး)', unit_mm: 'ဢၼ် (တႆး)', minStock: 'ၶပ်ႉမၢႆဢေႇသုတ်း', save: 'သိမ်ႇ', cancel: 'ပႅတ်ႈ', del: 'ဢဝ်ပႅတ်ႈ', delConfirm: 'တေဢဝ်ၶႅင်ၵၢၼ်ၼႆႉပႅတ်ႈၶႃႈႁႃ?' },
    settings: { title: 'တင်ႈၶၼ်', tgSection: 'TELEGRAM', botToken: 'Bot Token', chatId: 'Chat ID (မူႇ)', testBtn: 'ၸႅတ်ႈပၼ်', langSection: 'ၽႃသႃ', saveBtn: 'သိမ်ႇ' },
    common: { loading: 'ၸူင်ယူႇ...', success: 'ၸူင်ယဝ်ႉ! ✓', error: 'မီးလွင်ႈၽိတ်းပိူင်ႈ', saved: 'သိမ်ႇယဝ်ႉ', deleted: 'ဢဝ်ပႅတ်ႈယဝ်ႉ', all: 'တင်ႈမူတင်', status_ok: 'ပိူင်ၵဝ်ႇ', status_low: 'တႅမ်ႇ', status_empty: 'မူတ်း', edit: 'မႄးၵႄႈ', add: 'တိူဝ်း', close: 'ပိတ်' },
    sop: { title: 'SOP မၢႆမီႈၵၢၼ်ႁဵတ်းၵၢၼ်', sub: 'ၵၢၼ်ၸၼ်ႉမၢႆမီႈ', step: 'ၵၢၼ်ၸၼ်ႉတီႈ', note: 'ၶေႃႈမၢႆ', checklistSave: 'သိမ်ႇၵၢၼ်ၸႅတ်ႈ', checklistSaved: 'သိမ်ႇယဝ်ႉ ✓', checklistBadge: 'CHECKLIST', noSops: 'ဢမ်ႇပႆႇမီး SOP', manageSop: 'ၸတ်းၵၢၼ် SOP', manageTitle: 'ၸတ်းၵၢၼ် SOP', manageSub: 'တိူဝ်း/မႄး/ပႅတ်ႈ SOP', addSop: 'တိူဝ်း SOP', sopTitle: 'ၸိုဝ်ႈ SOP', sopDesc: 'ၶေႃႈပွင်ႈ (ဢမ်ႇၸႂ်ႈၶႂ်ႈ)', sopCategory: 'မူႇပဵင်း', addStep: '+ တိူဝ်းၵၢၼ်ၸၼ်ႉ', stepText: 'ၶေႃႈပွင်ႈၵၢၼ်ၸၼ်ႉ', stepNote: 'ၶေႃႈမၢႆၵၢၼ်ၸၼ်ႉ (ဢမ်ႇၸႂ်ႈၶႂ်ႈ)', lastDone: 'ႁဵတ်းလိုၼ်းသုတ်း', manageCat: 'ၸတ်းမူႇပဵင်း', addCat: 'တိူဝ်းမူႇပဵင်း', catName: 'ၸိုဝ်ႈမူႇပဵင်း', catEmoji: 'ဢီႇမူဝ်ဢၵျီႇ', catChecklist: 'ၸႂ်ႉပဵၼ် Checklist', uploadImg: 'တင်ႈႁၢင်ႈ', delStep: 'ဢဝ်ပႅတ်ႈ', delSop: 'ဢဝ် SOP ပႅတ်ႈ', delConfirm: 'တေဢဝ် SOP ၼႆႉပႅတ်ႈၶႃႈႁႃ?', catDelConfirm: 'တေဢဝ်မူႇပဵင်းၼႆႉပႅတ်ႈၶႃႈႁႃ?' },
  },
} as const
