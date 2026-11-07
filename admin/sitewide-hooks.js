function registerSitewideHooks(CMS) {
  let rules;
  const ready = fetch('./source-whitespace.json').then(response => {
    if (!response.ok) throw new Error('Не загружены правила сохранения исходных текстов.');
    return response.json();
  }).then(value => { rules = value; });
  CMS.registerEventListener({ name: 'preSave', handler: async ({ entry }) => {
    await ready;
    const collection = entry.get('collection');
    const slug = entry.get('slug');
    if (collection === 'sources') {
      const rule = rules.sources[slug];
      if (!rule) throw new Error('Неизвестный источник.');
      return entry.updateIn(['data', rule.arrayKey], lines => lines.map((line, index) => {
        const normalize = text => rule.whitespace[index].blank ? rule.whitespace[index].original : rule.whitespace[index].prefix + String(text ?? '').trim() + rule.whitespace[index].suffix;
        return rule.objects ? line.update('text', normalize) : normalize(line);
      }));
    }
    if (collection !== 'pages') return;
    let data = entry.get('data');
    const template = rules.templates[slug];
    if (!template) throw new Error('Неизвестная страница.');
    // Write defaults at leaves so optional blank fields serialize consistently.
    const defaults = (value, path) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, child] of Object.entries(value)) defaults(child, [...path, key]);
      } else if (data.getIn(path) == null) data = data.setIn(path, value);
    };
    defaults(template, []);
    const reset = path => {
      for (const [key, value] of Object.entries(template.verification)) data = data.setIn([...path, 'verification', key], value);
      for (const [key, value] of Object.entries(template.approval)) data = data.setIn([...path, 'approval', key], value);
    };
    reset([]);
    for (const key of Object.keys(template.gaps)) {
      reset(['gaps', key]);
      const gap = data.getIn(['gaps', key]);
      for (const [name, itemTemplate] of Object.entries(rules.items)) {
        const items = gap.get(name);
        if (!items?.forEach) continue;
        items.forEach((item, index) => {
          if (!item?.get) return;
          for (const [field, value] of Object.entries(itemTemplate)) if (item.get(field) == null) data = data.setIn(['gaps',key,name,index,field],value);
        });
      }
    }
    return entry.set('data', data);
  }});
}
