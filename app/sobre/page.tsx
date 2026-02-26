import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nos",
  description: "Conheca o Poker Range Trainer, uma ferramenta educacional gratuita para estudar e treinar ranges preflop de poker.",
}

export default function SobrePage() {
  return (
    <main className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground text-balance sm:text-4xl">
          Sobre o Poker Range Trainer
        </h1>

        <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Nossa Missao</h2>
            <p>
              O Poker Range Trainer nasceu com o objetivo de democratizar o acesso a educacao de poker 
              de qualidade. Acreditamos que todo jogador, independente do seu nivel, deve ter acesso a 
              ferramentas de estudo eficientes e gratuitas para melhorar suas habilidades no poker.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">O que Oferecemos</h2>
            <p>
              Somos uma plataforma educacional focada em ranges preflop de poker Texas {"Hold'em"}. 
              Nossa ferramenta oferece:
            </p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 list-disc marker:text-primary">
              <li>
                <strong className="text-foreground">Tabelas de ranges interativas</strong> - Visualize as maos recomendadas 
                para cada posicao e cenario em formatos 6-Max, 9-Max e Heads-Up.
              </li>
              <li>
                <strong className="text-foreground">Modo de treino com feedback</strong> - Pratique suas decisoes preflop 
                com maos aleatorias e receba feedback instantaneo sobre cada escolha.
              </li>
              <li>
                <strong className="text-foreground">Conteudo educacional</strong> - Guias detalhados sobre conceitos 
                fundamentais de poker, posicoes na mesa, e estrategias preflop.
              </li>
              <li>
                <strong className="text-foreground">Acompanhamento de progresso</strong> - Monitore sua taxa de acerto 
                e identifique areas que precisam de mais estudo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Metodologia</h2>
            <p>
              Os ranges disponibilizados na nossa ferramenta sao baseados em estrategias GTO (Game Theory 
              Optimal) simplificadas, amplamente aceitas pela comunidade de poker. Eles representam uma base 
              solida para jogadores de cash game online em niveis micro a medio, podendo ser ajustados 
              conforme o jogador ganha experiencia e conhecimento sobre seus oponentes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Jogo Responsavel</h2>
            <p>
              O Poker Range Trainer e uma ferramenta exclusivamente educacional. Nao somos um site de 
              apostas e nao oferecemos qualquer tipo de jogo a dinheiro real. Incentivamos todos os 
              jogadores a praticarem o jogo responsavel e a respeitarem as leis locais sobre jogos 
              de azar. Se voce ou alguem proximo enfrenta problemas com jogo compulsivo, procure 
              ajuda profissional.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Contato</h2>
            <p>
              Se voce tem duvidas, sugestoes ou encontrou algum problema na ferramenta, entre em contato 
              conosco. Estamos sempre abertos a feedback da comunidade para melhorar a experiencia de 
              todos os usuarios.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
