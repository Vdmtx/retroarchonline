const state={games:[],system:"all",query:""};
const labels={all:"Todos",capcom:"Capcom",midway:"Midway",neogeo:"Neo Geo"};
const grid=document.querySelector("#game-grid");
const count=document.querySelector("#result-count");
const notice=document.querySelector("#notice");
const filters=document.querySelector("#filters");

function formatSize(bytes){return new Intl.NumberFormat("pt-BR",{style:"unit",unit:"megabyte",maximumFractionDigits:bytes<10_000_000?1:0}).format(bytes/1048576)}
function safe(text){const node=document.createElement("span");node.textContent=text;return node.innerHTML}
function visibleGames(){const q=state.query.trim().toLocaleLowerCase("pt-BR");return state.games.filter(g=>(state.system==="all"||g.system===state.system)&&(!q||g.title.toLocaleLowerCase("pt-BR").includes(q)||g.id.includes(q)))}
function render(){const games=visibleGames();count.textContent=`${games.length} ${games.length===1?"jogo":"jogos"}`;grid.innerHTML=games.length?games.map(g=>`<a class="game-card" href="player.html?id=${encodeURIComponent(g.id)}"><div><div class="game-top"><span class="system-tag">${safe(labels[g.system]||g.system)}</span><span class="game-icon" aria-hidden="true">◆</span></div><h3>${safe(g.title)}</h3></div><div class="game-meta"><span>${formatSize(g.size)}</span><span>Jogar →</span></div></a>`).join(""):`<p class="empty">Nenhum jogo encontrado com esse filtro.</p>`}
function setupFilters(){const systems=["all",...new Set(state.games.map(g=>g.system))];filters.innerHTML=systems.map((system,i)=>`<button class="filter" type="button" data-system="${system}" aria-pressed="${i===0}">${labels[system]||system}</button>`).join("");filters.addEventListener("click",event=>{const button=event.target.closest("button");if(!button)return;state.system=button.dataset.system;filters.querySelectorAll("button").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));render()})}
document.querySelector("#search").addEventListener("input",event=>{state.query=event.target.value;render()});
fetch("catalog.json",{cache:"no-store"}).then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()}).then(data=>{state.games=data.games;setupFilters();render()}).catch(error=>{console.error(error);count.textContent="Indisponível";notice.hidden=false;notice.textContent="O catálogo não pôde ser carregado. Atualize a página e tente novamente."});
