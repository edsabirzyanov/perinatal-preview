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

function assert(condition, message) { if (!condition) throw Error(message); }
function canonical(value) {
  return Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
}
function equal(value, expected, message) { assert(JSON.stringify(canonical(value)) === JSON.stringify(canonical(expected)), message); }

// Identity/provenance stays immutable; the editor changes only existing text fields.
function validateNumberedSource(value, baseline) {
  const { lines, ...metadata } = value;
  const { lines: originalLines, ...originalMetadata } = baseline;
  equal(metadata, originalMetadata, 'Source provenance/metadata changed');
  assert(Array.isArray(lines) && lines.length === originalLines.length, 'Source line count changed');
  lines.forEach((line, index) => {
    const { text, ...identity } = line;
    const { text: original, ...originalIdentity } = originalLines[index];
    equal(identity, originalIdentity, 'Source line identity/order changed');
    equal(typeof text, 'string', 'Plain source text required');
    assert(text.length <= 12000 && !text.includes('\u0000'), 'Invalid source text');
    if (!original.trim()) equal(text, original, 'Protected empty line changed');
    else {
      equal(text.match(/^\s*/u)[0], original.match(/^\s*/u)[0], 'Leading whitespace changed');
      equal(text.match(/\s*$/u)[0], original.match(/\s*$/u)[0], 'Trailing whitespace changed');
      assert(text.trim(), 'Existing source paragraph cannot be emptied');
    }
  });
  return value;
}

function registerEditorialValidation(CMS) {
  registerR11Validation(CMS);
  const baselines = {"R04":{"code":"R04","documentId":"1qMaqjuRXSlQ97yUaLwFcC1Cmu9YAo7n0kZ9kH9ZiCAQ","revisionId":"AHj4eMTGgDtB6bEFMnPpvklqGvmZ6scT18OD25CRIO_9TdAvTGfjaZSVZWnQlnWoAy6D8dnHVpWaUF4vcneEipPlHcmqCKwkdQ-8p753oGI","tabId":"t.8x38frjdb1l","primaryDocumentId":"1j8aWe1HP9F0_MMwRXKrbsgRixvXpw9afC9CoJZu-DSw","status":"STRUCTURE / PROPOSED / NOT OWNER-APPROVED","lines":[{"number":1,"startIndex":362,"text":"В 2026-м году Перинатальный центр Пушкинской клинической больницы им. проф. В.Н. Розанова отмечает свое 10-летие. Однако история родовспоможения на Пушкинской земле насчитывает уже более ста лет."},{"number":2,"startIndex":558,"text":"📜 1913-1930: с чего всё начиналось"},{"number":3,"startIndex":594,"text":"В 1913 году на арендованном дачном участке открылась первая земская амбулатория. Год спустя заработал стационар на 10 коек."},{"number":4,"startIndex":718,"text":"Акушерское отделение долгое время состояло всего из двух коек в хирургии, позже их число увеличили до пяти. Отделение располагалось в деревянном здании бывшей дачи. Кроватей Рахманова не было, стены были оклеены обоями, а родовая комната покрашена клеевой краской. Зато подготовке кадров уделяли серьёзное внимание - при больнице работала фельдшерско-акушерская школа, выпустившая за три года 226 специалистов."},{"number":5,"startIndex":1129,"text":"📜 1930-1960: становление и признание"},{"number":6,"startIndex":1167,"text":"В 1930 году главврачом и заведующим родильным отделением назначили Михаила Ткаченко. Провели реконструкцию: появились детская палата, изолятор и родовая, стены оштукатурили. Отделение выросло до 15 коек."},{"number":7,"startIndex":1371,"text":"Результат не заставил ждать: если в 1930 году приняли 200 родов, то в 1931-м - уже 400. В 1936 году отделение перевели в хирургический корпус, увеличив до 50 коек."},{"number":8,"startIndex":1535,"text":"С 1937 по 1941 год Пушкинское родильное отделение служило официальной учебной базой для врачей-акушеров Московской области."},{"number":9,"startIndex":1659,"text":"📜 1964-2016: свой дом на 60 коек"},{"number":10,"startIndex":1693,"text":"В 1964 году для родильного отделения построили отдельное двухэтажное здание на 60 коек. Здесь работали легендарные заведующие: Ефремова, Крапалина, Филиппас, Кублицкая, Емельянова, Панфилова. Этот роддом принимал рожениц больше полувека - вплоть до 2016 года."},{"number":11,"startIndex":1953,"text":"📜 2016: рождение нового центра"},{"number":12,"startIndex":1985,"text":"20 мая 2016 года открылся новый родильный дом на 110 мест. Уже в первые дни здесь приняли около 30 родов."},{"number":13,"startIndex":2091,"text":"10 лет работы: подведем итоги"},{"number":14,"startIndex":2121,"text":"За десятилетие в центре принято около 25 тысяч родов. Среди них более 200 двоен и около 300 родов после ЭКО."},{"number":15,"startIndex":2230,"text":"Десятки малышей с весом менее 1000 граммов и еще больше весом до 1500 граммов получили свой шанс на жизнь и благополучное будущее. Немало в истории центра и самых «крошечных историй», когда малыши весом менее (!) 500 грамм были спасены и выхожены, благодаря высочайшему профессионализму и чуткости наших специалистов."},{"number":16,"startIndex":2548,"text":"Отделение реанимации новорождённых - место, где реализуется уникальная практика совместного пребывания матери и ребёнка. За 10 лет здесь получили помощь примерно 3,5 тысячи новорождённых, из них почти 1800 недоношенных."},{"number":17,"startIndex":2768,"text":"Признание: победы и заслуженная награда"},{"number":18,"startIndex":2808,"text":"🔸В 2019 году Пушкинский родильный дом признали лучшим в Московской области. "},{"number":19,"startIndex":2886,"text":"🔸В 2020 году он вошёл в топ-10 государственных клиник региона по версии премии «ПРОДОКТОРОВ»."},{"number":20,"startIndex":2981,"text":"🔸А в декабре 2025 года весь коллектив Перинатального центра был удостоен Почётной грамоты Министерства здравоохранения Московской области. Награда вручена «за добросовестный труд в области здравоохранения, высокий профессионализм и достигнутые успехи в медицинском обслуживании детского населения Московской области»."},{"number":21,"startIndex":3300,"text":"Эта грамота - закономерный итог года, посвящённого труду, росту и заботе о жизни. Она принадлежит каждому, кто встречает новую жизнь, поддерживает маму, выхаживает малыша и создаёт ту самую атмосферу доверия."},{"number":22,"startIndex":3509,"text":"Вековые традиции - современные возможности"},{"number":23,"startIndex":3552,"text":"Но главное не награды. Главное - что больше века назад первые роды в Пушкино принимали в деревянных дачах с обоями на стенах, а сегодня - в современном центре, где есть всё для безопасности мамы и ребёнка. И за этими достижениями - больше ста лет непрерывной истории, десятки поколений врачей, акушерок и сотни тысяч новых жизней."}]}};
  CMS.registerEventListener({ name: 'preSave', handler: ({ entry }) => {
    if (entry.get('collection') !== 'source-texts') return;
    const data = entry.get('data').toJS();
    const baseline = baselines[data.code];
    if (!baseline) throw Error('Unknown source record');
    validateNumberedSource(data, baseline);
  }});
}

