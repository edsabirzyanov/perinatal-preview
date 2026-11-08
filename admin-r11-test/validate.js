function registerR11Validation(CMS) {
 const ranges={"introduction":[1,2,3],"rooms":[4,5,6,7],"care":[8,9,10,11],"equipment":[12,13,14,15,16,17,18],"leadership":[19,20],"doctors":[21,22,23,24,25,26,27,28],"midwives":[29,30,31,32,33,34,35,36,37,38],"phones":[39,40,41,42,43,44],"hours":[46,47,48,49,50,51,52,54,55]};
 CMS.registerEventListener({name:'preSave',handler:({entry})=>{
   if(entry.get('collection')!=='r11-direct') return;
   const data=entry.get('data');
   if(data.get('routeId')!=='R11'||data.get('state')!=='pilot-draft') throw new Error('Неверный маршрут пилота.');
   for(const [key,numbers] of Object.entries(ranges)){
     const lines=data.getIn([key,'lines']);
     if(!lines||lines.size!==numbers.length) throw new Error('Нарушено число абзацев: '+key);
     lines.forEach((line,index)=>{
       if(Number(line.get('number'))!==numbers[index]) throw new Error('Нарушена нумерация: '+key);
     });
   }
   const blanks=data.get('preservedBlankLines');
   if(!blanks||blanks.size!==2||Number(blanks.getIn([0,'number']))!==45||Number(blanks.getIn([1,'number']))!==53) throw new Error('Нарушена сохранность пустых строк.');
   for(const key of ['rooms','leadership']){
     const src=data.getIn([key,'replacement','src']);
     if(src && !String(src).startsWith('/media/r11-pilot/')) throw new Error('Фотографию следует загрузить через редактор.');
   }
 }});
}
