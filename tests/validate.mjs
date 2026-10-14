import fs from "node:fs";
const required=["index.html","player.html","assets/styles.css","assets/app.js","catalog.json"];
for(const file of required){if(!fs.existsSync(file))throw new Error(`Arquivo obrigatório ausente: ${file}`)}
const index=fs.readFileSync("index.html","utf8"),player=fs.readFileSync("player.html","utf8"),styles=fs.readFileSync("assets/styles.css","utf8"),app=fs.readFileSync("assets/app.js","utf8");
const catalog=JSON.parse(fs.readFileSync("catalog.json","utf8"));
if(!index.includes('name="viewport"')||!player.includes('name="viewport"'))throw new Error("Viewport móvel ausente");
if(!player.includes("https://cdn.emulatorjs.org/stable/data/"))throw new Error("EmulatorJS não usa o canal estável");
if(!player.includes("EJS_cacheConfig={enabled:false")||!player.includes("EJS_disableLocalStorage=true"))throw new Error("Player permite armazenamento persistente");
if(!player.includes("EJS_onGameStart=()=>revealGame()")||!player.includes("Mostrar jogo")||!styles.includes(".player-message[hidden]"))throw new Error("Player não possui proteção para liberar a tela após iniciar");
if(player.includes("game.children.length>0"))throw new Error("Player libera a tela antes do jogo iniciar");
if(!player.includes('selected.system==="neogeo"')||!player.includes('EJS_gameParentUrl="neogeo.zip"')||!player.includes("EJS_dontExtractBIOS=true"))throw new Error("Conjunto-pai do Neo Geo não está preservado para o FBNeo");
if(player.includes("EJS_gameParentUrl=new URL(selected.bios")||player.includes("EJS_biosUrl=new URL(selected.bios"))throw new Error("Player ainda extrai o conjunto-pai do Neo Geo");
if(!player.includes("EJS_VirtualGamepadSettings=["))throw new Error("Controle arcade móvel personalizado ausente");
for(let button=1;button<=6;button++)if(!player.includes(`id:"arcade-${button}"`))throw new Error(`Botão arcade ${button} ausente`);
if(!player.includes('text:"Ficha",id:"select"')||!player.includes('text:"Start",id:"start"'))throw new Error("Ficha ou Start ausente do controle móvel");
if([index,player,app].some(text=>text.includes("api.github.com")||text.includes("/latest/data/")))throw new Error("Dependência instável detectada");
if(!Array.isArray(catalog.games)||catalog.games.length<1)throw new Error("Catálogo vazio");
if(!fs.existsSync("neogeo.zip")||fs.statSync("neogeo.zip").size<1000000)throw new Error("Conjunto-pai neogeo.zip ausente ou incompleto na raiz");
const ids=new Set(),paths=new Set();
for(const game of catalog.games){if(!game.id||!game.title||!game.system||!game.core||!game.path||!game.size)throw new Error(`Entrada incompleta: ${JSON.stringify(game)}`);if(ids.has(game.id))throw new Error(`ID duplicado: ${game.id}`);ids.add(game.id);if(paths.has(game.path))throw new Error(`Caminho duplicado: ${game.path}`);paths.add(game.path);if(!fs.existsSync(game.path))throw new Error(`ROM ausente: ${game.path}`);if(fs.statSync(game.path).size<65536)throw new Error(`Arquivo inválido ou incompleto: ${game.path}`);if(game.bios&&!fs.existsSync(game.bios))throw new Error(`BIOS ausente: ${game.bios}`)}
const allowedCores=new Set(["fbneo","fbalpha2012_cps1","fbalpha2012_cps2","mame2003_plus"]);
for(const game of catalog.games)if(!allowedCores.has(game.core))throw new Error(`Núcleo desconhecido: ${game.core}`);
console.log(`Validação concluída: ${catalog.games.length} jogos, interface móvel e caminhos íntegros.`);
