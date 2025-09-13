import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Download, Palette, X } from "lucide-react";
import { enhancedCVTemplates } from "./EnhancedCVTemplates";
import toast from "react-hot-toast";

// Interface for propellant CV data
interface PropellantCV {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  professionalTitle?: string;
  professionalSummary?: string;
  github?: string;
  website?: string;
}

interface PropellantWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  title: string;
  isCurrentRole: boolean;
}

interface PropellantEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

interface PropellantCertification {
  name: string;
  issuer: string;
  dateIssued: string;
  credentialId: string;
  credentialUrl: string;
}

interface PropellantProject {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  repositoryUrl?: string;
  liveUrl?: string;
}

interface PropellantSkill {
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

interface CVTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PropellantCV;
  workExperiences: PropellantWorkExperience[];
  educations: PropellantEducation[];
  certifications: PropellantCertification[];
  projects: PropellantProject[];
  skills: PropellantSkill[];
}

export const CVTemplateModal: React.FC<CVTemplateModalProps> = ({
  isOpen,
  onClose,
  personalInfo,
  workExperiences,
  educations,
  certifications,
  projects,
  skills,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsPreviewMode(true);
  };

  const handleDownload = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    setIsDownloading(true);
    try {
      const template = enhancedCVTemplates.find(
        (t) => t.id === selectedTemplate
      );
      if (!template) {
        throw new Error("Template not found");
      }

      // Import html2pdf dynamically to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;

      const html = template.generateHTML(
        personalInfo,
        workExperiences,
        educations,
        certifications,
        projects,
        skills
      );

      const opt = {
        margin: [0.3, 0, 0.3, 0],
        filename: `${personalInfo.firstName || "CV"}_${
          personalInfo.lastName || "Resume"
        }_${template.name.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const element = document.createElement("div");
      element.innerHTML = `<style>${template.styles}</style>${html}`;
      element.style.width = "8.27in";
      element.style.padding = "0.3in";

      await html2pdf().set(opt).from(element).save();
      toast.success("CV downloaded successfully!");
      onClose();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download CV. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedTemplateObj = enhancedCVTemplates.find(
    (t) => t.id === selectedTemplate
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsPreviewMode(false);
        setSelectedTemplate("");
        onClose();
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {isPreviewMode ? "CV Preview" : "Choose CV Template"}
          </DialogTitle>
        </DialogHeader>

        {!isPreviewMode ? (
          // Template Selection View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[70vh] overflow-y-auto">
            {enhancedCVTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all hover:bg-secondary/50"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="aspect-[3/4] bg-muted rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="w-full h-full scale-[0.25] origin-top-left"
                    style={{ transform: "scale(0.25) translate(-75%, -75%)" }}
                    dangerouslySetInnerHTML={{
                      __html: `<style>${
                        template.styles
                      }</style>${template.generateHTML(
                        personalInfo,
                        workExperiences.slice(0, 1), // Show only first work experience for preview
                        educations.slice(0, 1), // Show only first education for preview
                        [],
                        [],
                        skills.slice(0, 3) // Show only first 3 skills for preview
                      )}`,
                    }}
                  />
                </div>
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-muted text-sm mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Preview View
          <div className="flex flex-col h-[70vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Back to Templates
                </Button>
                <div>
                  <h3 className="font-semibold">{selectedTemplateObj?.name}</h3>
                  <p className="text-muted text-sm">
                    {selectedTemplateObj?.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-8">
              <div className="max-w-4xl mx-auto bg-white shadow-lg">
                {selectedTemplateObj && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<style>${
                        selectedTemplateObj.styles
                      }</style>${selectedTemplateObj.generateHTML(
                        personalInfo,
                        workExperiences,
                        educations,
                        certifications,
                        projects,
                        skills
                      )}`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
