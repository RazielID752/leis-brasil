import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Landmark,
  Users,
  BriefcaseBusiness,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Leaf,
  FileText,
  Coins,
  Shield,
} from "lucide-react";
import { SearchForm } from "@/features/search/search-form";
import { DotPattern } from "@/components/magicui/dot-pattern";
const topics = [
  { label: "Constituição", icon: Landmark, q: "Constituição" },
  { label: "Direitos fundamentais", icon: Users, q: "direitos fundamentais" },
  { label: "Trabalho", icon: BriefcaseBusiness, q: "trabalho" },
  { label: "Consumidor", icon: ShoppingCart, q: "consumidor" },
  { label: "Saúde", icon: HeartPulse, q: "saúde" },
  { label: "Educação", icon: GraduationCap, q: "educação" },
  { label: "Meio ambiente", icon: Leaf, q: "meio ambiente" },
  {
    label: "Administração pública",
    icon: FileText,
    q: "administração pública",
  },
  { label: "Impostos", icon: Coins, q: "imposto" },
  { label: "Segurança", icon: Shield, q: "segurança" },
];
function DocumentPreview() {
  return (
    <div className="document-scene" aria-hidden="true">
      <DotPattern className="hero-dots" />
      <div className="paper paper-back" />
      <div className="paper paper-middle" />
      <div className="paper paper-front">
        <h2>
          Constituição da República
          <br />
          Federativa do Brasil
        </h2>
        <div className="paper-rule" />
        <b>Art. 5º</b>
        <p>
          Todos são iguais perante a lei, sem distinção de qualquer natureza,
          garantindo-se aos brasileiros e aos estrangeiros residentes no País a
          inviolabilidade do direito à vida, à liberdade, à igualdade, à
          segurança e à propriedade, nos termos seguintes:
        </p>
        <p>
          I – homens e mulheres são iguais em direitos e obrigações, nos termos
          desta Constituição;
        </p>
        <div className="paper-line" />
        <div className="paper-line short" />
      </div>
      <div className="document-note">
        <BookOpen size={22} />
        <p>
          Este artigo garante a igualdade de direitos entre todas as pessoas,
          sem discriminação.
        </p>
      </div>
      <svg
        className="note-arrow"
        width="104"
        height="80"
        viewBox="0 0 104 80"
        fill="none"
      >
        <path
          d="M93 4C86 50 51 58 10 58m0 0 12-11M10 58l13 10"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  );
}
export default function Home() {
  return (
    <main id="conteudo" className="shell home">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Conheça as leis.
            <br />
            <span>Entenda seus direitos.</span>
          </h1>
          <p className="hero-description">
            O leisbrasil é uma biblioteca pública da legislação brasileira,
            <br className="wide-only" /> com acesso gratuito, organizado e com
            guias em linguagem clara.
          </p>
          <SearchForm />
          <div className="suggestions">
            <span>Buscas sugeridas:</span>
            {["Constituição", "Consumidor", "Trabalho"].map((q) => (
              <Link key={q} href={`/leis?q=${encodeURIComponent(q)}`}>
                {q}
              </Link>
            ))}
          </div>
        </div>
        <DocumentPreview />
      </section>
      <section className="topics-section" aria-labelledby="topics-title">
        <h2 id="topics-title">Explorar por tema</h2>
        <div className="topics-list">
          {topics.map(({ label, icon: Icon, q }) => (
            <Link
              className="topic"
              key={label}
              href={`/leis?q=${encodeURIComponent(q)}`}
            >
              <Icon size={23} strokeWidth={1.7} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-features">
        <div className="constitution-feature">
          <DotPattern className="feature-dots" />
          <div className="feature-copy">
            <h2>Comece pelo essencial</h2>
            <p>
              A Constituição Federal de 1988 reúne os princípios que organizam o
              Brasil e garantem os seus direitos fundamentais.
            </p>
            <Link href="/leis/constituicao" className="button-primary">
              <BookOpen size={25} />
              Ler a Constituição <ArrowRight size={19} />
            </Link>
          </div>
          <Image
            src="/images/constituicao.png"
            alt="Livro verde da Constituição Federal de 1988"
            width={230}
            height={345}
            className="constitution-book"
            priority
          />
        </div>
        <div className="guides-feature">
          <h2>Uma leitura mais clara</h2>
          <p>
            Nossos guias de leitura explicam, em linguagem simples, os
            principais temas da legislação brasileira, para que você entenda o
            que cada lei significa na prática.
          </p>
          <Link href="/guias" className="text-link">
            <BookOpen size={27} />
            Acessar guias de leitura <ArrowRight size={19} />
          </Link>
          <DotPattern className="guide-dots" />
        </div>
      </section>
    </main>
  );
}
