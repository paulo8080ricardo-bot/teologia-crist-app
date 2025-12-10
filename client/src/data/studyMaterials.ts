import { Book, History, Shield, Scale } from "lucide-react";

export interface Material {
  name: string;
  details: string; // Combinação de título, autor e fonte
}

export interface SubCategory {
  name: string;
  materials: Material[];
}

export interface Category {
  id: number;
  name: string;
  icon: React.ElementType; // Para usar ícones do Lucide
  description: string;
  subCategories: SubCategory[];
}

export const studyMaterials: Category[] = [
  {
    id: 1,
    name: "Fundamentos Bíblicos",
    icon: Book,
    description: "Materiais essenciais para a compreensão e interpretação das Escrituras Sagradas.",
    subCategories: [
      {
        name: "Antigo Testamento",
        materials: [
          { name: "Pentateuco", details: "Introdução ao Pentateuco – Tremper Longman III; Manual Bíblico – John Drane; Curso Deuteronômio – Israel Muniz (YouTube)" },
          { name: "Livros Históricos", details: "História de Israel – John Bright; Curso “Narrativas do AT” - CTP" },
          { name: "Livros Poéticos", details: "Sabedoria do Antigo Testamento – Derek Kidner; Série Cultura Bíblica – Ed. Vida Nova" },
          { name: "Livros Proféticos", details: "Profetas – Abraham Heschel; Teologia dos Profetas – Walter Eichrodt" },
        ],
      },
      {
        name: "Novo Testamento",
        materials: [
          { name: "Evangelhos Sinóticos", details: "Introdução ao NT – Carson & Moo; Canal J. Cesare Santos" },
          { name: "João", details: "Teologia de João – Andreas Köstenberger" },
          { name: "Atos", details: "Atos (NICNT) – F. F. Bruce" },
          { name: "Epístolas Paulinas", details: "Paulo — Missionário e Teólogo – John Polhill" },
          { name: "Epístolas Gerais", details: "Comentário Hernandes Dias Lopes" },
          { name: "Apocalipse", details: "A Mensagem de Apocalipse – Eugene Peterson; Curso Escatologia – Augustus Nicodemus" },
        ],
      },
      {
        name: "Hermenêutica e Exegese",
        materials: [
          { name: "Métodos", details: "Manual de Exegese Bíblica – Gordon Fee" },
          { name: "Contexto Histórico", details: "História, Cultura e Religião de Israel – John Walton" },
          { name: "Gêneros", details: "Como Ler a Bíblia Livro por Livro – Fee & Stuart" },
          { name: "Aplicação", details: "Pregação e Pregadores – D. M. Lloyd-Jones" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Teologia Sistemática",
    icon: History, // Usando History como um ícone genérico para Teologia Sistemática
    description: "Estudo organizado das doutrinas cristãs, abordando temas como Deus, Cristo, Espírito Santo, Salvação e Escatologia.",
    subCategories: [
      {
        name: "Doutrinas",
        materials: [
          { name: "Bibliologia", details: "Doutrinas Bíblicas – Wayne Grudem; Inspiração: Kevin DeYoung; Cânon: F. F. Bruce" },
          { name: "Teologia de Deus", details: "Tozer, Augustus Nicodemus" },
          { name: "Cristologia", details: "John Stott" },
          { name: "Pneumatologia", details: "Sinclair Ferguson" },
          { name: "Antropologia", details: "Francis Schaeffer" },
          { name: "Soteriologia", details: "John Murray, Cânones de Dort" },
          { name: "Eclesiologia", details: "Timothy Keller" },
          { name: "Escatologia", details: "Millard Erickson, G. E. Ladd" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "História da Igreja",
    icon: History,
    description: "Recursos para traçar o desenvolvimento da fé cristã desde a era apostólica até os dias atuais.",
    subCategories: [
      {
        name: "Geral e Períodos",
        materials: [
          { name: "Visão Geral", details: "Justo González; John Leith" },
          { name: "Idade Média", details: "Documentário PBS “A Igreja na Idade Média”" },
          { name: "Reforma", details: "Calvino; Lutero; Joel Beeke" },
          { name: "História Americana/Moderna", details: "George Marsden; Vinson Synan" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Teologia Bíblica",
    icon: Book,
    description: "Estudo da revelação progressiva de Deus na história da redenção, focando na unidade das Escrituras.",
    subCategories: [
      {
        name: "Autores Chave",
        materials: [
          { name: "Geral", details: "Walter Kaiser; O. Palmer Robertson; Gerhard von Rad; Herman Ridderbos; Köstenberger" },
          { name: "Escatologia", details: "G. E. Ladd" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Teologia Prática",
    icon: Scale, // Usando Scale (Balança) para representar a aplicação prática
    description: "Materiais focados na aplicação da teologia na vida da igreja e do indivíduo, incluindo pregação e aconselhamento.",
    subCategories: [
      {
        name: "Ministério e Vida Cristã",
        materials: [
          { name: "Pregação/Liturgia", details: "Bryan Chapell; Robert Webber" },
          { name: "Aconselhamento", details: "David Powlison" },
          { name: "Missões", details: "Ball & Osborn; David Bosch" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Línguas Bíblicas",
    icon: Book,
    description: "Recursos para o estudo do Hebraico e Grego, as línguas originais da Bíblia.",
    subCategories: [
      {
        name: "Hebraico",
        materials: [
          { name: "Gramática", details: "Hebraico Bíblico – Thomas Lambdin" },
        ],
      },
      {
        name: "Grego",
        materials: [
          { name: "Gramática", details: "William Mounce" },
        ],
      },
      {
        name: "Ferramentas",
        materials: [
          { name: "Aplicativos", details: "BibleHub/Blue Letter/STEP Bible" },
          { name: "Recursos", details: "Interlinear Hebraico e Grego" },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Apologética",
    icon: Shield,
    description: "Defesa racional da fé cristã contra objeções e promoção de uma cosmovisão bíblica.",
    subCategories: [
      {
        name: "Autores e Temas",
        materials: [
          { name: "Geral", details: "Lee Strobel; William Lane Craig; Tim Keller; John Stott" },
          { name: "Filosofia", details: "Alvin Plantinga" },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Ética Cristã",
    icon: Scale,
    description: "Estudo dos princípios morais e da conduta cristã baseada nas Escrituras.",
    subCategories: [
      {
        name: "Autores Chave",
        materials: [
          { name: "Geral", details: "John Frame; Roberto Pereira; C. S. Lewis; Kuyper" },
        ],
      },
    ],
  },
];
