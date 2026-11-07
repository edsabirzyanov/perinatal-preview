function registerPilotHooks(CMS) {
  const sourceSuffixes = { 8: ' ', 21: ' ', 26: ' ', 31: '\u00a0', 32: '\u00a0' };
  CMS.registerEventListener({
    name: 'preSave',
    handler: ({ entry }) => {
      if (entry.get('collection') === 'pilot' && entry.get('slug') === 'r30') {
        let data = entry.get('data');
        for (const key of ['src', 'alt', 'caption', 'source']) data = data.set(key, data.get(key) ?? '');
        if (data.get('src') && ['alt', 'caption', 'source'].some(key => !data.get(key)?.trim())) {
          throw new Error('Complete alternative text, caption and source before saving the photograph.');
        }
        return entry.set('data', data);
      }
      if (entry.get('collection') !== 'pilot' || entry.get('slug') !== 'r09') return;
      return entry.updateIn(['data', 'lines'], lines => lines.map(line =>
        line.update('text', text => text.trim() + (sourceSuffixes[line.get('number')] || '')),
      ));
    },
  });
}
