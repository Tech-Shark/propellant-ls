import React, { useState, useRef } from "react";
import CVEditor from "@/components/CVEditor";
import { CVPreview } from "@/components/CVPreview";
import { defaultCVData, CVData } from "@/components/CVData";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye, Edit, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cvTemplates } from "@/components/templates/CVTemplates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import html2pdf from "html2pdf.js";

export default function CVBuilder() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [isEditing, setIsEditing] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadPDF = () => {
    const template =
      cvTemplates.find((t) => t.id === selectedTemplate) || cvTemplates[0];
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.personalInfo.name} - CV</title>
    <style>${template.styles}</style>
</head>
<body>
    ${template.getHTML(cvData)}
</body>
</html>`;

    const opt = {
      margin: [0.3, 0, 0.3, 0],
      filename: `${cvData.personalInfo.name.replace(/\s+/g, "_")}_CV.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    const element = document.createElement("div");
    element.innerHTML = html;
    element.style.width = "8.27in";
    element.style.padding = "0.3in";

    html2pdf().set(opt).from(element).save();

    toast({
      title: "PDF Downloaded",
      description: "Your CV has been downloaded as a PDF file.",
    });
  };

  const printCV = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description:
        "Use your browser's print dialog to save as PDF or print your CV.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-white shadow-sm border-b border-border no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">CV Builder</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {cvTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="hidden md:flex"
              >
                {isEditing ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Only
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
              <Button onClick={printCV} variant="outline">
                Print
              </Button>
              <Button onClick={downloadPDF} className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div
            className={`${!isEditing ? "hidden lg:block" : "block"} no-print`}
          >
            <div className="bg-white rounded-lg shadow-md border border-border h-[calc(100vh-12rem)] overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-3">
                <h2 className="text-lg font-semibold">Edit Your CV</h2>
              </div>
              <CVEditor data={cvData} onChange={setCvData} />
            </div>
          </div>

          {/* Preview Panel - Always show */}
          <div>
            <div className="bg-white rounded-lg shadow-md border border-border overflow-auto h-[calc(100vh-12rem)] no-print">
              <div className="bg-secondary text-secondary-foreground px-4 py-3 sticky top-0 z-10 no-print">
                <h2 className="text-lg font-semibold">
                  Preview -{" "}
                  {cvTemplates.find((t) => t.id === selectedTemplate)?.name}
                </h2>
              </div>
              <div ref={previewRef} className="p-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                    <style>${
                      cvTemplates.find((t) => t.id === selectedTemplate)?.styles
                    }</style>
                    ${cvTemplates
                      .find((t) => t.id === selectedTemplate)
                      ?.getHTML(cvData)}
                  `,
                  }}
                />
              </div>
            </div>
            {/* Print Version - Hidden on screen */}
            <div className="hidden print:block">
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                  <style>${
                    cvTemplates.find((t) => t.id === selectedTemplate)?.styles
                  }</style>
                  ${cvTemplates
                    .find((t) => t.id === selectedTemplate)
                    ?.getHTML(cvData)}
                `,
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="fixed bottom-4 right-4 lg:hidden no-print">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            size="lg"
            className="btn-primary shadow-lg"
          >
            {isEditing ? (
              <>
                <Eye className="w-5 h-5 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
