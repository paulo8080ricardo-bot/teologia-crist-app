import React, { useState, useMemo } from "react";
import {
  studyMaterials,
  Category,
  SubCategory,
  Material,
} from "@/data/studyMaterials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Download, BookOpen, History, Shield, Scale } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Função para gerar o PDF
const generatePdf = (data: Category[]) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("📚 Materiais de Estudo de Teologia", 14, 20);

  // Subtítulo
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Lista organizada de recursos essenciais para aprofundar seus conhecimentos.", 14, 26);

  let finalY = 30;

  data.forEach((category) => {
    // Título da Categoria
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`${category.name}`, 14, finalY + 10);
    finalY += 12;

    category.subCategories.forEach((subCategory) => {
      // Título da Subcategoria
      doc.setFontSize(12);
      doc.setTextColor(50);
      doc.text(`- ${subCategory.name}`, 14, finalY + 5);
      finalY += 7;

      const tableData = subCategory.materials.map((material) => [
        material.name,
        material.details,
      ]);

      (doc as any).autoTable({
        startY: finalY,
        head: [["Tópico", "Material (Título, Autor, Fonte)"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
        styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: "auto" },
        },
        didDrawPage: function (data: any) {
          finalY = data.cursor.y;
        },
      });
      finalY = (doc as any).autoTable.previous.finalY + 5;
    });
  });

  doc.save("materiais_estudo_teologia.pdf");
};

// Componente para renderizar um material
const MaterialItem: React.FC<{ material: Material }> = ({ material }) => (
  <div className="py-2 border-b last:border-b-0">
    <p className="font-semibold text-sm">{material.name}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{material.details}</p>
  </div>
);

// Componente para renderizar uma subcategoria
const SubCategoryContent: React.FC<{ subCategory: SubCategory }> = ({ subCategory }) => (
  <div className="mt-2 space-y-2">
    {subCategory.materials.map((material, index) => (
      <MaterialItem key={index} material={material} />
    ))}
  </div>
);

// Mapeamento de ícones para uso dinâmico
const iconMap: { [key: string]: React.ElementType } = {
  Book: BookOpen,
  History: History,
  Shield: Shield,
  Scale: Scale,
};

const StudyMaterials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de filtragem
  const filteredMaterials = useMemo(() => {
    if (!searchTerm) {
      return studyMaterials;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return studyMaterials
      .map((category) => {
        const filteredSubCategories = category.subCategories
          .map((subCategory) => {
            const filteredMaterials = subCategory.materials.filter(
              (material) =>
                material.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                material.details.toLowerCase().includes(lowerCaseSearchTerm)
            );

            return {
              ...subCategory,
              materials: filteredMaterials,
            };
          })
          .filter((subCategory) => subCategory.materials.length > 0);

        return {
          ...category,
          subCategories: filteredSubCategories,
        };
      })
      .filter((category) => category.subCategories.length > 0);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-2">
        📚 Materiais de Estudo de Teologia
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Uma lista organizada de recursos essenciais para aprofundar seus conhecimentos em diversas áreas da Teologia Cristã.
      </p>

      <Separator className="my-6" />

      {/* Seção de Busca e Download */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por livro, autor ou tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={() => generatePdf(filteredMaterials)} className="flex items-center gap-2" disabled={!filteredMaterials.length}>
          <Download className="h-4 w-4" />
          Baixar Lista em PDF
        </Button>
      </div>

      {/* Lista de Materiais */}
      <div className="space-y-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((category) => {
            const IconComponent = iconMap[category.icon.name] || BookOpen;
            return (
              <Card key={category.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <IconComponent className="h-6 w-6 text-primary" />
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {category.subCategories.map((subCategory, subIndex) => (
                      <AccordionItem key={subIndex} value={`item-${category.id}-${subIndex}`}>
                        <AccordionTrigger className="font-semibold text-base hover:no-underline">
                          {subCategory.name}
                          <Badge variant="secondary" className="ml-2">
                            {subCategory.materials.length}
                          </Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <SubCategoryContent subCategory={subCategory} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-lg">Nenhum material encontrado para "{searchTerm}".</p>
            <Button variant="link" onClick={handleClearSearch}>
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
