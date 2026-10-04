const {test}=require('node:test');
const assert=require('node:assert/strict');
const {summarize,csv}=require('../public/report');
const areas={dev:['💻','Desenvolvimento'],cyber:['🛡️','Cibersegurança'],infra:['🌐','Infraestrutura'],suporte:['🔧','Suporte']};
test('conta todos os inscritos, inclusive quem não concluiu, e encontra a área mais escolhida',()=>{
 const players=[{area:'dev',finished:true},{area:'dev',finished:false},{area:'suporte',finished:true}];
 const report=summarize(players,areas);
 assert.equal(report.total,3);
 assert.deepEqual(report.counts.map(a=>a.count),[2,0,0,1]);
 assert.equal(report.counts[0].percent,2/3*100);
 assert.deepEqual(report.leaders.map(a=>a.key),['dev']);
});
test('representa empate e sala vazia sem escolher uma vencedora arbitrária',()=>{
 assert.deepEqual(summarize([{area:'dev'},{area:'suporte'}],areas).leaders.map(a=>a.key),['dev','suporte']);
 const empty=summarize([],areas);
 assert.deepEqual(empty.leaders,[]);
 assert.ok(empty.counts.every(a=>a.count===0&&a.percent===0));
});
test('CSV preserva acentos, escolhas, caracteres especiais e protege apelidos contra fórmulas',()=>{
 const room={code:'123456',players:[{name:'=1+1',area:'dev',avatar:3,xp:200,stage:1,finished:false},{name:'Ana; "TI"',area:'suporte',avatar:6,xp:1000,stage:5,finished:true}]};
 const output=csv(room,areas,{3:'R2-D2',6:'C-3PO'});
 assert.ok(output.startsWith('\ufeff'));
 assert.ok(output.includes('"\'=1+1";"Desenvolvimento";"R2-D2";"200";"1/5";"Não concluiu"'));
 assert.ok(output.includes('"Ana; ""TI""";"Suporte";"C-3PO";"1000";"5/5";"Concluiu"'));
 assert.ok(output.includes('"Desenvolvimento";"1";"50,0%"'));
});
