import { PokerTrainer } from "@/components/poker-trainer"
import { Trophy, Zap, ShieldCheck } from "lucide-react"

export default function Page() {
  return (
    <main className="flex flex-col items-center">

      {/* Ferramenta */}
      <PokerTrainer />

      {/* Conteúdo Editorial */}
      <section className="max-w-4xl mx-auto mt-20 px-6 space-y-8 text-left leading-relaxed">

        <h1 className="text-4xl font-bold">
          Guia Completo de Estratégia Preflop no Poker Texas Hold’em
        </h1>

        <p>
          Este site é destinado exclusivamente para fins educacionais sobre estratégia de poker.
          Não incentivamos jogos ilegais ou apostas irresponsáveis. O objetivo desta plataforma
          é ensinar fundamentos matemáticos e estratégicos do poker Texas Hold’em,
          ajudando jogadores a desenvolverem raciocínio lógico, disciplina e tomada de decisão baseada em probabilidade.
        </p>

        <p>
          O poker moderno é um jogo altamente estratégico. Jogadores vencedores não tomam decisões
          baseadas em intuição ou emoção, mas sim em ranges estruturados, matemática
          e vantagem posicional. Nesta página você encontrará um guia completo sobre
          como jogar corretamente no pré-flop.
        </p>

        <h2 className="text-2xl font-semibold">O que é Range Preflop?</h2>
        <p>
          Range preflop é o conjunto de mãos que um jogador decide jogar antes do flop.
          Em vez de pensar apenas na sua mão específica, jogadores experientes trabalham
          com intervalos de mãos possíveis.
        </p>

        <p>
          Por exemplo, ao abrir do UTG em uma mesa 6-max, você deve utilizar um range mais
          restrito, contendo mãos fortes como pares altos, AK, AQ e algumas combinações
          suited. Já no botão (BTN), seu range pode ser significativamente mais amplo.
        </p>

        <p>
          Trabalhar com ranges evita decisões emocionais e torna seu jogo matematicamente sólido.
        </p>

        <h2 className="text-2xl font-semibold">O que é RFI (Raise First In)?</h2>
        <p>
          RFI significa "Raise First In". É quando você é o primeiro jogador a entrar no pote
          realizando um aumento.
        </p>

        <p>
          O RFI depende fortemente da posição. Quanto mais tarde você estiver na ordem
          de ação, mais mãos pode abrir.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>UTG: range mais tight</li>
          <li>MP: range intermediário</li>
          <li>CO: range mais amplo</li>
          <li>BTN: range mais agressivo</li>
        </ul>

        <h2 className="text-2xl font-semibold">O que é 3-bet?</h2>
        <p>
          3-bet é o terceiro aumento em uma rodada de apostas.
          Se um jogador abre raise e outro aumenta novamente, esse segundo aumento é chamado de 3-bet.
        </p>

        <p>
          A 3-bet pode ser feita por valor (com mãos fortes) ou como blefe estratégico,
          principalmente em posições finais contra jogadores que abrem muitos potes.
        </p>

        <h2 className="text-2xl font-semibold">Importância da Posição no Poker</h2>
        <p>
          Posição é um dos conceitos mais importantes do poker.
          Jogadores em posição final têm vantagem porque agem depois dos adversários.
        </p>

        <p>
          Essa vantagem permite coletar mais informações antes de tomar uma decisão,
          aumentando sua taxa de sucesso.
        </p>

        <h2 className="text-2xl font-semibold">Como Usar o Treinador de Poker</h2>
        <p>
          Nosso treinador interativo foi desenvolvido para simular decisões reais
          de pré-flop em mesas 6-max e 9-max.
        </p>

        <p>
          Para utilizar:
        </p>

        <ol className="list-decimal pl-6 space-y-2">
          <li>Escolha o formato da mesa.</li>
          <li>Selecione sua posição.</li>
          <li>Defina a situação (RFI, contra raise, contra 3-bet).</li>
          <li>Analise as recomendações estratégicas.</li>
        </ol>

        <p>
          O objetivo é treinar repetição e memorização de ranges corretos,
          melhorando sua tomada de decisão em jogos reais.
        </p>

        <h2 className="text-2xl font-semibold">Estratégias para Iniciantes</h2>
        <p>
          Jogadores iniciantes devem focar em disciplina e consistência.
          Algumas recomendações:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Evite jogar mãos fracas fora de posição.</li>
          <li>Prefira ranges mais tight no início.</li>
          <li>Evite blefes excessivos.</li>
          <li>Priorize valor com mãos fortes.</li>
        </ul>

        <p>
          O poker é um jogo de longo prazo. Resultados consistentes vêm
          da aplicação correta de estratégia matemática e controle emocional.
        </p>

        <h2 className="text-2xl font-semibold">Conclusão</h2>
        <p>
          Dominar o jogo pré-flop é fundamental para se tornar um jogador lucrativo.
          Através de estudo estruturado e prática constante, é possível
          desenvolver um jogo sólido e competitivo.
        </p>

        <p>
          Continue utilizando nosso treinador regularmente para aprimorar sua compreensão
          de ranges e decisões estratégicas.
        </p>

      </section>


    </main>
  )
}

