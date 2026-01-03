let expenses=JSON.parse(localStorage.getItem("expenses"))||[];
let savings=Number(localStorage.getItem("savings"))||0;

function addExpense(){
  const amt=+amount.value;
  const cat=category.value;
  if(!amt) return alert("Amount required");

  expenses.push({amt,cat,date:new Date().toISOString()});
  localStorage.setItem("expenses",JSON.stringify(expenses));
  render();
}

function render(){
  chart();
  noSpend();
  emergency();
  tips();
}

function chart(){
  const sum={};
  expenses.forEach(e=>sum[e.cat]=(sum[e.cat]||0)+e.amt);
  new Chart(chartEl,{type:"pie",data:{labels:Object.keys(sum),datasets:[{data:Object.values(sum)}]}});
}
const chartEl=document.getElementById("chart");

function noSpend(){
  const today=new Date().toISOString().slice(0,10);
  const spent=expenses.some(e=>e.date.startsWith(today));
  let days=JSON.parse(localStorage.getItem("noSpend"))||[];

  if(!spent && !days.includes(today)){
    days.push(today);
    localStorage.setItem("noSpend",JSON.stringify(days));
  }

  document.getElementById("streak").innerText=`🔥 ${days.length} Days`;
}

function emergency(){
  const total=expenses.reduce((a,b)=>a+b.amt,0);
  const target=total*6||1;
  const percent=Math.min((savings/target)*100,100);
  progress.style.width=percent+"%";
  emText.innerText=percent>=100?"Safe 💪":"Build Emergency Fund";
}

function tips(){
  const food=expenses.filter(e=>e.cat==="Food").reduce((a,b)=>a+b.amt,0);
  tips.innerHTML="";
  if(food>3000) tips.innerHTML+="<li>বাইরের খাবার কমান 🍔</li>";
}

if(Notification.permission!=="granted"){
  Notification.requestPermission();
}

render();
