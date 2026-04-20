
import { localizeHref, deLocalizeHref } from './src/lib/paraglide/runtime.js';

console.log('--- Testing Paraglide ---');
const paths = ['/', '/admin', '/en/', '/en/admin'];

paths.forEach(p => {
    console.log(`Path: ${p}`);
    console.log(`  deLocalizeHref: ${deLocalizeHref(p)}`);
    console.log(`  localizeHref (pt-br): ${localizeHref(p, { locale: 'pt-br' })}`);
    console.log(`  localizeHref (en): ${localizeHref(p, { locale: 'en' })}`);
    
    const de = deLocalizeHref(p);
    console.log(`  localizeHref(deLocalizeHref(p), pt-br): ${localizeHref(de, { locale: 'pt-br' })}`);
    console.log(`  localizeHref(deLocalizeHref(p), en): ${localizeHref(de, { locale: 'en' })}`);
});
