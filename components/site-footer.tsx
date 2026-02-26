import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground font-mono">P</span>
              </div>
              <span className="text-base font-bold text-foreground">Poker Range Trainer</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ferramenta gratuita para estudar e treinar ranges de poker preflop. 
              Aprenda a tomar decisoes melhores em cada posicao da mesa.
            </p>
          </div>

          {/* Ferramenta */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Ferramenta</h3>
            <nav className="flex flex-col gap-2" aria-label="Links da ferramenta">
              <Link href="/treinar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Treinar Ranges
              </Link>
              <Link href="/guia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Guia de Poker
              </Link>
              <Link href="/guia#posicoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Posicoes na Mesa
              </Link>
              <Link href="/guia#ranges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Entender Ranges
              </Link>
            </nav>
          </div>

          {/* Conteudo */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Conteudo</h3>
            <nav className="flex flex-col gap-2" aria-label="Links de conteudo">
              <Link href="/guia#o-que-sao-ranges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                O que sao Ranges?
              </Link>
              <Link href="/guia#como-usar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Como Usar a Ferramenta
              </Link>
              <Link href="/guia#estrategia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Estrategia Preflop
              </Link>
              <Link href="/guia#glossario" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Glossario do Poker
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Institucional</h3>
            <nav className="flex flex-col gap-2" aria-label="Links institucionais">
              <Link href="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sobre Nos
              </Link>
              <Link href="/termos-de-uso" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="/politica-de-privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Politica de Privacidade
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Poker Range Trainer. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Este site e apenas para fins educacionais. Jogue com responsabilidade.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
