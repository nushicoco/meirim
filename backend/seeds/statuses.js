
exports.seed = function (knex, Promise) {
  return knex("statuses").insert([
    {
      name: "טרום הפקדה – שלבי תכנון מוקדמים"
    }, {
      name: "בהפקדה – X ימים להגשת התנגדות"
    }, {
      name: "דיון בהתנגדויות"
    }, {
      name: "הועבר לדיון בבית משפט"
    }, {
      name: "התכנית אושרה"
    }, {
      name: "פרויקט בביצוע"
    }, {
      name: "מאבק הסתיים"
    }
  ]);
};
