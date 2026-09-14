import {load} from 'cheerio';
import {sources, officialPages} from '../content.js';
import snapshot from '../../company-snapshot.mjs';
import {disclosures} from '../disclosures.js';

const cache = new Map(Object.entries(snapshot).map(([id, data]) => [id, {time: Date.now(), data}]));

export const corpus = [
  ...sources.map(source => ({...source, text: ['shares', 'team'].includes(source.id) ? source.text : (snapshot[source.id]?.blocks?.join('\n') || source.text)})),
  ...disclosures,
  ...['governance', 'privacy', 'disclaimer'].map(id => ({id, title: snapshot[id].title, url: snapshot[id].url, text: snapshot[id].blocks.join('\n')}))
];

export async function companyPage(id) {
  if (id === 'shares') {
    const source = sources.find(item => item.id === id);
    return {title: source.title, url: source.url, blocks: [source.text], links: [], asOf: '2026-09'};
  }
  const page = officialPages.find(item => item[0] === id);
  if (!page) return null;
  const cached = cache.get(id);
  if (cached && Date.now() - cached.time < 3600000) return cached.data;
  const url = `https://www.graftonresources.com/${page[4]}`;
  try {
    const response = await fetch(url, {signal: AbortSignal.timeout(5000)});
    if (!response.ok) throw new Error('Source unavailable');
    const $ = load(await response.text());
    const main = $('main').first();
    main.find('script,style,nav,form,footer,noscript').remove();
    const blocks = main.find('h1,h2,h3,h4,h5,p,li').toArray().map(el => $(el).text().trim()).filter(Boolean);
    const links = main.find('a[href]').toArray().map(el => ({title: $(el).text().trim(), url: new URL($(el).attr('href'), url).href})).filter(item => item.title && /^https:\/\//.test(item.url));
    const data = {title: page[1], url, blocks: [...new Set(blocks)], links, asOf: new Date().toISOString()};
    cache.set(id, {time: Date.now(), data});
    return data;
  } catch {
    if (snapshot[id]) return snapshot[id];
    throw new Error('Company source unavailable');
  }
}
