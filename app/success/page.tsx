import Link from "next/link";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/ui/BottomNav";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6 pb-24">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="text-6xl">🎉</div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-green-600">
            Sucesso! Suas Metas Foram Salvas
          </h1>
          <p className="text-xl text-gray-600">
            Obrigado pelo seu pagamento! Armazenamos seu Quadro de metas com
            segurança.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 text-left">
          <h2 className="text-xl font-semibold">O que acontece a seguir?</h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="text-2xl">📅</div>
              <div>
                <h3 className="font-semibold">Marque Seu Calendário</h3>
                <p className="text-sm text-gray-600">
                  Exatamente um ano a partir de hoje, você receberá um e-mail
                  com seu Quadro de metas
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">📧</div>
              <div>
                <h3 className="font-semibold">Verifique Seu E-mail</h3>
                <p className="text-sm text-gray-600">
                  Enviaremos suas metas e Quadro de metas para o e-mail que você
                  forneceu
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold">Reflita e Celebre</h3>
                <p className="text-sm text-gray-600">
                  Reserve um tempo para refletir sobre seu progresso e celebrar
                  suas conquistas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Quer criar outro Quadro de metas? Comece um novo a qualquer momento!
          </p>
          <Link href="/">
            <Button size="lg">← Voltar para Início</Button>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
