import Link from "next/link"
import { Crosshair, BookOpen, GraduationCap, Users, TrendingUp, Target, ArrowRight, BarChart3, Layers } from "lucide-react"

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
              Domine os Ranges de Poker Preflop e Tome Decisoes Melhores
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              Ferramenta gratuita e interativa para estudar tabelas de ranges preflop. 
              Treine suas decisoes em mesas 6-Max, 9-Max e Heads-Up com exercicios 
              praticos e melhore sua taxa de vitoria.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/treinar"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Crosshair className="h-4 w-4" />
                Comecar a Treinar
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/guia"
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <GraduationCap className="h-4 w-4" />
                Ler o Guia Completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
              Tudo o que Voce Precisa para Estudar Ranges
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Nossa ferramenta foi desenvolvida para ajudar jogadores de todos os niveis 
              a entender e memorizar ranges preflop de forma eficiente.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Tabelas de Ranges Interativas"
              description="Visualize as tabelas de ranges 13x13 com cores intuitivas para cada acao: raise, call, 3-bet e fold. Identifique rapidamente quais maos jogar em cada situacao."
            />
            <FeatureCard
              icon={<Target className="h-5 w-5" />}
              title="Modo de Treino com Feedback"
              description="Pratique suas decisoes preflop com maos aleatorias e receba feedback instantaneo. Acompanhe sua precisao e evolua seu jogo com exercicios repetitivos."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Suporte a Multiplos Formatos"
              description="Ranges otimizados para mesas 6-Max (mais popular), 9-Max (mesa cheia) e Heads-Up. Cada formato tem ajustes especificos para cada posicao."
            />
            <FeatureCard
              icon={<Layers className="h-5 w-5" />}
              title="Cenarios Reais de Jogo"
              description="Estude tres cenarios fundamentais: RFI (primeira entrada no pote), defesa contra raises e resposta a 3-bets. Cubra as situacoes mais comuns do poker."
            />
            <FeatureCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Acompanhamento de Progresso"
              description="Monitore sua taxa de acerto, sequencia de respostas corretas e historico de jogadas. Identifique seus pontos fracos e foque neles para melhorar."
            />
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Guia Educacional Completo"
              description="Aprenda os conceitos fundamentais de ranges preflop, posicoes na mesa, tipos de maos e estrategias basicas no nosso guia detalhado para iniciantes e intermediarios."
            />
          </div>
        </div>
      </section>

      {/* Content Section - What are Ranges */}
      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
              O que sao Ranges de Poker?
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                No poker, um <strong className="text-foreground">range</strong> (ou faixa de maos) representa o conjunto 
                de maos que um jogador pode ter em uma determinada situacao. Em vez de tentar adivinhar a mao exata 
                do oponente, jogadores experientes pensam em termos de ranges - todas as combinacoes possiveis que 
                fazem sentido com as acoes do oponente.
              </p>
              <p>
                Os <strong className="text-foreground">ranges preflop</strong> sao as tabelas que definem quais maos 
                voce deve jogar (raise, call ou fold) antes das cartas comunitarias serem reveladas. Eles variam 
                de acordo com sua posicao na mesa, o numero de jogadores, e o que aconteceu antes da sua vez.
              </p>
              <p>
                Memorizar e aplicar ranges preflop corretamente e um dos pilares fundamentais para se tornar um 
                jogador lucrativo. Jogadores que seguem ranges solidos cometem menos erros e exploram melhor as 
                posicoes mais vantajosas na mesa.
              </p>
            </div>

            <h3 className="mt-10 text-xl font-bold text-foreground">
              Por que as Posicoes Importam?
            </h3>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                A posicao na mesa de poker e um dos fatores mais importantes na escolha de quais maos jogar. 
                Jogadores em posicoes finais (como o Botao e o Cutoff) tem a vantagem de agir por ultimo 
                no pos-flop, o que significa que eles podem ver as acoes dos oponentes antes de tomar decisoes.
              </p>
              <p>
                Por isso, os ranges nas posicoes finais sao significativamente mais amplos do que nas posicoes 
                iniciais. Por exemplo, no UTG (Under the Gun) de uma mesa 6-Max, um range tipico de abertura 
                inclui cerca de 15-18% das maos, enquanto no Botao esse numero sobe para 40-50%.
              </p>
            </div>

            <h3 className="mt-10 text-xl font-bold text-foreground">
              Como Ler a Tabela de Ranges
            </h3>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                As tabelas de ranges sao representadas em uma grade 13x13, onde cada celula corresponde a uma 
                combinacao de maos. As linhas e colunas representam as 13 cartas do baralho, de As (A) ate Dois (2):
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc marker:text-primary">
                <li>
                  <strong className="text-foreground">Diagonal principal</strong> - Pares de cartas (pocket pairs): AA, KK, QQ, JJ, etc.
                </li>
                <li>
                  <strong className="text-foreground">Acima da diagonal</strong> - Maos do mesmo naipe (suited): AKs, AQs, KJs, etc. O {"'s'"} indica que as duas cartas sao do mesmo naipe.
                </li>
                <li>
                  <strong className="text-foreground">Abaixo da diagonal</strong> - Maos de naipes diferentes (offsuit): AKo, KQo, etc. O {"'o'"} indica naipes diferentes.
                </li>
              </ul>
              <p>
                As cores das celulas indicam a acao recomendada: verde para raise/abrir, amarelo para 3-bet, 
                azul para call/pagar, e cinza escuro para fold/desistir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table Sizes Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
              Ranges para Cada Formato de Mesa
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Cada formato de mesa exige ajustes nos ranges. Entenda as diferencas e adapte seu jogo.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <TableFormatCard
              title="6-Max"
              players="6 jogadores"
              description="O formato mais popular no poker online. Com 6 posicoes (UTG, MP, CO, BTN, SB, BB), os ranges sao moderadamente amplos. A acao e rapida e a agressividade e valorizada. Ideal para quem gosta de mais acao e menos espera."
              positions={["UTG", "MP", "CO", "BTN", "SB", "BB"]}
              highlight="Mais popular online"
            />
            <TableFormatCard
              title="9-Max (Mesa Cheia)"
              players="9 jogadores"
              description="O formato classico do poker, com 9 posicoes incluindo Lojack e Hijack. Os ranges iniciais sao mais apertados, ja que ha mais jogadores para agir depois de voce. Exige mais paciencia e disciplina, especialmente nas posicoes iniciais."
              positions={["UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO", "BTN", "SB", "BB"]}
              highlight="Formato classico"
            />
            <TableFormatCard
              title="Heads-Up"
              players="2 jogadores"
              description="O duelo um contra um do poker. Os ranges sao extremamente amplos - o Botao/SB abre com mais de 70% das maos. E o formato que mais testa habilidades de leitura e ajuste. Requer agressividade constante e adaptacao ao oponente."
              positions={["BTN/SB", "BB"]}
              highlight="Mais agressivo"
            />
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
              Como Usar o Poker Range Trainer
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Siga estes passos simples para comecar a melhorar seu jogo preflop.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step={1}
              title="Escolha o Formato"
              description="Selecione o tipo de mesa que voce joga: 6-Max, 9-Max ou Heads-Up. Cada formato tem ranges especificos."
            />
            <StepCard
              step={2}
              title="Selecione a Posicao"
              description="Clique na posicao que deseja estudar. A tabela de ranges sera atualizada para mostrar as maos recomendadas."
            />
            <StepCard
              step={3}
              title="Estude os Cenarios"
              description="Alterne entre RFI (abrir), contra raises e contra 3-bets para entender como agir em cada situacao."
            />
            <StepCard
              step={4}
              title="Pratique no Treino"
              description="Use o modo de treino para testar seus conhecimentos com maos aleatorias e receber feedback em tempo real."
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/treinar"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Crosshair className="h-4 w-4" />
              Comecar a Treinar Agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-balance text-center sm:text-3xl">
            Perguntas Frequentes
          </h2>

          <div className="mt-10 flex flex-col gap-6">
            <FaqItem
              question="O que e RFI no poker?"
              answer="RFI significa 'Raise First In' - ou seja, e quando voce e o primeiro jogador a entrar no pote com um raise. Os ranges de RFI definem quais maos voce deve abrir com raise quando ninguem antes de voce entrou no pote. E o cenario preflop mais basico e importante para dominar."
            />
            <FaqItem
              question="Qual a diferenca entre suited e offsuit?"
              answer="Maos 'suited' (indicadas com 's') sao aquelas onde as duas cartas sao do mesmo naipe, como As de espadas e Rei de espadas (AKs). Maos 'offsuit' (indicadas com 'o') tem cartas de naipes diferentes. Maos suited tem mais valor porque podem formar flushes, por isso aparecem mais nos ranges."
            />
            <FaqItem
              question="Por que os ranges mudam conforme a posicao?"
              answer="A posicao determina quando voce age no pos-flop. Quem age por ultimo (posicoes finais como BTN e CO) tem mais informacao sobre as acoes dos oponentes, o que permite jogar mais maos de forma lucrativa. Posicoes iniciais (UTG) exigem maos mais fortes porque ha mais jogadores para agir depois."
            />
            <FaqItem
              question="Esses ranges sao para qualquer nivel de jogo?"
              answer="Esses ranges sao baseados em estrategias GTO (Game Theory Optimal) simplificadas, adequadas para a maioria dos jogos de cash game online de niveis micro a medio. Em niveis mais altos, ajustes mais finos sao necessarios. Para torneios, os ranges tambem podem variar dependendo do ICM e da estrutura de blinds."
            />
            <FaqItem
              question="Preciso memorizar todos os ranges?"
              answer="Nao e necessario memorizar cada mao individualmente. O mais importante e entender os principios: posicoes finais jogam mais maos, maos suited e conectadas tem mais valor, e pares altos sao sempre jogaveis. Com o treino repetitivo na nossa ferramenta, a memorizacao acontece naturalmente."
            />
            <FaqItem
              question="O que e um 3-bet no poker?"
              answer="Um 3-bet e o segundo raise preflop. Quando um jogador abre com raise (2-bet) e outro jogador faz um re-raise, isso e chamado de 3-bet. E uma jogada agressiva que pode ser feita tanto por valor (com maos fortes) quanto como blefe (com maos que tem potencial, como As suited pequeno)."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
            Pronto para Melhorar seu Jogo?
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Comece a treinar seus ranges preflop agora mesmo. E 100% gratuito, 
            sem necessidade de cadastro, e funciona em qualquer dispositivo.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/treinar"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Crosshair className="h-4 w-4" />
              Abrir o Treinador
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guia"
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <GraduationCap className="h-4 w-4" />
              Ler o Guia Completo
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function TableFormatCard({
  title,
  players,
  description,
  positions,
  highlight,
}: {
  title: string
  players: string
  description: string
  positions: string[]
  highlight: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{highlight}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{players}</p>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {positions.map((pos) => (
          <span key={pos} className="rounded-md bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">
            {pos}
          </span>
        ))}
      </div>
    </div>
  )
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {step}
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-base font-semibold text-foreground">{question}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  )
}
