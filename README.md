# Arcade Vault

Interface estática e mobile-first para a coleção pessoal do repositório.

## Estrutura

- `index.html`: catálogo único, sem consultas à API do GitHub.
- `catalog.json`: fonte controlada dos jogos exibidos.
- `player.html`: player único com EmulatorJS no canal `stable`.
- `tests/validate.mjs`: verifica catálogo, arquivos, viewport e dependências.

Arquivos menores que 64 KiB não entram no catálogo porque são atalhos ou uploads incompletos, não ROMs utilizáveis. O fluxo automático impede que referências ausentes sejam publicadas silenciosamente.

## Teste

```bash
node tests/validate.mjs
```
