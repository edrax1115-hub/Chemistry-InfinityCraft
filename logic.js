(() => {
const refs={
  board:document.getElementById('board'),
  openToolbarBtn:document.getElementById('openToolbar'),
  toolbar:document.getElementById('toolbar'),
  elementGrid:document.getElementById('elementGrid'),
  search:document.getElementById('search'),
  clearBoardBtn:document.getElementById('clearBoard'),
  notif:document.getElementById('notif')
};
let spawned=[],nodeId=0;

function notify(msg,ms=1000){const el=refs.notif;if(!el)return;el.textContent=msg;el.style.display='block';clearTimeout(notify._t);notify._t=setTimeout(()=>el.style.display='none',ms);}
function renderToolbar(){refs.elementGrid.innerHTML='';const q=(refs.search.value||'').toLowerCase();for(const it of items){if(q&&!it.sym.toLowerCase().includes(q)&&!it.name.toLowerCase().includes(q))continue;const el=document.createElement('div');el.className='elem';el.innerHTML=`<div>${it.emoji}<div style="font-size:12px;">${it.sym}</div></div>`;el.addEventListener('click',()=>spawnNode(it));refs.elementGrid.appendChild(el);}}
function spawnNode(item){const node=document.createElement('div');node.className='node';node.textContent=item.emoji||item.sym;node.dataset.sym=item.sym;const br=refs.board.getBoundingClientRect();node.style.left=(br.width/2-36)+'px';node.style.top=(br.height/2-36)+'px';refs.board.appendChild(node);enableDrag(node);spawned.push(node);}
function enableDrag(node){let active=false,pid=null,ox=0,oy=0;node.addEventListener('pointerdown',ev=>{node.setPointerCapture(ev.pointerId);active=true;pid=ev.pointerId;const r=node.getBoundingClientRect();const br=refs.board.getBoundingClientRect();ox=ev.clientX-r.left;oy=ev.clientY-r.top;});node.addEventListener('pointermove',ev=>{if(!active||ev.pointerId!==pid)return;const br=refs.board.getBoundingClientRect();let x=ev.clientX-br.left-ox,y=ev.clientY-br.top-oy;node.style.left=x+'px';node.style.top=y+'px';});node.addEventListener('pointerup',ev=>{if(ev.pointerId!==pid)return;active=false;pid=null;checkCombine(node);});}
function findRecipe(a,b){for(const r of recipes){if(r.inputs.includes(a)&&r.inputs.includes(b))return r.output;}return null;}
function checkCombine(node){const r1=node.getBoundingClientRect();for(const other of spawned.slice()){if(other===node)continue;const r2=other.getBoundingClientRect();const overlap=!(r1.right<r2.left||r1.left>r2.right||r1.bottom<r2.top||r1.top>r2.bottom);if(overlap){const res=findRecipe(node.dataset.sym,other.dataset.sym);if(res){node.remove();other.remove();spawned=spawned.filter(n=>n!==node&&n!==other);const prod={sym:res,emoji:'✨',name:res,category:'Compounds'};spawnNode(prod);notify('Created '+res);return;}}}}refs.openToolbarBtn.addEventListener('click',()=>refs.toolbar.classList.toggle('open'));refs.clearBoardBtn.addEventListener('click',()=>{spawned.forEach(n=>n.remove());spawned=[];notify('Cleared');});refs.search.addEventListener('input',renderToolbar);renderToolbar();
})();