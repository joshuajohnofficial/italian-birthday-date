const $=id=>document.getElementById(id);
const yes=$('yes'),sad=$('sad'),heart=$('heart');
let count=0,following=false,active='invite',heartTimer=null,heartAvailable=false,lastSpot=-1;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
function stopFollow(){following=false;yes.removeAttribute('style');}
function show(id){stopFollow();active=id;for(const s of document.querySelectorAll('.screen'))s.hidden=s.id!==id;window.scrollTo({top:0,behavior:'instant'});const heading=$(id).querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
setTimeout(()=>{if(active==='invite'&&fine&&!reduced&&!sad.open){following=true;$('hint').textContent='Even the Yes is drawn to you. ♡';}},1500);
document.addEventListener('pointermove',e=>{if(!following||sad.open||active!=='invite')return;const rect=$('no').getBoundingClientRect();if(e.clientX>rect.left-25&&e.clientX<rect.right+25&&e.clientY>rect.top-25&&e.clientY<rect.bottom+25)return;yes.style.position='fixed';yes.style.zIndex=10;yes.style.left=Math.max(8,Math.min(innerWidth-yes.offsetWidth-8,e.clientX-yes.offsetWidth/2))+'px';yes.style.top=Math.max(8,Math.min(innerHeight-yes.offsetHeight-8,e.clientY-yes.offsetHeight/2))+'px';});
yes.addEventListener('focus',()=>{if(yes.matches(':focus-visible'))stopFollow();});
$('no').onclick=()=>{stopFollow();sad.showModal();};
function closeSad(){sad.close();yes.focus();}
$('reconsider').onclick=closeSad;sad.querySelector('.close').onclick=closeSad;
sad.addEventListener('click',e=>{if(e.target===sad){const r=sad.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSad();}});
const spots=[[.12,.14],[.70,.62],[.33,.47],[.73,.13],[.10,.65],[.47,.15]];
function hideHeart(){heartAvailable=false;heart.disabled=true;heart.style.opacity='0';heart.style.pointerEvents='none';}
function queueHeart(){clearTimeout(heartTimer);hideHeart();heartTimer=setTimeout(spawnHeart,150);}
function spawnHeart(){
 if(active!=='game')return;
 let spot=Math.floor(Math.random()*(spots.length-1));
 if(spot>=lastSpot)spot++;
 if(lastSpot<0)spot=Math.floor(Math.random()*spots.length);
 lastSpot=spot;
 const [x,y]=spots[spot];
 heart.style.left=x*($('garden').clientWidth-70)+'px';
 heart.style.top=y*($('garden').clientHeight-70)+'px';
 heart.style.opacity='1';heart.style.pointerEvents='auto';heart.disabled=false;heartAvailable=true;
 heart.setAttribute('aria-label','Catch heart '+(count+1));
 heartTimer=setTimeout(queueHeart,700);
}
function startGame(){clearTimeout(heartTimer);count=0;lastSpot=-1;$('score').textContent='0 / 7 hearts';show('game');spawnHeart();}
yes.onclick=startGame;
heart.onclick=()=>{
 if(active!=='game'||!heartAvailable)return;
 clearTimeout(heartTimer);hideHeart();count++;$('score').textContent=count+' / 7 hearts';
 if(count===7){show('reveal');celebrate();return;}
 queueHeart();
};
function celebrate(){if(reduced)return;for(let i=0;i<24;i++){const p=document.createElement('span');p.className='confetti';p.textContent=i%3?'♥':'✦';p.style.left=Math.random()*100+'vw';p.style.animationDelay=Math.random()*.8+'s';p.style.color=i%2?'#9e3037':'#a4a275';document.body.append(p);setTimeout(()=>p.remove(),4000);}}
$('replay').onclick=startGame;
window.addEventListener('resize',stopFollow);
