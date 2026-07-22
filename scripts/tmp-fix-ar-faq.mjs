import fs from 'node:fs';

const arPath = 'messages/ar.json';
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
ar.discountCalculator.faq.q2.answer =
  'أيوه. اختار "أعرف السعرين"، اكتب الأصلي وسعر العرض، وهتشوف نسبة الخصم ومبلغ التوفير.';
fs.writeFileSync(arPath, `${JSON.stringify(ar, null, 2)}\n`, 'utf8');
console.log('fixed');
