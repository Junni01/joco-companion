import test from 'node:test';
import assert from 'node:assert/strict';
import {IDS,REGIONS} from '../dist/model.js';
import {TRADE_ROUTES,BORDERS,elephantPlacement} from '../dist/map-geometry.js';
test('Elephant uses an actual shared boundary in both directions for every neighbouring pair',()=>{
 const vertices=id=>[...REGIONS[id].path.matchAll(/(-?\d+) (-?\d+)/g)].map(m=>[+m[1],+m[2]]);
 for(const from of IDS)for(const to of REGIONS[from].neighbors){
  const [a,b]=BORDERS[[from,to].sort().join(':')];
  for(const id of [from,to]){const points=vertices(id);assert(points.some(p=>p[0]===a[0]&&p[1]===a[1]),`${id} missing border start`);assert(points.some(p=>p[0]===b[0]&&p[1]===b[1]),`${id} missing border end`);}
  const forward=elephantPlacement(from,to),reverse=elephantPlacement(to,from);
  assert.equal(forward.x,(a[0]+b[0])/2);assert.equal(forward.y,(a[1]+b[1])/2);
  assert.equal(forward.x,reverse.x);assert.equal(forward.y,reverse.y);
  assert(Math.abs(forward.dx+reverse.dx)<1e-10);assert(Math.abs(forward.dy+reverse.dy)<1e-10);
 }
 assert.equal(elephantPlacement('maratha',null).inside,true);

});
test('printed routes connect all orders, including Bombay north directly to south',()=>{
 const orders=IDS.flatMap(id=>REGIONS[id].orders.map(([id])=>id)),seen=new Set();
 for(const [a,b] of TRADE_ROUTES){assert(orders.includes(a));assert(orders.includes(b));seen.add(a);seen.add(b);}
 assert.equal(seen.size,17);assert.equal(TRADE_ROUTES.length,20);
 assert(TRADE_ROUTES.some(([a,b])=>a==='bo3n'&&b==='bo4'));
 assert(!TRADE_ROUTES.some(([a,b])=>[a,b].includes('bo3n')&&[a,b].includes('bo3s')));
});
