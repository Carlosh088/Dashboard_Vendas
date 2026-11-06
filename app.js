"use strict";
const $ = id => document.getElementById(id);
const regions = ["Sudeste", "Sul", "Nordeste", "Centro-Oeste"];
const statesByRegion = [["SP","MG","RJ"],["PR","SC","RS"],["BA","PE","CE"],["GO","MT","MS"]];
const catalog = [
  ["Linha Flex A", "Mangueiras", 36, .67],
  ["Linha Flex B", "Mangueiras", 28, .79],
  ["Conexão Série A", "Conexões", 55, .49],
  ["Conexão Série B", "Conexões", 47, .58],
  ["Kit Manutenção", "Acessórios", 66, .57],
  ["Kit Instalação", "Acessórios", 73, .62]
];
const rows = [];
for (const year of [2023,2024,2025]) {
  for (let month=1; month<=12; month++) {
    for (let i=0; i<36; i++) {
      const index = (i + Math.floor(i/6) + month) % 6;
      const [product,family,price,costRate] = catalog[index];
      const growth = year===2025 ? (index===1 ? 1.65 : 1.16) : year===2024 ? 1.07 : 1;
      const season = 1 + .22*Math.sin((month-3)*Math.PI/6);
      const kg = Math.round((36 + (i*37+month*17)%125)*growth*season);
      const returnedKg = (i+month)%9===0 ? Math.round(kg*.1) : 0;
      const gross = kg*price;
      const discount = Math.round(gross*(year===2025 && index===1 ? .13 : .02 + (i%4)*.012));
      const returns = Math.round((gross-discount)*returnedKg/kg);
      const cost = Math.round((kg-returnedKg)*price*(costRate+(year===2025?.018:0)));
      rows.push({year,month,order:year+"-"+month+"-"+i,region:regions[(i+Math.floor(i/7))%4],
        uf:statesByRegion[(i+Math.floor(i/7))%4][(i+month)%3], client:"Cliente "+String(1+(i*7+month)%15).padStart(2,"0"),product,family,
        kg:kg-returnedKg,gross,discount,returns,cost,net:gross-discount-returns});
    }
  }
}
const brl = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const num = new Intl.NumberFormat("pt-BR",{maximumFractionDigits:1});
const pct = n => num.format(100*n)+"%";
const cash = n => brl.format(n);
const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const total = (data,key) => data.reduce((acc,row)=>acc+row[key],0);
function metrics(data) {
  const net=total(data,"net"), cost=total(data,"cost"), orders=new Set(data.map(row=>row.order)).size;
  return {net,cost,orders,profit:net-cost,margin:net?(net-cost)/net:0,ticket:orders?net/orders:0,kg:total(data,"kg")};
}
function rank(data,key) {
  const groups=new Map();
  for(const row of data){ if(!groups.has(row[key])) groups.set(row[key],[]); groups.get(row[key]).push(row); }
  return [...groups].map(([name,items])=>({name,...metrics(items)})).sort((a,b)=>b.net-a.net);
}
function table(headers, data) {
  return "<table><thead><tr>"+headers.map(h=>"<th scope='col'>"+h+"</th>").join("")+"</tr></thead><tbody>"+
    data.map(row=>"<tr>"+row.map((value,i)=>i===0?"<th scope='row'>"+value+"</th>":"<td>"+value+"</td>").join("")+"</tr>").join("")+"</tbody></table>";
}
function options(id,values) {
  $(id).append(new Option("Todas",""));
  for(const value of values) $(id).append(new Option(value,value));
}
options("region",regions);
options("uf",statesByRegion.flat().sort());
options("product",catalog.map(item=>item[0]));
options("client",[...new Set(rows.map(row=>row.client))].sort());
options("family",[...new Set(catalog.map(row=>row[1]))]);
let selection = [];
function render() {
  const year=Number($("year").value), q=Number($("quarter").value), region=$("region").value, family=$("family").value, uf=$("uf").value, product=$("product").value, client=$("client").value;
  const selectedMonths=months.map((_,i)=>i+1).filter(m=>!q||Math.ceil(m/3)===q);
  const pick=y=>rows.filter(r=>r.year===y&&selectedMonths.includes(r.month)&&(!region||r.region===region)&&(!family||r.family===family)&&(!uf||r.uf===uf)&&(!product||r.product===product)&&(!client||r.client===client));
  selection=pick(year);
  const a=metrics(selection), b=metrics(pick(year-1));
  const change=(x,y)=>y?(x>=y?"+":"")+pct((x-y)/y):"—";
  const signed=n=>(n>=0?"+":"")+num.format(n);
  const summary=[
    ["Faturamento bruto",cash(total(selection,"gross")),change(total(selection,"gross"),total(pick(year-1),"gross"))],
    ["Receita líquida",cash(a.net),change(a.net,b.net)],["Volume líquido",num.format(a.kg)+" kg",change(a.kg,b.kg)],
    ["Nº de notas",num.format(a.orders),change(a.orders,b.orders)],["Clientes registrados",num.format(new Set(selection.map(r=>r.client)).size),change(new Set(selection.map(r=>r.client)).size,new Set(pick(year-1).map(r=>r.client)).size)],["Ticket médio",cash(a.ticket),change(a.ticket,b.ticket)],
    ["Margem bruta",cash(a.profit),change(a.profit,b.profit)],["Margem bruta %",pct(a.margin),signed(100*(a.margin-b.margin))+" p.p."]
  ];
  $("cards").innerHTML=summary.map(([label,value,delta])=>'<div class="card">'+label+'<strong class="value">'+value+'</strong><small>'+delta+' vs. '+(year-1)+'</small></div>').join("");
  const products=rank(selection,"product"), clients=rank(selection,"client");
  $("insight").textContent=selection.length
    ? "Receita "+change(a.net,b.net)+" e margem "+signed(100*(a.margin-b.margin))+" p.p. frente ao mesmo recorte de "+(year-1)+". "+products[0].name+" lidera em receita, com margem de "+pct(products[0].margin)+". Veja os descontos, as devoluções e os custos ao lado."
    : "Nenhum pedido neste recorte. Ajuste os filtros.";
  $("concentration").textContent="Os 3 maiores clientes representam "+pct(a.net?total(clients.slice(0,3),"net")/a.net:0)+" da receita do recorte.";
  $("products").innerHTML=table(["Produto","Receita","Margem R$","Margem %"],products.map(p=>[p.name,cash(p.net),cash(p.profit),pct(p.margin)]));
  $("clients").innerHTML=table(["Cliente","Receita","Participação"],clients.slice(0,6).map(p=>[p.name,cash(p.net),pct(a.net?p.net/a.net:0)]));
  $("bridge").innerHTML=table(["Componente","Valor"],[["Faturamento bruto",cash(total(selection,"gross"))],["Descontos",cash(-total(selection,"discount"))],["Devoluções",cash(-total(selection,"returns"))],["Receita líquida",cash(a.net)],["Custo líquido",cash(-a.cost)],["Margem bruta",cash(a.profit)]]);
  const targetVisible=!region&&!family&&!uf&&!product&&!client;
  const series=selectedMonths.map(m=>({label:months[m-1],net:total(selection.filter(r=>r.month===m),"net"),target:targetVisible?Math.round((year===2025?178000:150000)*(1+.18*Math.sin((m-3)*Math.PI/6))):0}));
  const scale=Math.max(1,...series.flatMap(r=>[r.net,r.target]));
  const step=540/series.length, bar=Math.min(40,step*.6), x=i=>55+step*(i+.5), y=n=>180-145*n/scale;
  $("chart").innerHTML='<svg viewBox="0 0 620 215" role="img" aria-label="Gráfico mensal de receita e meta"><line x1="55" y1="180" x2="595" y2="180" stroke="#9bb1c4"/>'+series.map((r,i)=>'<rect x="'+(x(i)-bar/2)+'" y="'+y(r.net)+'" width="'+bar+'" height="'+(180-y(r.net))+'" fill="#1675a4"><title>'+r.label+': '+cash(r.net)+'</title></rect><text x="'+x(i)+'" y="201" text-anchor="middle" font-size="13" fill="#294458">'+r.label+'</text>').join("")+(targetVisible?'<polyline points="'+series.map((r,i)=>x(i)+','+y(r.target)).join(' ')+'" fill="none" stroke="#a74b00" stroke-width="3" stroke-dasharray="6 4"/>':"")+'</svg>';
  $("months").innerHTML=table(["Mês","Receita","Meta"],series.map(r=>[r.label,cash(r.net),targetVisible?cash(r.target):"—"]));
  $("states").innerHTML=table(["UF","Faturamento","Receita líquida","Participação no faturamento"],rank(selection,"uf").map(state=>[state.name,cash(total(selection.filter(r=>r.uf===state.name),"gross")),cash(state.net),pct(total(selection,"gross")?total(selection.filter(r=>r.uf===state.name),"gross")/total(selection,"gross"):0)]));
  $("sample").innerHTML=table(["Nota fictícia","UF","Cliente","Produto","Volume líquido","Receita líquida"],selection.slice(0,15).map(r=>[r.order,r.uf,r.client,r.product,num.format(r.kg)+" kg",cash(r.net)]));
  $("records").textContent=num.format(selection.length)+" registros fictícios no recorte. O CSV inclui produtos, clientes, valores e custos.";
  $("download").disabled=!selection.length;
}
$("filters").addEventListener("change",render);
$("filters").addEventListener("submit",e=>e.preventDefault());
$("filters").addEventListener("reset",()=>setTimeout(render,0));
$("download").addEventListener("click",()=>{
  const columns=Object.keys(rows[0]);
  const csv=columns.join(";")+"\r\n"+selection.map(row=>columns.map(k=>row[k]).join(";")).join("\r\n");
  const url=URL.createObjectURL(new Blob(["\uFEFF",csv],{type:"text/csv;charset=utf-8"}));
  const link=document.createElement("a"); link.href=url; link.download="vendas-demonstrativas.csv"; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();