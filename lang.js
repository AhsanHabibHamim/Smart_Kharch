let lang="bn";
const text={
  bn:{
    addExpense:"খরচ যোগ করুন",
    summary:"মাসিক সারাংশ",
    recent:"সাম্প্রতিক খরচ",
    nostreak:"নো-স্পেন্ড স্ট্রিক",
    emergency:"ইমার্জেন্সি ফান্ড",
    tips:"স্মার্ট টিপস",
    monthlyExpenses:"মাসিক খরচ"
  },
  en:{
    addExpense:"Add Expense",
    summary:"Monthly Summary",
    recent:"Recent Expenses",
    nostreak:"No Spend Streak",
    emergency:"Emergency Fund",
    tips:"Smart Tips",
    monthlyExpenses:"Monthly Expenses"
  }
};

function toggleLanguage(){
  lang=lang==="bn"?"en":"bn";
  document.querySelectorAll("[data-key]").forEach(el=>{
    el.innerText=text[lang][el.dataset.key];
  });
}
toggleLanguage();
