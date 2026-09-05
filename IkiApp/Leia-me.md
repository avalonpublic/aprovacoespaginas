# Methz — Design System SaaS

**Status:** Pronto (estrutura estática · DNA Impilo / marca Pulso). Motion fino: passe Matheus + Cursor.

**Primeira vez no Cofre?** Abra [`../../COMECE-AQUI.md`](../../COMECE-AQUI.md) (7 passos). Depois volte aqui se quiser ir além.

Este arquivo é o **manual do comprador**. Escolha só a seção do seu nível e siga.
Não precisa de Figma, Framer nem IDE — uma IA conversacional (ChatGPT, Claude, Gemini, etc.) basta.

O motor técnico está no arquivo **`PROMPT-MESTRE.md`** (na raiz do Cofre).
Este `Leia-me` diz **como** usar. O Prompt Mestre diz **as regras** que a IA deve obedecer.

---

## O que tem (ou terá) nesta pasta

| Arquivo / pasta | Pra quê |
|-----------------|--------|
| `Leia-me.md` | Este guia (você está aqui) |
| `index.html` | Biblioteca do Design System (seções combináveis) |
| `style.css` | Visual do sistema |
| `variables.css` | Cores e fontes em um só lugar (fácil de personalizar) |
| `motion.js` | Interações (menu, animações leves) |
| `SECTIONS.md` | Mapa das seções (`data-section`) pra embaralhar |
| `Assets/` | Fotos, vídeos e mapa do que trocar |
| `DESIGN.md` + `tokens.json` + `theme.css` | DNA de fábrica (uso avançado / criação) |
| `_reference/` | Refs internas Methz — **não faz parte do uso do comprador** |

---

## Qual seção ler?

| Seu perfil | Vá para |
|------------|---------|
| Quero uma página da minha marca o mais rápido possível | **PARA INICIANTES** |
| Quero combinar seções e variar layout entre clientes | **PARA INTERMEDIÁRIOS** |
| Quero domínio total (tokens, DNA, várias LPs, qualidade) | **PARA AVANÇADOS** |

---

## PARA INICIANTES

Objetivo: sair com **uma landing page** com a sua marca, oferta e cores — abrindo no navegador.

### Passo a passo

1. Abra a sua IA favorita (chat no navegador).
2. Anexe / cole nesta ordem:
   1. o arquivo **`PROMPT-MESTRE.md`** (raiz do Cofre)
   2. este setor: **`index.html`**
   3. **`style.css`**
   4. **`variables.css`** (se existir)
3. Na mesma mensagem, cole o **brief** abaixo (preenchido):

```text
Use o Prompt Mestre Methz e personalize o Design System SaaS em anexo.

SETOR: SaaS
MARCA:
TOM: (ex.: premium, direto, acolhedor)
PÚBLICO:
OFERTA / CTA PRINCIPAL:
PREÇO (se houver):
CORES (hex) ou "criar paleta do setor":
FONTES (ou manter template):
PROVAS / DEPOIMENTOS: (ou "inventar placeholders claros")
LINKS (site, WhatsApp, checkout):
MÍDIA: (vou trocar depois / ou descreva o que colocar)

Regras:
- Manter o DNA do template (ritmo, hierarquia, funil)
- Página COLORIDA e premium (nada de cinza genérico)
- Escolher 6–12 seções coerentes com a oferta
- Entregar HTML/CSS completos + lista do que mudou + TODOs
```

4. Peça: **"Devolva os arquivos completos prontos pra eu salvar e abrir no Chrome."**
5. Salve a resposta como `index.html` (e o CSS se vier separado) numa pasta nova.
6. Troque fotos em `Assets/images/` (veja `Assets/README.md`) e ajuste links.
7. Publique (Vercel, Netlify, hospedagem que preferir) ou use o bump de deploy do Cofre, se tiver.

### Dica de iniciante
Se a IA “cortar” o arquivo, diga: **“Continue do ponto em que parou, sem resumir o código.”**  
Se ainda falhar, peça só `variables.css` + copy primeiro; depois peça o HTML completo em partes (`<!-- parte 1/3 -->`).

---

## PARA INTERMEDIÁRIOS

Objetivo: **milhares de combinações** — mesma DNA visual, LPs diferentes por cliente.

### Passo a passo

1. Leia `SECTIONS.md` e escolha **6–12** seções da tabela de LP.
2. Alterne ritmo claro ↔ escuro; inclua pelo menos 1 prova, 1 oferta/CTA e idealmente FAQ.
3. Na IA, anexe: `PROMPT-MESTRE.md` + `SECTIONS.md` + `index.html` + `style.css` + `variables.css`.
4. No brief, acrescente:

```text
COMBINAÇÃO DE SEÇÕES (nesta ordem):
1. …
2. …
…
Não invente seções fora do SECTIONS.md. Preserve classes CSS; troque copy, data-asset e tokens.
```

5. Peça uma LP enxuta (só as seções escolhidas), não a biblioteca spec inteira — a menos que queira o showcase.
6. Gere **variantes**: mesma marca, outra ordem de seções / outro hero — um chat por variante.
7. Troque mídia por `data-asset` conforme `Assets/README.md`.

### Checklist intermediário
- [ ] 6–12 seções, ordem única por cliente
- [ ] Paleta da marca em `variables.css` (ou `:root`)
- [ ] CTAs com destino real
- [ ] Mobile ok ao abrir no celular

---

## PARA AVANÇADOS

Objetivo: tratar o setor como **sistema** — tokens, autoria, escala e qualidade de engenharia.

### Passo a passo

1. Domine o contrato do `PROMPT-MESTRE.md` (seções 1, 2.1, 5–7, 14).
2. Use o DNA Refero quando for **evoluir** o sistema (fábrica):
   - `DESIGN.md` · `tokens.json` · `variables.css` · `theme.css`
3. Personalização cirúrgica:
   - tokens primeiro (`variables.css`)
   - depois copy e `data-section`
   - por último `motion.js` / microinterações
4. Peça à IA **diff mental, entrega completa**: arquivos finais íntegros + changelog curto + `TODO:`.
5. Higiene de assets (padrão Methz):
   - CSS/JS fora de blocos gigantes inline
   - SVG com `currentColor` fica inline; SVG só hex pode ir pra arquivo
   - imports no `<head>` comentados (o que cada arquivo faz)
6. Monte pipelines: seed LP (6–8 seções) + biblioteca completa no `index` de referência.
7. Não redistribua `_reference/` nem clone pixel a pixel sites de terceiros — o pack é autoral.

### Aceite avançado (antes de entregar ao cliente)
- [ ] Parece o setor SaaS, não um template genérico
- [ ] Contraste AA em texto e CTA
- [ ] Funil intacto (hero → prova → oferta → FAQ → CTA)
- [ ] Sem Figma/Framer/obrigatoriedade de build
- [ ] TODOs explícitos onde faltou dado real

---

## Problemas comuns

| Sintoma | O que fazer |
|---------|-------------|
| IA resume o HTML | “Arquivo completo, sem omitir seções. Continue na próxima mensagem.” |
| Página cinza / sem vida | Reforçar regra de cor plena do Prompt Mestre + hex da marca |
| Layout quebrou | “Preserve classes e grid do CSS original; só altere tokens e textos.” |
| Mesma LP pra todo mundo | Usar fluxo **Intermediários** + nova ordem em `SECTIONS.md` |
| Imagem quebrada | Conferir caminhos em `Assets/` e `data-asset` |

---

## Precisa de ajuda humana?

Suporte Methz: **methz@avalonx8.com** · Instagram **@methz.br** · **methz.com.br**

_Avalon Creative Studio — Methz, o Cofre de Conversão_
