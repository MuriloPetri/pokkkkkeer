import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do Poker Range Trainer. Leia as condicoes de uso da nossa ferramenta educacional de poker.",
}

export default function TermosPage() {
  return (
    <main className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground text-balance sm:text-4xl">
          Termos de Uso
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ultima atualizacao: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Aceitacao dos Termos</h2>
            <p>
              Ao acessar e usar o Poker Range Trainer, voce concorda com estes Termos de Uso. 
              Se voce nao concordar com qualquer parte destes termos, nao devera usar o site. 
              O uso continuado do site apos qualquer modificacao destes termos constitui aceitacao 
              das alteracoes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. Descricao do Servico</h2>
            <p>
              O Poker Range Trainer e uma ferramenta educacional gratuita que fornece tabelas de 
              ranges preflop de poker e um modo de treino interativo. O servico e oferecido "como 
              esta" e "conforme disponivel", sem garantias de qualquer tipo, expressas ou implicitas.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Natureza Educacional</h2>
            <p>
              Todo o conteudo disponibilizado no Poker Range Trainer tem finalidade exclusivamente 
              educacional e informativa. Os ranges e estrategias apresentados sao diretrizes gerais 
              baseadas em teoria do jogo e nao garantem resultados financeiros positivos no poker. 
              O desempenho em jogos reais depende de diversos fatores, incluindo habilidade, 
              experiencia e variancia.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Uso Permitido</h2>
            <p>Voce concorda em usar o Poker Range Trainer apenas para fins legais e de acordo com estes Termos. Voce nao deve:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 list-disc marker:text-primary">
              <li>Usar o servico de qualquer forma que viole leis locais, estaduais, nacionais ou internacionais aplicaveis.</li>
              <li>Tentar acessar, interferir ou danificar qualquer parte do site ou seus sistemas.</li>
              <li>Reproduzir, duplicar, copiar ou revender qualquer parte do servico sem autorizacao expressa.</li>
              <li>Usar ferramentas automatizadas para acessar ou coletar dados do site.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteudo do Poker Range Trainer, incluindo textos, graficos, logos, icones, 
              imagens e software, e propriedade do Poker Range Trainer ou de seus licenciadores e 
              e protegido por leis de direitos autorais. O uso nao autorizado de qualquer material 
              do site e estritamente proibido.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Isencao de Responsabilidade</h2>
            <p>
              O Poker Range Trainer nao e um site de apostas e nao oferece jogos a dinheiro real. 
              Nao nos responsabilizamos por quaisquer perdas financeiras decorrentes do uso das 
              informacoes disponibilizadas no site. As decisoes de jogo sao de inteira responsabilidade 
              do usuario. Incentivamos o jogo responsavel e o cumprimento das leis locais sobre jogos de azar.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Publicidade</h2>
            <p>
              O Poker Range Trainer pode exibir anuncios fornecidos pelo Google AdSense e outros 
              parceiros de publicidade. Esses anuncios podem usar cookies e tecnologias semelhantes 
              para exibir anuncios relevantes. Ao usar o site, voce reconhece a presenca de anuncios 
              como parte do servico.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Modificacoes dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              As alteracoes entram em vigor imediatamente apos a publicacao no site. E sua 
              responsabilidade revisar periodicamente estes termos. O uso continuado do site 
              apos alteracoes constitui aceitacao dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">9. Lei Aplicavel</h2>
            <p>
              Estes Termos de Uso sao regidos pelas leis da Republica Federativa do Brasil. 
              Qualquer disputa relacionada a estes termos sera submetida ao foro da comarca 
              do domicilio do usuario.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
