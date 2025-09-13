import { UnifiedCVData } from "../interfaces/CVData";
import { CV, Skill, SkillLevel } from "../../../utils/global.d";
import { convertToGlobalCV } from "./CVDataAdapter";

/**
 * Converts UnifiedCVData format to the format expected by ModernCVTemplate
 * We're now using the global CV type from global.d.ts
 */
export function convertUnifiedToModernCV(data: UnifiedCVData): CV {
  // First convert to the global CV format
  const globalCV = convertToGlobalCV(data);
  
  // Return the global CV directly as our components now use this format
  return globalCV;
  
  // The code below is kept for reference in case you need specific conversions
  /*
  // Map skill levels based on keywords
  const mapSkillLevel = (skill: string): SkillLevel => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('expert') || lowerSkill.includes('advanced+')) {
      return 'ADVANCED';
    } else if (lowerSkill.includes('advanced')) {
      return 'ADVANCED';
    } else if (lowerSkill.includes('intermediate')) {
      return 'INTERMEDIATE';
    } else {
      return 'BEGINNER';
    }
  };

  // Convert skills from unified format to global CV format
  const convertedSkills: Skill[] = [
    ...data.skills.technical.map(skill => ({ 
      name: skill, 
      level: mapSkillLevel(skill) 
    })),
    ...data.skills.languages.map(skill => ({ 
      name: skill, 
      level: 'INTERMEDIATE'
    })),
    ...data.skills.other.map(skill => ({ 
      name: skill, 
      level: 'BEGINNER'
    }))
  ];
  */

  /* Removed conversion code as we now use convertToGlobalCV */
}
