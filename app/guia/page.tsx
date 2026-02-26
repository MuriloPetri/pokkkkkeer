import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Crosshair } from "lucide-react"

export const metadata: Metadata = {
  title: "Guia Completo de Ranges Preflop de Poker",
  description: "Guia educacional completo sobre ranges preflop de poker. Aprenda sobre posicoes, tipos de maos, estrategias de abertura, 3-bet, defesa de blinds e muito mais.",
}

export default function GuiaPage() {
  return (
    <main className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground text-balance sm:text-4xl">
          Guia Completo de Ranges Preflop de Poker
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Neste guia, voce vai aprender tudo sobre ranges preflop de poker Texas {"Hold'em"}. 
          Desde os conceitos basicos ate estrategias avancadas, este e o recurso completo para 
          melhorar suas decisoes antes do flop.
        </p>

        {/* Table of Contents */}
        <nav className="mt-8 rounded-xl border border-border bg-card p-6" aria-label="Indice do conteudo">
          <h2 className="text-base font-semibold text-foreground">Indice</h2>
          <ol className="mt-3 flex flex-col gap-2 pl-6 list-decimal marker:text-primary marker:font-medium">
            <li><a href="#o-que-sao-ranges" className="text-sm text-primary hover:underline">O que sao Ranges de Poker?</a></li>
            <li><a href="#posicoes" className="text-sm text-primary hover:underline">Posicoes na Mesa de Poker</a></li>
            <li><a href="#tipos-de-maos" className="text-sm text-primary hover:underline">Tipos de Maos no Poker</a></li>
            <li><a href="#ranges" className="text-sm text-primary hover:underline">Como Ler uma Tabela de Ranges</a></li>
            <li><a href="#rfi" className="text-sm text-primary hover:underline">Ranges de Abertura (RFI)</a></li>
            <li><a href="#3bet" className="text-sm text-primary hover:underline">Ranges de 3-Bet</a></li>
            <li><a href="#defesa" className="text-sm text-primary hover:underline">Defesa de Blinds</a></li>
            <li><a href="#estrategia" className="text-sm text-primary hover:underline">Estrategia Preflop por Posicao</a></li>
            <li><a href="#formatos" className="text-sm text-primary hover:underline">Diferencas entre Formatos de Mesa</a></li>
            <li><a href="#como-usar" className="text-sm text-primary hover:underline">Como Usar o Poker Range Trainer</a></li>
            <li><a href="#glossario" className="text-sm text-primary hover:underline">Glossario de Poker</a></li>
          </ol>
        </nav>

        <div className="mt-10 flex flex-col gap-10">
          {/* Section 1 */}
          <section id="o-que-sao-ranges">
            <h2 className="text-2xl font-bold text-foreground">1. O que sao Ranges de Poker?</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                No poker moderno, os jogadores mais bem-sucedidos nao tentam adivinhar a mao exata do 
                oponente. Em vez disso, eles pensam em termos de <strong className="text-foreground">ranges</strong> (faixas de maos) - 
                o conjunto completo de maos que um jogador poderia ter com base em suas acoes.
              </p>
              <p>
                Um range preflop e a lista de maos que voce deve jogar (ou nao) em uma determinada 
                situacao antes do flop. Essa lista muda com base em tres fatores principais:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li><strong className="text-foreground">Sua posicao na mesa</strong> - Posicoes finais permitem ranges mais amplos.</li>
                <li><strong className="text-foreground">A acao antes de voce</strong> - Se ninguem entrou no pote, se alguem deu raise, etc.</li>
                <li><strong className="text-foreground">O numero de jogadores</strong> - Mesas menores permitem ranges mais soltos.</li>
              </ul>
              <p>
                Pensar em ranges e fundamental porque reduz a complexidade das decisoes. Em vez de 
                debater internamente se deve jogar uma mao especifica em uma situacao, voce consulta 
                o range previamente definido e toma a decisao correta de forma consistente.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="posicoes">
            <h2 className="text-2xl font-bold text-foreground">2. Posicoes na Mesa de Poker</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                A posicao e um dos conceitos mais importantes do poker. Ela determina a ordem em que 
                os jogadores agem e, consequentemente, quanta informacao voce tera disponivel antes de 
                tomar uma decisao.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Posicoes em Mesa 6-Max</h3>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <dl className="flex flex-col gap-3">
                  <div>
                    <dt className="text-sm font-semibold text-foreground">UTG (Under the Gun)</dt>
                    <dd className="text-sm">Primeiro a agir. Range mais apertado (~15-18% das maos). Precisa de maos fortes porque ainda ha 5 jogadores para agir depois.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">MP (Middle Position)</dt>
                    <dd className="text-sm">Segundo a agir. Range um pouco mais amplo (~18-22%). Ainda conservador, mas com mais flexibilidade que o UTG.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">CO (Cutoff)</dt>
                    <dd className="text-sm">Terceiro a agir. Range bastante amplo (~25-30%). Boa posicao para roubar os blinds e jogar potes em posicao.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">BTN (Botao)</dt>
                    <dd className="text-sm">A melhor posicao da mesa. Range muito amplo (~40-50%). Sempre age por ultimo no pos-flop, a grande vantagem.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">SB (Small Blind)</dt>
                    <dd className="text-sm">Aposta obrigatoria. Range amplo (~35-45%) porque so falta o BB. Porem, estara fora de posicao no pos-flop.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">BB (Big Blind)</dt>
                    <dd className="text-sm">Ultima posicao a agir preflop. Defende com um range muito amplo porque ja tem dinheiro investido no pote.</dd>
                  </div>
                </dl>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-foreground">Posicoes Adicionais em Mesa 9-Max</h3>
              <p>
                Em mesas com 9 jogadores, tres posicoes adicionais sao incluidas entre o UTG e o CO:
              </p>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <dl className="flex flex-col gap-3">
                  <div>
                    <dt className="text-sm font-semibold text-foreground">UTG+1 e UTG+2</dt>
                    <dd className="text-sm">Posicoes logo apos o UTG. Ranges muito similares ao UTG, ligeiramente mais amplos conforme se aproximam do meio da mesa.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">LJ (Lojack)</dt>
                    <dd className="text-sm">Equivalente ao UTG do 6-Max em termos de range relativo. Comeca a abrir com ranges intermediarios.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">HJ (Hijack)</dt>
                    <dd className="text-sm">Similar ao MP do 6-Max. Ja pode jogar com ranges mais amplos, preparando-se para as posicoes finais.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="tipos-de-maos">
            <h2 className="text-2xl font-bold text-foreground">3. Tipos de Maos no Poker</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                No Texas {"Hold'em"}, cada jogador recebe duas cartas fechadas. Essas duas cartas podem 
                ser classificadas em tres categorias:
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-base font-semibold text-foreground">Pocket Pairs (Pares)</h3>
                  <p className="mt-2 text-sm">
                    Duas cartas do mesmo valor: AA, KK, QQ, JJ, TT, 99, 88, 77, 66, 55, 44, 33, 22. 
                    Sao representados na diagonal da tabela de ranges. Pares altos (AA-TT) sao maos 
                    premium; pares medios e baixos dependem da posicao e situacao.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-base font-semibold text-foreground">Suited (Mesmo Naipe)</h3>
                  <p className="mt-2 text-sm">
                    Duas cartas de naipes iguais, como A{"♠"}K{"♠"} (AKs). Aparecem acima da diagonal na 
                    tabela. Maos suited tem ~3% mais equity que suas versoes offsuit porque podem 
                    formar flushes. Isso faz diferenca significativa nos ranges.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-base font-semibold text-foreground">Offsuit (Naipes Diferentes)</h3>
                  <p className="mt-2 text-sm">
                    Duas cartas de naipes distintos, como A{"♠"}K{"♥"} (AKo). Aparecem abaixo da diagonal. 
                    Sao mais fracas que a versao suited e por isso aparecem em menos ranges. Apenas as 
                    combinacoes mais fortes (AKo, AQo) entram nos ranges mais apertados.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground">Hierarquia das Maos Iniciais</h3>
              <p>
                De forma simplificada, as maos iniciais do poker podem ser classificadas da seguinte forma, 
                das mais fortes para as mais fracas:
              </p>
              <ol className="flex flex-col gap-2 pl-6 list-decimal marker:text-primary">
                <li><strong className="text-foreground">Pares altos</strong> - AA, KK, QQ, JJ, TT. Quase sempre raise ou 4-bet.</li>
                <li><strong className="text-foreground">Broadway suited</strong> - AKs, AQs, AJs, KQs. Maos fortes com bom potencial de flushes e straights.</li>
                <li><strong className="text-foreground">Broadway offsuit</strong> - AKo, AQo, AJo, KQo. Boas maos mas sem a vantagem de serem suited.</li>
                <li><strong className="text-foreground">Pares medios</strong> - 99, 88, 77. Fortes para set mining e jogaveis em maioria das posicoes.</li>
                <li><strong className="text-foreground">Conectores suited</strong> - JTs, T9s, 98s, 87s. Maos especulativas com potencial de straights e flushes.</li>
                <li><strong className="text-foreground">Ases suited</strong> - A5s, A4s, A3s, A2s. Uteis como blefe em 3-bet por terem blocker de As e potencial de flush.</li>
                <li><strong className="text-foreground">Pares baixos e conectores fracos</strong> - 66-22, 76s, 65s. Jogaveis em posicoes finais ou contra aberturas tardias.</li>
              </ol>
            </div>
          </section>

          {/* Section 4 */}
          <section id="ranges">
            <h2 className="text-2xl font-bold text-foreground">4. Como Ler uma Tabela de Ranges</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                A tabela de ranges e uma grade 13x13 que representa todas as 169 combinacoes unicas 
                de maos iniciais do poker. Aqui esta como interpreta-la:
              </p>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">Estrutura da Tabela</h3>
                <ul className="mt-3 flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                  <li>As linhas e colunas representam as 13 cartas, de A (As) ate 2.</li>
                  <li>A <strong className="text-foreground">diagonal principal</strong> (canto superior esquerdo ao inferior direito) mostra os pares: AA, KK, QQ, etc.</li>
                  <li><strong className="text-foreground">Acima da diagonal</strong>: maos suited (mesmo naipe). Ex: AKs na intersecao da linha A com a coluna K.</li>
                  <li><strong className="text-foreground">Abaixo da diagonal</strong>: maos offsuit (naipes diferentes). Ex: AKo na intersecao da linha K com a coluna A.</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">Codigo de Cores</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-8 rounded bg-[oklch(0.72_0.19_160)]" />
                    <span className="text-sm"><strong className="text-foreground">Verde</strong> - Raise/Abrir a mao</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-8 rounded bg-[oklch(0.75_0.15_55)]" />
                    <span className="text-sm"><strong className="text-foreground">Amarelo</strong> - 3-Bet (re-raise)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-8 rounded bg-[oklch(0.6_0.15_250)]" />
                    <span className="text-sm"><strong className="text-foreground">Azul</strong> - Call/Pagar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-8 rounded bg-[oklch(0.25_0.01_260)]" />
                    <span className="text-sm"><strong className="text-foreground">Cinza escuro</strong> - Fold/Desistir</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="rfi">
            <h2 className="text-2xl font-bold text-foreground">5. Ranges de Abertura (RFI)</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                RFI (Raise First In) e a situacao mais basica e frequente do poker preflop: voce e o 
                primeiro a entrar no pote com um raise. Nenhum outro jogador abriu antes de voce (folds 
                nao contam como "entrar").
              </p>
              <p>
                Os ranges de RFI sao o ponto de partida para qualquer estrategia preflop solida. Se voce 
                errar seus ranges de abertura, todos os cenarios subsequentes (3-bet, defesa, etc.) serao 
                afetados negativamente.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Principios do RFI</h3>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li><strong className="text-foreground">Posicoes iniciais</strong>: Abra apenas com maos premium. No UTG de uma mesa 6-Max, um range tipico inclui pares altos (AA-77), broadway suited (AKs-KTs) e algumas maos offsuit fortes (AKo, AQo).</li>
                <li><strong className="text-foreground">Posicoes intermediarias</strong>: Adicione mais maos especulativas como conectores suited e ases suited pequenos.</li>
                <li><strong className="text-foreground">Posicoes finais</strong>: Abra com ranges significativamente mais amplos. No BTN, voce pode abrir com 40-50% das maos.</li>
                <li><strong className="text-foreground">Small Blind</strong>: Range amplo porque so falta o BB, mas lembre que estara fora de posicao no pos-flop.</li>
                <li><strong className="text-foreground">Big Blind</strong>: Nao abre (ja tem aposta obrigatoria), mas defende com um range amplo contra raises.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="3bet">
            <h2 className="text-2xl font-bold text-foreground">6. Ranges de 3-Bet</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                O 3-bet e o re-raise preflop - quando um jogador abre com raise e voce faz um raise maior. 
                E uma das jogadas mais poderosas do poker preflop e seu range de 3-bet deve ser cuidadosamente 
                construido.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Estrutura do Range de 3-Bet</h3>
              <p>Um range de 3-bet equilibrado tem dois componentes:</p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>
                  <strong className="text-foreground">3-bet por valor</strong> - Maos fortes que querem construir um pote grande: AA, KK, QQ, AKs, AKo e, em posicoes finais, JJ, AQs, etc.
                </li>
                <li>
                  <strong className="text-foreground">3-bet como blefe</strong> - Maos com potencial mas que nao sao fortes o suficiente para call: A5s, A4s, A3s (ases suited pequenos que funcionam como blockers e tem potencial de flush).
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">Quando 3-bet e Quando Call</h3>
              <p>
                Maos como JJ, TT, AQs e KQs estao em uma zona cinzenta. A decisao entre 3-bet e call 
                depende da posicao do abridor, da sua posicao e das tendencias do oponente. Em geral:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>Contra abertura de posicoes iniciais: prefira call com essas maos (o range do abridor e forte).</li>
                <li>Contra abertura de posicoes finais: 3-bet e mais lucrativo (o range do abridor e mais fraco).</li>
                <li>Em posicao (BTN vs CO, por exemplo): call tambem e viavel pela vantagem posicional.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="defesa">
            <h2 className="text-2xl font-bold text-foreground">7. Defesa de Blinds</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                A defesa de blinds e uma das situacoes mais comuns e importantes do poker. Como o BB (Big Blind) 
                ja tem dinheiro investido no pote, matematicamente faz sentido defender com um range amplo contra 
                raises, especialmente de posicoes finais.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Defesa do Big Blind</h3>
              <p>
                O BB e a posicao que mais defende preflop. Contra um raise do BTN em mesa 6-Max, o BB pode 
                defender com 40-50% das maos, incluindo:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>Todos os pares</li>
                <li>A maioria das maos suited (incluindo conectores e gappers)</li>
                <li>Broadway offsuit (AJo+, KJo+, QJo+)</li>
                <li>Conectores offsuit altos (JTo, T9o)</li>
              </ul>
              <p>
                Contra raises de posicoes iniciais (UTG), o range de defesa e muito mais apertado, ja que 
                o range do abridor e mais forte.
              </p>

              <h3 className="text-lg font-semibold text-foreground">3-Bet do Big Blind</h3>
              <p>
                Alem de dar call, o BB tambem deve ter um range de 3-bet que inclui maos premium por valor 
                (AA, KK, QQ, AKs) e alguns blefes com ases suited pequenos. A frequencia de 3-bet aumenta 
                conforme o raise vem de posicoes mais tardias.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="estrategia">
            <h2 className="text-2xl font-bold text-foreground">8. Estrategia Preflop por Posicao</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                A estrategia preflop correta varia drasticamente conforme a posicao. Aqui esta um resumo 
                pratico das diretrizes para cada posicao em mesa 6-Max:
              </p>

              <div className="flex flex-col gap-4">
                <StrategyCard
                  position="UTG"
                  openPercent="~15%"
                  strategy="Abra apenas com maos premium. Pares altos, broadway suited fortes, e AKo/AQo. Nao inclua maos especulativas - elas nao tem lucro suficiente fora de posicao contra tantos jogadores."
                />
                <StrategyCard
                  position="MP"
                  openPercent="~20%"
                  strategy="Ligeiramente mais amplo que UTG. Adicione 66, mais ases suited, e alguns conectores como T9s e 98s. Ainda conservador, mas com mais opcoes de maos especulativas."
                />
                <StrategyCard
                  position="CO"
                  openPercent="~27%"
                  strategy="Salto significativo na amplitude. Inclua pares ate 55, todos os ases suited, conectores suited ate 43s, e broadway offsuit como AJo e KQo. O CO e onde o range comeca a se abrir."
                />
                <StrategyCard
                  position="BTN"
                  openPercent="~45%"
                  strategy="O range mais amplo de RFI. Todos os pares, todos os ases suited e offsuit decentes, broadway offsuit, conectores suited amplos, e ate maos como 87o e 76o. A vantagem posicional justifica."
                />
                <StrategyCard
                  position="SB"
                  openPercent="~40%"
                  strategy="Range amplo, similar ao BTN, mas voce estara fora de posicao contra o BB. Muitos jogadores preferem aumentar o tamanho do raise no SB (3x ou mais) para compensar a desvantagem posicional."
                />
                <StrategyCard
                  position="BB"
                  openPercent="Defende"
                  strategy="Nao abre (ja apostou). Defende com range amplo contra raises tardios e apertado contra raises iniciais. O 3-bet range inclui maos premium e blefes com ases suited pequenos."
                />
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="formatos">
            <h2 className="text-2xl font-bold text-foreground">9. Diferencas entre Formatos de Mesa</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">6-Max vs 9-Max</h3>
              <p>
                A principal diferenca entre 6-Max e 9-Max e que a mesa cheia tem tres posicoes adicionais 
                (UTG+1, UTG+2, LJ) antes do CO. Isso significa que:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>Os ranges iniciais no 9-Max sao mais apertados (mais jogadores para agir depois de voce).</li>
                <li>O UTG do 9-Max abre com ~12% das maos, contra ~15% do UTG no 6-Max.</li>
                <li>As posicoes finais (CO, BTN, SB) tem ranges semelhantes em ambos os formatos.</li>
                <li>O 9-Max requer mais paciencia e disciplina nas posicoes iniciais.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">Heads-Up</h3>
              <p>
                O Heads-Up (1 contra 1) e radicalmente diferente dos outros formatos:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>O BTN/SB abre com mais de 70% das maos - praticamente qualquer mao com algum potencial.</li>
                <li>O BB defende com a grande maioria das maos, incluindo muitas que seriam fold em outros formatos.</li>
                <li>A agressividade e essencial - dar fold demais e extremamente exploitavel.</li>
                <li>Ajustes contra o oponente especifico sao mais importantes do que em qualquer outro formato.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="como-usar">
            <h2 className="text-2xl font-bold text-foreground">10. Como Usar o Poker Range Trainer</h2>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                O Poker Range Trainer oferece dois modos principais: visualizacao de tabelas e modo de treino. 
                Aqui esta como aproveitar ao maximo cada recurso:
              </p>

              <h3 className="text-lg font-semibold text-foreground">Modo Tabelas</h3>
              <ol className="flex flex-col gap-2 pl-6 list-decimal marker:text-primary">
                <li>Selecione o formato de mesa (6-Max, 9-Max ou Heads-Up) na barra superior.</li>
                <li>Clique na posicao desejada na mesa visual interativa.</li>
                <li>Escolha o cenario: RFI (abrir), contra raises ou contra 3-bet.</li>
                <li>A tabela 13x13 mostrara as maos coloridas por acao recomendada.</li>
                <li>Passe o mouse sobre cada celula para ver o nome da mao e a acao.</li>
              </ol>

              <h3 className="text-lg font-semibold text-foreground">Modo Treino</h3>
              <ol className="flex flex-col gap-2 pl-6 list-decimal marker:text-primary">
                <li>Selecione a posicao e o cenario que deseja praticar.</li>
                <li>Uma mao aleatoria sera apresentada com cartas visuais.</li>
                <li>Escolha a acao que voce acha correta (raise, call, fold, etc.).</li>
                <li>Receba feedback instantaneo - verde para acerto, vermelho para erro com a resposta correta.</li>
                <li>Acompanhe sua taxa de acerto e tente melhorar sua sequencia!</li>
              </ol>

              <h3 className="text-lg font-semibold text-foreground">Dicas de Estudo</h3>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>Comece pelo RFI - e o cenario mais basico e frequente.</li>
                <li>Foque em uma posicao por vez ate atingir 80%+ de acerto.</li>
                <li>Depois domine os cenarios de 3-bet e defesa de blinds.</li>
                <li>Treine regularmente - a memorizacao vem com a repeticao.</li>
                <li>Preste atencao nos erros - eles revelam onde voce precisa estudar mais.</li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section id="glossario">
            <h2 className="text-2xl font-bold text-foreground">11. Glossario de Poker</h2>
            <div className="mt-4">
              <dl className="flex flex-col gap-4">
                <GlossaryItem term="Range" definition="Conjunto de maos que um jogador pode ter em determinada situacao. Pensar em ranges e fundamental no poker moderno." />
                <GlossaryItem term="RFI (Raise First In)" definition="Abrir o pote com um raise quando ninguem entrou antes. E o cenario preflop mais basico." />
                <GlossaryItem term="3-Bet" definition="O segundo raise preflop. Quando alguem abre com raise e voce faz um re-raise." />
                <GlossaryItem term="4-Bet" definition="O terceiro raise preflop. Resposta a um 3-bet com um raise ainda maior." />
                <GlossaryItem term="Fold" definition="Desistir da mao, abandonando qualquer aposta ja feita." />
                <GlossaryItem term="Call" definition="Pagar a aposta do oponente sem aumentar." />
                <GlossaryItem term="Suited" definition="Maos onde ambas as cartas sao do mesmo naipe (ex: A♠K♠). Indicadas com 's' na notacao." />
                <GlossaryItem term="Offsuit" definition="Maos onde as cartas sao de naipes diferentes (ex: A♠K♥). Indicadas com 'o' na notacao." />
                <GlossaryItem term="Pocket Pair" definition="Par de cartas na mao inicial (ex: AA, KK, 77). Representados na diagonal da tabela de ranges." />
                <GlossaryItem term="Broadway" definition="Cartas altas: A, K, Q, J, T. Maos broadway sao combinacoes dessas cartas." />
                <GlossaryItem term="Conector" definition="Duas cartas consecutivas (ex: JTs, T9s). Conectores suited tem bom potencial de straights e flushes." />
                <GlossaryItem term="GTO" definition="Game Theory Optimal - estrategia baseada na teoria dos jogos que e inexploitavel pelo oponente." />
                <GlossaryItem term="Equity" definition="A porcentagem de vezes que sua mao venceria contra o range do oponente se todas as cartas fossem reveladas." />
                <GlossaryItem term="Posicao" definition="Seu lugar na mesa em relacao ao dealer/botao. Determina a ordem de acao e influencia as decisoes." />
                <GlossaryItem term="Blocker" definition="Uma carta na sua mao que reduz a probabilidade do oponente ter determinada mao. Ex: ter um As bloqueia AA do oponente." />
                <GlossaryItem term="Set Mining" definition="Jogar um par pequeno com o objetivo de acertar uma trinca (set) no flop." />
                <GlossaryItem term="Blind" definition="Aposta obrigatoria feita pelos dois jogadores a esquerda do dealer antes das cartas serem distribuidas." />
                <GlossaryItem term="Preflop" definition="A fase do jogo antes das cartas comunitarias serem reveladas, quando cada jogador tem apenas suas duas cartas fechadas." />
              </dl>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-bold text-foreground">Pronto para Colocar em Pratica?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Agora que voce entende os conceitos, use nossa ferramenta para treinar e memorizar os ranges.
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/treinar"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Crosshair className="h-4 w-4" />
              Abrir o Treinador
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}

function StrategyCard({ position, openPercent, strategy }: { position: string; openPercent: string; strategy: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-primary px-2 py-1 text-xs font-mono font-bold text-primary-foreground">{position}</span>
        <span className="text-xs text-muted-foreground">Abertura: {openPercent}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{strategy}</p>
    </div>
  )
}

function GlossaryItem({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
      <dt className="text-sm font-semibold text-foreground">{term}</dt>
      <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{definition}</dd>
    </div>
  )
}
