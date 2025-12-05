import Link from "next/link";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/ui/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Crie Seu
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mt-2">
                Quadro de metas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Visualize seus sonhos, defina metas significativas e receba-as de
              volta daqui a um ano. Uma forma poderosa de refletir sobre sua
              jornada e celebrar seu crescimento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/create">
              <Button size="lg" className="text-lg px-8 py-6">
                Comece a Criar Seu Quadro de metas
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            ✨ Grátis para criar • 💳 Lembrete pago opcional • 📧 Entrega por
            e-mail em 1 ano
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Como Funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold">1. Crie Sua Visão</h3>
              <p className="text-muted-foreground">
                Construa seu Quadro de metas com imagens e texto. Arraste, solte
                e organize elementos como preferir. Organize metas por
                categoria: saúde, carreira, relacionamentos e mais.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-xl font-semibold">
                2. Armazene com Segurança
              </h3>
              <p className="text-muted-foreground">
                Seu Quadro de metas é armazenado com segurança em nosso banco de
                dados. Opcionalmente pague para receber um lembrete por e-mail
                exatamente um ano a partir de hoje.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold">3. Reflita e Cresça</h3>
              <p className="text-muted-foreground">
                Um ano depois, receba seu Quadro de metas por e-mail. Reflita
                sobre sua jornada, celebre suas vitórias e defina novas metas
                para o futuro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Recursos Poderosos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">
                Visualização Comprovada
              </h3>
              <p className="text-sm text-muted-foreground">
                Use o poder da visualização para tornar seus objetivos mais
                reais e alcançáveis
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🧭</div>
              <h3 className="text-lg font-semibold mb-2">
                Planejamento por Áreas
              </h3>
              <p className="text-sm text-muted-foreground">
                Organize suas metas por saúde, carreira, finanças,
                relacionamentos e desenvolvimento pessoal
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="text-lg font-semibold mb-2">Cápsula do Tempo</h3>
              <p className="text-sm text-muted-foreground">
                Receba suas metas exatamente um ano depois e veja o quanto você
                evoluiu
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-lg font-semibold mb-2">Reflexão Guiada</h3>
              <p className="text-sm text-muted-foreground">
                Compare suas metas com suas conquistas e celebre seu crescimento
                pessoal
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="text-lg font-semibold mb-2">
                Quadro Personalizado
              </h3>
              <p className="text-sm text-muted-foreground">
                Crie um quadro único com imagens inspiradoras e metas
                específicas para sua jornada
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Privacidade Total</h3>
              <p className="text-sm text-muted-foreground">
                Seus sonhos e metas são pessoais. Armazenamento criptografado e
                100% privado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            Pronto Para Começar Sua Jornada?
          </h2>
          <p className="text-xl opacity-90">
            Junte-se a outros que estão visualizando seus sonhos e alcançando
            suas metas.
          </p>
          <Link href="/create">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 m-4"
            >
              Crie Seu Quadro de metas Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Quadro de Metas. Feito com ❤️ para
            ajudar você a alcançar seus sonhos.
          </p>
        </div>
      </footer>
      <BottomNav />
    </main>
  );
}
