import React from "react";
import { UnifiedCVData } from "./interfaces/CVData";
import { CV } from "../../utils/global.d";
import ClassicCVTemplate from "./ClassicCVTemplate";
import ModernCVTemplate from "./ModernCVTemplate";
import { convertToUnifiedCVData } from "./adapters/CVDataAdapter";
import { convertUnifiedToModernCV } from "./adapters/ModernCVAdapter";

interface CVRendererProps {
  data: CV | UnifiedCVData;
  template: string;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ data, template }) => {
  // Convert data to unified format
  const unifiedData =
    "firstName" in data
      ? convertToUnifiedCVData(data)
      : (data as UnifiedCVData);

  // Render the appropriate template
  switch (template) {
    case "modern":
      return <ModernCVTemplate data={convertUnifiedToModernCV(unifiedData)} />;
    case "professional":
      // Use Modern template for Professional template for now
      return <ModernCVTemplate data={convertUnifiedToModernCV(unifiedData)} />;
    case "classic":
    default:
      return <ClassicCVTemplate data={unifiedData} />;
  }
};

export default CVRenderer;
