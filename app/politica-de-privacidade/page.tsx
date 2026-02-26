import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politica de Privacidade",
  description: "Politica de privacidade do Poker Range Trainer. Saiba como coletamos, usamos e protegemos seus dados.",
}

export default function PrivacidadePage() {
  return (
    <main className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground text-balance sm:text-4xl">
          Politica de Privacidade
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ultima atualizacao: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Introducao</h2>
            <p>
              O Poker Range Trainer respeita a privacidade dos seus usuarios. Esta Politica de 
              Privacidade descreve como coletamos, usamos e protegemos as informacoes quando voce 
              utiliza nosso site. Ao usar o Poker Range Trainer, voce concorda com as praticas 
              descritas nesta politica.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. Informacoes que Coletamos</h2>
            <p>O Poker Range Trainer pode coletar os seguintes tipos de informacoes:</p>
            
            <h3 className="mt-4 mb-2 text-lg font-medium text-foreground">2.1 Dados de Uso</h3>
            <p>
              Coletamos automaticamente informacoes sobre como voce interage com o site, incluindo:
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-6 list-disc marker:text-primary">
              <li>Paginas visitadas e tempo de permanencia</li>
              <li>Tipo de navegador e sistema operacional</li>
              <li>Endereco IP (anonimizado quando possivel)</li>
              <li>Origem do trafego (de onde voce veio)</li>
              <li>Resolucao de tela e tipo de dispositivo</li>
            </ul>

            <h3 className="mt-4 mb-2 text-lg font-medium text-foreground">2.2 Cookies e Tecnologias Semelhantes</h3>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiencia no site e 
              para fins de publicidade. Os cookies podem ser classificados como:
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-6 list-disc marker:text-primary">
              <li><strong className="text-foreground">Cookies essenciais</strong> - Necessarios para o funcionamento basico do site.</li>
              <li><strong className="text-foreground">Cookies de desempenho</strong> - Ajudam a entender como os visitantes interagem com o site (por exemplo, Vercel Analytics).</li>
              <li><strong className="text-foreground">Cookies de publicidade</strong> - Utilizados pelo Google AdSense para exibir anuncios relevantes.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Como Usamos suas Informacoes</h2>
            <p>As informacoes coletadas sao utilizadas para:</p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-6 list-disc marker:text-primary">
              <li>Fornecer e manter o funcionamento do site</li>
              <li>Melhorar a experiencia do usuario e a qualidade do conteudo</li>
              <li>Analisar o uso do site e identificar tendencias</li>
              <li>Exibir anuncios relevantes atraves do Google AdSense</li>
              <li>Proteger contra uso indevido e garantir a seguranca do site</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Google AdSense e Publicidade</h2>
            <p>
              Utilizamos o Google AdSense para exibir anuncios no nosso site. O Google e seus 
              parceiros de publicidade podem usar cookies para exibir anuncios com base nas visitas 
              anteriores do usuario ao nosso site ou a outros sites na internet.
            </p>
            <p className="mt-3">
              O Google usa o cookie DART para exibir anuncios baseados na visita do usuario ao nosso 
              site e a outros sites na internet. Os usuarios podem desativar o uso do cookie DART 
              visitando a <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pagina de configuracoes de anuncios do Google</a>.
            </p>
            <p className="mt-3">
              Terceiros, incluindo o Google, usam cookies para veicular anuncios com base nas 
              visitas anteriores de um usuario ao nosso site. Voce pode optar por desativar a 
              publicidade personalizada visitando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Configuracoes de Anuncios</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Servicos de Analise</h2>
            <p>
              Utilizamos o Vercel Analytics para coletar dados anonimizados sobre o uso do site. 
              Esses dados nos ajudam a entender como os usuarios interagem com a ferramenta e a 
              identificar areas de melhoria. Os dados coletados sao anonimos e nao permitem a 
              identificacao individual de usuarios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Compartilhamento de Dados</h2>
            <p>
              Nao vendemos, alugamos ou compartilhamos suas informacoes pessoais com terceiros, 
              exceto nas seguintes situacoes:
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-6 list-disc marker:text-primary">
              <li>Com provedores de servicos que nos auxiliam na operacao do site (Google AdSense, Vercel Analytics)</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteger nossos direitos, propriedade ou seguranca</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Seguranca dos Dados</h2>
            <p>
              Implementamos medidas de seguranca tecnicas e organizacionais para proteger suas 
              informacoes contra acesso nao autorizado, alteracao, divulgacao ou destruicao. 
              No entanto, nenhum metodo de transmissao pela internet e 100% seguro, e nao 
              podemos garantir seguranca absoluta.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Seus Direitos</h2>
            <p>De acordo com a Lei Geral de Protecao de Dados (LGPD), voce tem direito a:</p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-6 list-disc marker:text-primary">
              <li>Acessar os dados pessoais que temos sobre voce</li>
              <li>Solicitar a correcao de dados incompletos ou imprecisos</li>
              <li>Solicitar a exclusao dos seus dados pessoais</li>
              <li>Revogar o consentimento para o processamento de dados</li>
              <li>Solicitar a portabilidade dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">9. Menores de Idade</h2>
            <p>
              O Poker Range Trainer nao e direcionado a menores de 18 anos. Nao coletamos 
              intencionalmente informacoes de menores. Se tomarmos conhecimento de que coletamos 
              dados de um menor, tomaremos medidas para remover essas informacoes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">10. Alteracoes nesta Politica</h2>
            <p>
              Podemos atualizar esta Politica de Privacidade periodicamente. Quaisquer alteracoes 
              serao publicadas nesta pagina com a data de atualizacao revisada. Recomendamos que 
              voce revise esta politica regularmente para se manter informado sobre como protegemos 
              seus dados.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
