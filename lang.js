let lang="bn";
const text={
  bn:{
    addExpense:"খরচ যোগ করুন",
    summary:"মাসিক সারাংশ",
    nostreak:"নো-স্পেন্ড স্ট্রিক",
    emergency:"ইমার্জেন্সি ফান্ড",
    tips:"স্মার্ট টিপস"
  },
  en:{
    addExpense:"Add Expense",
    summary:"Monthly Summary",
    nostreak:"No Spend Streak",
    emergency:"Emergency Fund",
    tips:"Smart Tips"
  }
};

function toggleLanguage(){
  lang=lang==="bn"?"en":"bn";
  document.querySelectorAll("[data-key]").forEach(el=>{
    el.innerText=text[lang][el.dataset.key];
  });
}
toggleLanguage();
