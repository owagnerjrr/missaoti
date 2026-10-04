(function(root){
  'use strict';
  function summarize(players,areas){
    const total=players.length;
    const counts=Object.entries(areas).map(([key,value])=>({key,name:value[1],count:players.filter(p=>p.area===key).length}));
    const highest=Math.max(0,...counts.map(a=>a.count));
    return {total,counts:counts.map(a=>({...a,percent:total?a.count/total*100:0})),leaders:highest?counts.filter(a=>a.count===highest):[]};
  }
  function cell(value){
    let text=String(value??'');
    // Apelidos são texto, inclusive quando começam com fórmulas de planilha.
    if(/^\s*[=+@-]/.test(text)||/^[\t\r\n]/.test(text))text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  }
  function csv(room,areas,avatars){
    const report=summarize(room.players,areas);
    const rows=[['Relatório final — Missão TI'],['Sala',room.code],['Participantes',report.total],[],['Área','Participantes','Percentual']];
    report.counts.forEach(a=>rows.push([a.name,a.count,a.percent.toFixed(1).replace('.',',')+'%']));
    rows.push([],['Apelido','Área escolhida','Personagem','XP','Desafios concluídos','Situação']);
    [...room.players].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).forEach(p=>rows.push([p.name,areas[p.area]?.[1]||p.area,avatars[p.avatar]||'Personagem',p.xp,p.stage+'/5',p.finished?'Concluiu':'Não concluiu']));
    return '\ufeff'+rows.map(row=>row.map(cell).join(';')).join('\r\n');
  }
  const report={summarize,csv};
  if(typeof module==='object'&&module.exports)module.exports=report;
  else root.MissaoReport=report;
})(typeof window==='object'?window:globalThis);
