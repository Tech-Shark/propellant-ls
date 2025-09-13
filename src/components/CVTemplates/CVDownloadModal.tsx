import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CV } from "../../utils/global.d";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";
import CVRenderer from "./CVRenderer";
import { generateCV } from "./CVTemplateEngine";

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData?: CV;
}

const CVDownloadModal: React.FC<CVDownloadModalProps> = ({
  isOpen,
  onClose,
  cvData = {} as CV,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Render preview using CVRenderer
  const renderPreview = () => {
    if (!selectedTemplate || !cvData) return null;

    return (
      <div className="bg-white p-4 rounded shadow w-full max-w-3xl mx-auto text-black overflow-auto">
        <CVRenderer data={cvData} template={selectedTemplate} />
      </div>
    );
  };

  const handleDownload = () => {
    if (!selectedTemplate || !cvData) return;

    try {
      // Use the CVTemplateEngine's generateCV function to create the HTML
      const html = generateCV(
        cvData, // CV data from global.d.ts
        cvData.workExperience || [], // Work experiences
        cvData.education || [], // Education
        cvData.certifications || [], // Certifications
        cvData.projects || [], // Projects
        cvData.skills || [], // Skills
        selectedTemplate // Template ID
      );

      // Create a temporary container for rendering
      const container = document.createElement("div");
      container.innerHTML = html;

      // Use html2pdf.js to export as PDF
      html2pdf()
        .set({
          margin: 0.3,
          filename: `${cvData.firstName || "CV"}-${
            cvData.lastName || "Template"
          }-CV.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save()
        .then(() => {
          toast.success("CV downloaded successfully!");
        })
        .catch((error) => {
          toast.error("Failed to download CV");
          console.error("PDF generation error:", error);
        });
    } catch (error) {
      toast.error("Error generating CV PDF");
      console.error("CV generation error:", error);
    }
  };

  // Available templates - aligned with CVTemplateEngine
  const availableTemplates: { id: string; name: string }[] = [
    { id: "classic", name: "Classic Professional" },
    { id: "modern", name: "Modern Minimal" },
    { id: "executive", name: "Executive Bold" },
    { id: "creative", name: "Creative Designer" },
    // Add more templates as they're created
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Choose CV Template
          </DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {availableTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="border rounded-lg p-2 bg-gray-50 cursor-pointer hover:shadow-lg transition-all flex items-center justify-center"
                style={{
                  width: 140,
                  height: 80,
                  overflow: "hidden",
                  position: "relative",
                }}
                onClick={() => setSelectedTemplate(tpl.id)}
              >
                <span className="text-base font-semibold text-gray-700 w-full text-center">
                  {tpl.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                Back to templates
              </Button>
              <span className="font-semibold text-blue-600">
                {
                  availableTemplates.find((t) => t.id === selectedTemplate)
                    ?.name
                }{" "}
                Preview
              </span>
            </div>
            <div
              className={`cv-preview-${selectedTemplate} border rounded-lg p-4 bg-gray-50 mb-6 overflow-auto flex justify-center`}
              style={{ minHeight: 400, maxHeight: 600 }}
            >
              {renderPreview()}
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-blue-600 text-white"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CVDownloadModal;
