import { STEP_OPERATIONS } from "../../engine/stepTypes";

export const STEP_OPERATION_LABELS = Object.freeze({
  [STEP_OPERATIONS.COMPARE]: "مقارنة",
  [STEP_OPERATIONS.SWAP]: "تبديل",
  [STEP_OPERATIONS.SELECT]: "اختيار",
  [STEP_OPERATIONS.SHIFT]: "إزاحة",
  [STEP_OPERATIONS.INSERT]: "إدراج",
  [STEP_OPERATIONS.SPLIT]: "تقسيم",
  [STEP_OPERATIONS.MERGE]: "دمج",
  [STEP_OPERATIONS.FOUND]: "تم العثور",
  [STEP_OPERATIONS.NOT_FOUND]: "لم يتم العثور",
  [STEP_OPERATIONS.VISIT]: "زيارة",
  [STEP_OPERATIONS.UPDATE]: "تحديث مجال البحث",
  [STEP_OPERATIONS.PARTITION]: "تقسيم محوري",
  [STEP_OPERATIONS.RECURSIVE_CALL]: "استدعاء ذاتي",
  [STEP_OPERATIONS.RETURN]: "عودة",
  [STEP_OPERATIONS.MOVE]: "نقل القرص",
  [STEP_OPERATIONS.COMPLETE]: "اكتمل الترتيب",
});