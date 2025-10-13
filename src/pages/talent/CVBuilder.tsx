import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Wand2, Plus, Trash2, Save, Palette } from "lucide-react";
import { Certification, CV, Project, SkillLevel } from "@/utils/global";
import { WorkExperience, Education, Skill } from "@/utils/global";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { skillLevels } from "@/utils/constant.ts";
import axiosInstance from "@/api/AxiosInstance.ts";
import { toast } from "sonner";
import axios, { isAxiosError } from "axios";
import {
  cvTemplates,
  generateCV,
} from "@/components/CVTemplates/CVTemplateEngine";
import { CVTemplateModal } from "@/components/CVTemplates/CVTemplateModal";
import html2pdf from "html2pdf.js";
import { sanitizeHTML } from "@/utils/SafetyUtils";
import logger from "@/utils/Logger";

// Helper function to validate URLs
const isValidURL = (url: string): boolean => {
  if (!url || url.trim() === "") return true; // Empty URLs are considered valid (optional field)

  // Clean up the URL by trimming whitespace
  const trimmedUrl = url.trim();

  // Check for common patterns that look like URLs even if not perfectly formatted
  // This allows for domain-only URLs like "example.com" or "www.example.com"
  const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  if (urlRegex.test(trimmedUrl)) {
    return true;
  }

  // First ensure it has a protocol for the URL constructor test
  let urlToTest = trimmedUrl;
  if (!/^https?:\/\//i.test(urlToTest)) {
    urlToTest = `https://${urlToTest}`;
  }

  try {
    new URL(urlToTest);
    return true;
  } catch (e) {
    // Log the error for debugging
    console.warn(`Invalid URL detected: ${url}`, e);
    return false;
  }
};

// Helper function to format URLs properly
const formatURL = (url: string): string => {
  if (!url || url.trim() === "") return "";

  // Clean the URL of leading/trailing whitespace
  let cleanUrl = url.trim();

  // If URL doesn't have a protocol, add https://
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = `https://${cleanUrl}`;
  }

  try {
    // Validate the URL is properly formatted
    new URL(cleanUrl);
    return cleanUrl;
  } catch (e) {
    // If the URL is invalid even after adding https://, return an empty string
    console.warn("Failed to format URL:", url);
    return "";
  }
};

export default function CVBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<CV>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    professionalTitle: "",
    professionalSummary: "",
    jobDescription: "",
  });
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: "",
    level: "BEGINNER",
  });
  const [newTechnology, setNewTechnology] = useState<string>("");

  // Helper function to handle subscription upgrade redirects
  const redirectToPayment = () => {
    // Save current CV data to localStorage before redirecting
    const currentData: CV = {
      ...personalInfo,
      workExperience: workExperiences,
      education: educations,
      certifications,
      projects,
      skills,
    };
    localStorage.setItem(
      "cv_pending_save",
      JSON.stringify(removeIdFromCv(currentData))
    );

    // Redirect to payment page
    window.location.href = "/payment";
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
      title: "",
      isCurrentRole: false,
      achievements: [],
    };
    setWorkExperiences([...workExperiences, newExp]);
  };

  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean | string[]
  ) => {
    setWorkExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  // Function to add achievement to a work experience entry
  const addAchievement = (experienceIndex: number) => {
    setWorkExperiences((prev) =>
      prev.map((exp, i) => {
        if (i === experienceIndex) {
          return {
            ...exp,
            achievements: [...exp.achievements, ""],
          };
        }
        return exp;
      })
    );
  };

  // Function to update a specific achievement
  const updateAchievement = (
    experienceIndex: number,
    achievementIndex: number,
    value: string
  ) => {
    setWorkExperiences((prev) =>
      prev.map((exp, i) => {
        if (i === experienceIndex) {
          const updatedAchievements = [...exp.achievements];
          updatedAchievements[achievementIndex] = value;
          return {
            ...exp,
            achievements: updatedAchievements,
          };
        }
        return exp;
      })
    );
  };

  // Function to remove an achievement
  const removeAchievement = (
    experienceIndex: number,
    achievementIndex: number
  ) => {
    setWorkExperiences((prev) =>
      prev.map((exp, i) => {
        if (i === experienceIndex) {
          return {
            ...exp,
            achievements: exp.achievements.filter(
              (_, j) => j !== achievementIndex
            ),
          };
        }
        return exp;
      })
    );
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const newEdu: Education = {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    };
    setEducations([...educations, newEdu]);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setEducations((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (index: number) => {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    const newCert: Certification = {
      name: "",
      issuer: "",
      dateIssued: "",
      credentialId: "",
      credentialUrl: "",
    };
    setCertifications([...certifications, newCert]);
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
    formatAsUrl: boolean = false
  ) => {
    // If this is a URL field and formatAsUrl is true, format it properly
    if (formatAsUrl && field === "credentialUrl") {
      value = formatURL(value);
    }

    setCertifications((prev) =>
      prev.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert))
    );
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  const addProject = () => {
    const newProj: Project = {
      name: "",
      description: "",
      technologies: [],
      project: "",
      link: "",
    };
    setProjects([...projects, newProj]);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string,
    formatAsUrl: boolean = false
  ) => {
    // If this is a URL field and formatAsUrl is true, format it properly
    if (formatAsUrl && (field === "link" || field === "project")) {
      value = formatURL(value);
    }

    setProjects((prev) =>
      prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    );
  };

  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const addTechnology = () => {
    if (!newTechnology) return;
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        technologies: [...proj.technologies, newTechnology],
      }))
    );
    setNewTechnology("");
  };

  const removeTechnology = (index: number, projIndex: number) => {
    setProjects((prev) =>
      prev.map((proj, i) =>
        i === projIndex
          ? {
              ...proj,
              technologies: proj.technologies.filter((_, j) => j !== index),
            }
          : proj
      )
    );
  };

  const addSkill = () => {
    if (!newSkill.name || !newSkill.level) return;
    setSkills([...skills, newSkill]);
    setNewSkill({
      name: "",
      level: "BEGINNER",
    });
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to handle AI CV generation
  const handleAIGenerate = async () => {
    setIsGenerating(true);

    try {
      // First check credit status
      const creditStatus = await checkCreditStatus();
      if (creditStatus && creditStatus.credits <= 0) {
        toast.error("You don't have enough credits for AI optimization.", {
          duration: 6000,
          action: {
            label: "Upgrade",
            onClick: () => redirectToPayment(),
          },
        });
        setIsGenerating(false);
        return;
      }
      // Validate required fields
      if (
        !personalInfo.firstName ||
        !personalInfo.lastName ||
        !personalInfo.email
      ) {
        toast.error(
          "Please add your name and email before we can optimize your CV."
        );
        setIsGenerating(false);
        return;
      }

      // Validate job description
      if (!personalInfo.jobDescription) {
        toast.error(
          "Please enter a job description to optimize your CV for that position."
        );
        setIsGenerating(false);
        return;
      }

      const data: CV = {
        ...personalInfo,
        workExperience: workExperiences,
        education: educations,
        certifications,
        projects,
        skills,
      };

      // Format data according to the required API structure

      // Clean the job description - ensure it matches the Postman format exactly
      const cleanJobDescription = personalInfo.jobDescription
        ? personalInfo.jobDescription.replace(/\*\*/g, "").trim()
        : ""; // Remove markdown formatting

      if (cleanJobDescription.trim() === "") {
        toast.error(
          "Please add a job description so we can tailor your CV to match it"
        );
        setIsGenerating(false);
        return;
      }

      // Transform skills to match expected format - EXACTLY like the Postman format that works
      const formattedSkills = skills.map((skill, index) => ({
        id: (index + 1).toString(),
        name: skill.name,
        level: skill.level,
      }));

      // Transform work experiences to match expected format - EXACTLY like the Postman format that works
      const formattedExperiences = workExperiences.map((exp, index) => ({
        id: `exp${index + 1}`, // Use the exact format "exp1", "exp2", etc. as in Postman
        company: exp.company,
        position: exp.position,
        title: exp.title || exp.position,
        startDate: exp.startDate,
        // Handle current roles - use "Present" string for current roles
        endDate: exp.isCurrentRole ? "Present" : exp.endDate,
        // Use current property as in Postman example
        current: Boolean(exp.isCurrentRole),
        location: exp.location || "Remote", // Default to Remote if missing
        description: exp.description,
        achievements: exp.achievements || [],
      }));

      // Create the API-formatted data structure
      const apiFormattedData = {
        jobDescription: cleanJobDescription,
        skills: formattedSkills,
        experiences: formattedExperiences,
      };

      // SECURITY FIX: Use logger instead of console.log
      logger.debug("Sending data for optimization:", apiFormattedData);

      // Validate the data structure before sending
      const validateData = () => {
        // Check that jobDescription is a string
        if (
          typeof apiFormattedData.jobDescription !== "string" ||
          !apiFormattedData.jobDescription.trim()
        ) {
          return "Job description is required and must be a non-empty string";
        }

        // Check that skills is an array
        if (!Array.isArray(apiFormattedData.skills)) {
          return "Skills must be an array";
        }

        // Check each skill has required properties
        for (const skill of apiFormattedData.skills) {
          if (!skill.name || !skill.level) {
            return "Each skill must have a name and level";
          }
        }

        // Check experiences is an array
        if (!Array.isArray(apiFormattedData.experiences)) {
          return "Experiences must be an array";
        }

        // Check each experience has required properties - ensuring exact match with Postman format
        for (const exp of apiFormattedData.experiences) {
          if (!exp.company || !exp.position || !exp.description) {
            return "Each experience must have company, position, and description";
          }
          if (!exp.startDate) {
            return "Each experience must have a start date";
          }
          if (exp.current === false && !exp.endDate) {
            return "Each non-current experience must have an end date";
          }
          // Ensure ID format matches "expN" pattern
          if (!exp.id.startsWith("exp")) {
            console.warn(
              `Experience ID "${exp.id}" doesn't match expected format "expN", but continuing...`
            );
          }
        }

        return null; // No validation errors
      };

      const validationError = validateData();
      if (validationError) {
        toast.error(`Validation error: ${validationError}`);
        setIsGenerating(false);
        return;
      }

      // Make the API call with explicit content-type header and retry logic
      let response;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          // Log the exact data being sent
          console.log(
            `Attempt ${retryCount + 1}: Sending CV optimization request`
          );

          // Log the exact format we're sending to make debugging easier
          console.log(
            `Exact JSON being sent to server:`,
            JSON.stringify(apiFormattedData, null, 2)
          );

          response = await axiosInstance.post(
            "/cv/optimize",
            apiFormattedData,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              timeout: 30000,
            }
          );

          // If successful, break out of retry loop
          console.log("CV optimization request successful");
          break;
        } catch (err) {
          retryCount++;
          console.error(
            `API call failed (attempt ${retryCount}/${maxRetries})`,
            err
          );

          if (retryCount >= maxRetries) {
            console.error("Max retries reached. Giving up.");
            throw err; // Re-throw to be caught by outer try/catch
          }

          // Wait before retrying (exponential backoff)
          const delay = 1000 * Math.pow(2, retryCount);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // Log the entire response for debugging
      console.log("Optimization API Response:", response);

      // Check for data in various possible response structures
      // The backend returns data in format { data: { optimizedCV } } or { data: optimizedCV }
      const optimizedData = response?.data?.data || response?.data;

      if (optimizedData) {
        console.log("Received optimized CV:", optimizedData);

        // Convert the optimized data back to our CV format
        const optimizedCV: CV = {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone,
          address: personalInfo.address,
          professionalTitle: personalInfo.professionalTitle,
          professionalSummary:
            optimizedData.professionalSummary ||
            optimizedData.summary ||
            personalInfo.professionalSummary,
          jobDescription:
            optimizedData.jobDescription || personalInfo.jobDescription,
          workExperience:
            optimizedData.experiences?.map((exp) => {
              // Find matching experiences in local state using fuzzy matching
              const matchingExactExp = workExperiences.find(
                (local) =>
                  local.company === (exp.company || "") &&
                  local.position === (exp.position || "") &&
                  local.startDate === (exp.startDate || "")
              );

              // Try looser matching if exact match fails
              const matchingCompanyPositionExp = !matchingExactExp
                ? workExperiences.find(
                    (local) =>
                      local.company === (exp.company || "") &&
                      local.position === (exp.position || "")
                  )
                : null;

              // Try even looser matching with just company if previous matches fail
              const matchingCompanyExp =
                !matchingExactExp && !matchingCompanyPositionExp
                  ? workExperiences.find(
                      (local) => local.company === (exp.company || "")
                    )
                  : null;

              // Use the best match found
              const matchingExp =
                matchingExactExp ||
                matchingCompanyPositionExp ||
                matchingCompanyExp;

              // Generate default achievements from description if none provided
              let achievements = [];

              // Store original achievements for logging/debugging
              const originalAchievements = Array.isArray(exp.achievements)
                ? [...exp.achievements]
                : [];
              const matchingAchievements =
                matchingExp && Array.isArray(matchingExp.achievements)
                  ? [...matchingExp.achievements]
                  : [];

              // If AI returned achievements, use those
              if (
                Array.isArray(exp.achievements) &&
                exp.achievements.length > 0
              ) {
                achievements = exp.achievements;
                console.log(
                  `Using AI achievements for ${exp.company || "company"}: ${
                    achievements.length
                  } items`
                );
              }
              // If we have matching local achievements, use those
              else if (
                matchingExp &&
                Array.isArray(matchingExp.achievements) &&
                matchingExp.achievements.length > 0
              ) {
                achievements = matchingExp.achievements;
                console.log(
                  `Using preserved local achievements for ${
                    exp.company || "company"
                  }: ${achievements.length} items`
                );
              }
              // If description contains bullet points, extract those as achievements
              else if (exp.description && exp.description.includes("•")) {
                achievements = exp.description
                  .split(/•\s*/)
                  .filter((item) => item.trim().length > 0)
                  .map((item) => item.trim())
                  .slice(0, 3); // Take up to 3 bullet points
                console.log(
                  `Extracted achievements from description for ${
                    exp.company || "company"
                  }: ${achievements.length} items`
                );
              }
              // Otherwise, generate a placeholder achievement
              else if (exp.description) {
                achievements = [
                  `Contributed to ${exp.company} as ${exp.position} with focus on operational excellence`,
                ];
                console.log(
                  `Generated placeholder achievement for ${
                    exp.company || "company"
                  }`
                );
              }

              return {
                company: exp.company || "",
                position: exp.position || "",
                title: exp.title || exp.position || "",
                startDate: exp.startDate || "",
                endDate:
                  exp.current || exp.endDate === "Present"
                    ? ""
                    : exp.endDate || "",
                description: exp.description || "",
                location: exp.location || "",
                isCurrentRole: !!exp.current || exp.endDate === "Present",
                // Always provide an array of achievements
                achievements: achievements,
              };
            }) || workExperiences,
          skills:
            optimizedData.skills?.map((skill) => ({
              name: skill.name || "",
              level: skill.level || "BEGINNER",
            })) || skills,
        };

        const cv = optimizedCV;

        // Update state with the optimized data, with fallbacks
        setPersonalInfo({
          ...personalInfo,
          ...(cv.firstName ? { firstName: cv.firstName } : {}),
          ...(cv.lastName ? { lastName: cv.lastName } : {}),
          ...(cv.email ? { email: cv.email } : {}),
          ...(cv.phone ? { phone: cv.phone } : {}),
          ...(cv.address ? { address: cv.address } : {}),
          ...(cv.professionalTitle
            ? { professionalTitle: cv.professionalTitle }
            : {}),
          ...(cv.professionalSummary
            ? { professionalSummary: cv.professionalSummary }
            : {}),
        });

        // Create a backup of the current workExperiences with their achievements
        const achievementsBackup = workExperiences.map((exp) => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          achievements: exp.achievements || [],
        }));
        console.log(
          "Created achievements backup with",
          achievementsBackup.length,
          "entries"
        );

        // Only update these arrays if they exist and are arrays in the response
        if (Array.isArray(cv.workExperience) && cv.workExperience.length > 0) {
          // Preserve achievements from original experiences when updating with AI optimization
          const mergedWorkExps = cv.workExperience.map((aiExp) => {
            // Find matching experiences in local state using fuzzy matching
            const matchingExactExp = workExperiences.find(
              (local) =>
                local.company === aiExp.company &&
                local.position === aiExp.position &&
                local.startDate === aiExp.startDate
            );

            // Try looser matching if exact match fails
            const matchingCompanyPositionExp = !matchingExactExp
              ? workExperiences.find(
                  (local) =>
                    local.company === aiExp.company &&
                    local.position === aiExp.position
                )
              : null;

            // Try even looser matching with just company if previous matches fail
            const matchingCompanyExp =
              !matchingExactExp && !matchingCompanyPositionExp
                ? workExperiences.find(
                    (local) => local.company === aiExp.company
                  )
                : null;

            // Use the best match found
            const matchingExp =
              matchingExactExp ||
              matchingCompanyPositionExp ||
              matchingCompanyExp;

            // Ensure we always have achievements, prioritizing what the AI returned if available
            let finalAchievements = [];

            // Create a log entry for debugging
            const achievementSource = {
              company: aiExp.company,
              position: aiExp.position,
              aiAchievementsCount: Array.isArray(aiExp.achievements)
                ? aiExp.achievements.length
                : 0,
              localAchievementsCount:
                matchingExp && Array.isArray(matchingExp.achievements)
                  ? matchingExp.achievements.length
                  : 0,
            };
            console.log("Achievement source data:", achievementSource);

            // If the AI experience already has achievements, use them
            if (
              Array.isArray(aiExp.achievements) &&
              aiExp.achievements.length > 0
            ) {
              finalAchievements = aiExp.achievements;
              console.log(
                `Using AI achievements for ${aiExp.company}: ${finalAchievements.length} items`
              );
            }
            // Otherwise, use existing achievements if available
            else if (
              matchingExp &&
              Array.isArray(matchingExp.achievements) &&
              matchingExp.achievements.length > 0
            ) {
              finalAchievements = matchingExp.achievements;
              console.log(
                `Using preserved local achievements for ${aiExp.company}: ${finalAchievements.length} items`
              );
            }
            // If there are still no achievements but we have description with bullet points
            else if (aiExp.description && aiExp.description.includes("•")) {
              finalAchievements = aiExp.description
                .split(/•\s*/)
                .filter((item) => item.trim().length > 0)
                .map((item) => item.trim())
                .slice(0, 3); // Take up to 3 bullet points
              console.log(
                `Extracted achievements from description for ${aiExp.company}: ${finalAchievements.length} items`
              );
            }
            // Last resort: Generate a placeholder achievement
            else {
              finalAchievements = [
                `Contributed to ${aiExp.company} as ${aiExp.position} with focus on operational excellence`,
              ];
              console.log(
                `Generated placeholder achievement for ${aiExp.company}`
              );
            }

            // One final check - look in our backup if we still have no achievements
            if (finalAchievements.length === 0) {
              const backupExp = achievementsBackup.find(
                (backup) =>
                  backup.company === aiExp.company &&
                  backup.position === aiExp.position
              );

              if (
                backupExp &&
                Array.isArray(backupExp.achievements) &&
                backupExp.achievements.length > 0
              ) {
                finalAchievements = backupExp.achievements;
                console.log(
                  `Using backup achievements for ${aiExp.company}: ${finalAchievements.length} items`
                );
              }
            }

            return {
              ...aiExp,
              achievements: finalAchievements,
            };
          });

          // Log the results of our achievement preservation
          console.log("Original experiences:", workExperiences.length);
          console.log("AI optimized experiences:", cv.workExperience.length);
          console.log("Final merged experiences:", mergedWorkExps.length);

          setWorkExperiences(mergedWorkExps);
        }

        if (Array.isArray(cv.education) && cv.education.length > 0) {
          setEducations(cv.education);
        }

        if (Array.isArray(cv.certifications) && cv.certifications.length > 0) {
          setCertifications(cv.certifications);
        }

        if (Array.isArray(cv.projects) && cv.projects.length > 0) {
          setProjects(cv.projects);
        }

        if (Array.isArray(cv.skills) && cv.skills.length > 0) {
          setSkills(cv.skills);
        }

        toast.success(
          "Your CV has been improved to match the job description!"
        );
      } else {
        console.error("No CV data found in the response");
        toast.error(
          "Sorry, we couldn't optimize your CV right now. Please try again in a few minutes."
        );
      }
    } catch (error) {
      console.error("CV Optimization Error:", error);

      let errorMessage =
        "There was an error optimizing your CV. Please try again later.";

      if (axios.isAxiosError(error) && error.response) {
        // Log detailed error info for debugging
        console.error("API Error Response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Get user-friendly error message
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }

        // Add specific guidance based on error patterns
        if (error.response.status === 400) {
          // Log more diagnostic info
          console.log("CV Optimization 400 Error - Possible causes:");
          console.log("Full error response:", error.response);

          // Log what the server responded with (might contain validation errors)
          if (error.response?.data) {
            console.log("Server response data:", error.response.data);

            // If there's a specific message or validation errors, show them
            if (error.response.data.message) {
              console.log("Server message:", error.response.data.message);
              errorMessage = error.response.data.message;
            }

            if (error.response.data.errors) {
              console.log("Validation errors:", error.response.data.errors);
              errorMessage =
                "Invalid data format: " +
                Object.values(error.response.data.errors).join(", ");
            }
          }

          // Extract original request data from error config
          const requestData = error.config?.data
            ? JSON.parse(error.config.data)
            : null;

          console.log("Request data sent to server:", requestData);

          // Check job description
          if (requestData?.jobDescription) {
            if (requestData.jobDescription.length > 5000) {
              console.log(
                "- Job description may be too long:",
                requestData.jobDescription.length,
                "characters"
              );
              errorMessage =
                "Your job description may be too long. Please shorten it and try again.";
            } else if (requestData.jobDescription.includes("**")) {
              console.log("- Job description contains markdown formatting");
              errorMessage =
                "Your job description contains special formatting. Please remove any markdown and try again.";
            }
          } else {
            console.log("- Missing job description");
            errorMessage = "A job description is required for CV optimization.";
          }
          if (!personalInfo.jobDescription) {
            errorMessage = "Job description is required for AI optimization";
          }
        } else if (error.response.status === 401) {
          errorMessage = "Authentication error. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage =
            "You need to upgrade your plan or earn more points for this feature.";

          // Show toast with upgrade button
          toast.error(
            "You've reached your AI optimization limit. Please upgrade your subscription to continue.",
            {
              duration: 6000,
              action: {
                label: "Upgrade",
                onClick: () => {
                  redirectToPayment();
                },
              },
            }
          );
        } else if (error.response.status === 429) {
          errorMessage =
            "You've reached the API rate limit. Please try again later.";
        }
      }

      // Show a more user-friendly error message
      toast.error(
        `We couldn't optimize your CV at this time. Our AI service might be temporarily unavailable. ${
          errorMessage !== "AI Optimization Failed. Try again later"
            ? `Error: ${errorMessage}`
            : "Please try again later or continue editing your CV manually."
        }`
      );

      console.log(
        "If this error persists, check the AI_URL configuration in your backend .env file"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle CV saving
  const handleSave = async () => {
    setIsSaving(true);

    // Check credit status before saving - only if available
    // But don't block the save operation if credit checking fails
    try {
      const creditStatus = await checkCreditStatus();
      // Only show a warning for low credits, but still allow saving
      if (creditStatus && creditStatus.credits <= 1) {
        toast.warning(
          "You're on your last credit. Your ability to make changes may be limited.",
          {
            duration: 6000,
            action: {
              label: "Upgrade",
              onClick: () => redirectToPayment(),
            },
          }
        );
      }
    } catch (error) {
      // Just log the error - don't show to user or block saving
      console.error("Failed to check credit status before save:", error);
      // Continue with saving process regardless
    }

    // Validate all URLs before submission
    // First, check if URLs are present but invalid
    const invalidUrlsList: string[] = [];

    // Check project URLs
    projects.forEach((proj, index) => {
      if (proj.link && proj.link.trim() && !isValidURL(proj.link)) {
        invalidUrlsList.push(`Project ${index + 1} link: ${proj.link}`);
      }
      if (proj.project && proj.project.trim() && !isValidURL(proj.project)) {
        invalidUrlsList.push(
          `Project ${index + 1} repository: ${proj.project}`
        );
      }
    });

    // Check certification URLs
    certifications.forEach((cert, index) => {
      if (
        cert.credentialUrl &&
        cert.credentialUrl.trim() &&
        !isValidURL(cert.credentialUrl)
      ) {
        invalidUrlsList.push(
          `Certification ${index + 1} URL: ${cert.credentialUrl}`
        );
      }
    });

    // Check personal profile URLs
    if (
      personalInfo.github &&
      personalInfo.github.trim() &&
      !isValidURL(personalInfo.github)
    ) {
      invalidUrlsList.push(`GitHub profile URL: ${personalInfo.github}`);
    }
    if (
      personalInfo.portfolio &&
      personalInfo.portfolio.trim() &&
      !isValidURL(personalInfo.portfolio)
    ) {
      invalidUrlsList.push(`Portfolio URL: ${personalInfo.portfolio}`);
    }
    if (
      personalInfo.website &&
      personalInfo.website.trim() &&
      !isValidURL(personalInfo.website)
    ) {
      invalidUrlsList.push(`Website URL: ${personalInfo.website}`);
    }

    if (invalidUrlsList.length > 0) {
      toast.error(
        `Some links in your CV don't look right. Please check the following links before saving:\n${invalidUrlsList
          .slice(0, 3)
          .join("\n")}${
          invalidUrlsList.length > 3
            ? `\n...and ${invalidUrlsList.length - 3} more`
            : ""
        }\n\nTip: Make sure URLs are in format "example.com" or "https://example.com"`
      );
      console.error("Invalid URLs found:", invalidUrlsList);
      setIsSaving(false);
      return;
    }

    // Clean and format URLs before submission, removing empty URLs completely
    const cleanedProjects = projects.map((proj) => {
      const cleaned: any = { ...proj };

      // Handle project link URL - remove empty links entirely
      if (proj.link && proj.link.trim()) {
        const formattedLink = formatURL(proj.link.trim());
        if (formattedLink) {
          cleaned.link = formattedLink;
        } else {
          // If formatURL returns empty string (invalid URL), use original but with https://
          const fallbackLink = proj.link.trim();
          cleaned.link = fallbackLink.startsWith("http")
            ? fallbackLink
            : `https://${fallbackLink}`;
        }
      } else {
        // Delete the property entirely if empty to avoid validation errors
        delete cleaned.link;
      }

      // Handle project repository URL - remove empty repos entirely
      if (proj.project && proj.project.trim()) {
        const formattedProject = formatURL(proj.project.trim());
        if (formattedProject) {
          cleaned.project = formattedProject;
        } else {
          // If formatURL returns empty string (invalid URL), use original but with https://
          const fallbackProject = proj.project.trim();
          cleaned.project = fallbackProject.startsWith("http")
            ? fallbackProject
            : `https://${fallbackProject}`;
        }
      } else {
        // Delete the property entirely if empty to avoid validation errors
        delete cleaned.project;
      }

      return cleaned;
    });

    // Clean certification URLs with improved formatting
    const cleanedCertifications = certifications.map((cert) => {
      const cleaned = { ...cert };

      if (cert.credentialUrl && cert.credentialUrl.trim()) {
        const formattedUrl = formatURL(cert.credentialUrl.trim());
        if (formattedUrl) {
          cleaned.credentialUrl = formattedUrl;
        } else {
          // If formatURL returns empty string (invalid URL), use original but with https://
          const fallbackUrl = cert.credentialUrl.trim();
          cleaned.credentialUrl = fallbackUrl.startsWith("http")
            ? fallbackUrl
            : `https://${fallbackUrl}`;
        }
      } else {
        cleaned.credentialUrl = null;
      }

      return cleaned;
    });

    // Clean personal profile URLs with improved formatting
    const cleanedPersonalInfo = {
      ...personalInfo,
      // GitHub URL
      github: personalInfo.github?.trim()
        ? formatURL(personalInfo.github) ||
          (personalInfo.github.trim().startsWith("http")
            ? personalInfo.github.trim()
            : `https://${personalInfo.github.trim()}`)
        : null,
      // Portfolio URL
      portfolio: personalInfo.portfolio?.trim()
        ? formatURL(personalInfo.portfolio) ||
          (personalInfo.portfolio.trim().startsWith("http")
            ? personalInfo.portfolio.trim()
            : `https://${personalInfo.portfolio.trim()}`)
        : null,
      // Website URL
      website: personalInfo.website?.trim()
        ? formatURL(personalInfo.website) ||
          (personalInfo.website.trim().startsWith("http")
            ? personalInfo.website.trim()
            : `https://${personalInfo.website.trim()}`)
        : null,
    };

    const data: CV = {
      ...cleanedPersonalInfo,
      workExperience: workExperiences,
      education: educations,
      certifications: cleanedCertifications,
      projects: cleanedProjects,
      skills,
    };

    // Save the complete data to localStorage including achievements
    const d = removeIdFromCv(data);
    localStorage.setItem("cv", JSON.stringify(d));

    // Make sure we don't send any projects with empty URLs to the backend
    // as the backend requires valid URLs
    const processedData = {
      ...d,
      projects: d.projects?.map((proj) => {
        // Create a new object to avoid modifying the original
        const cleanedProj = { ...proj };
        // Only include links that are not empty strings
        if (cleanedProj.link === "") {
          delete cleanedProj.link; // Remove empty strings
        }
        if (cleanedProj.project === "") {
          delete cleanedProj.project; // Remove empty strings
        }
        return cleanedProj;
      }),
    };

    // Send the complete data to the backend including achievements
    const apiData = processedData;

    // Create the promise for saving CV data
    const savedCvPromise = axiosInstance.post("/cv/save-draft", apiData);

    toast.promise(savedCvPromise, {
      loading: "Saving your CV...",
      success: (response) => {
        // Get the CV data from the response
        const responseCV = removeIdFromCv(response?.data.data.data) as CV;
        console.log("Response from save:", responseCV);

        // The backend now stores achievements, so we can use them directly from the response
        // Just ensure each experience has an achievements array
        const workExpsWithAchievements = responseCV.workExperience?.map(
          (exp) => {
            return {
              ...exp,
              achievements: Array.isArray(exp.achievements)
                ? exp.achievements
                : [],
            };
          }
        );

        // Update state with data from the response
        setPersonalInfo({ ...responseCV });
        setWorkExperiences(workExpsWithAchievements || []);
        setEducations(responseCV.education);
        setCertifications(responseCV.certifications);
        setProjects(responseCV.projects);
        setSkills(responseCV.skills);

        return response?.data.message;
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          console.log("Error in savedCvPromise:", error);
          console.log("Request data:", apiData);

          // Check for specific error codes
          if (error.response?.status === 400) {
            // Extract the specific error message for validation errors
            const errorMessage = error.response?.data?.message || "";

            // Check for URL validation errors specifically
            if (
              errorMessage.includes("URL address") ||
              errorMessage.includes("link must be")
            ) {
              toast.error(
                "There's an issue with one of your URLs. Please check all website links and ensure they're in the correct format (https://example.com).",
                { duration: 8000 }
              );
              return "Please check all URLs in your CV and try again.";
            }

            return `Validation error: ${errorMessage}`;
          } else if (error.response?.status === 403) {
            // Credit limit reached or subscription issue
            toast.error(
              "You've reached your limit. Please upgrade your subscription to continue.",
              {
                duration: 6000,
                action: {
                  label: "Upgrade",
                  onClick: () => {
                    // Navigate to payment/subscription page
                    redirectToPayment();
                  },
                },
              }
            );
            return "Credit limit reached. Please upgrade your subscription.";
          } else if (error.response?.status === 429) {
            return "You've reached the usage limit. Please try again later.";
          }

          return "We couldn't save your CV. Please check your connection and try again.";
        } else {
          return "Something went wrong while saving. Please try again in a few minutes.";
        }
      },
      finally: () => {
        setIsSaving(false);
      },
    });

    try {
      await savedCvPromise;
    } catch (error) {
      // Error handling is already done in the toast.promise
      console.error("Error in savedCvPromise:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Create a version of skills without level information for download
  const getSkillsWithoutLevels = (skillsArray: Skill[]) => {
    return skillsArray.map((skill) => ({
      name: skill.name,
      level: undefined, // Remove level information
    }));
  };

  // Function to handle CV download
  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Use skills without level information
      const skillsForDownload = getSkillsWithoutLevels(skills);

      const html = generateCV(
        personalInfo,
        workExperiences,
        educations,
        certifications,
        projects,
        skillsForDownload,
        selectedTemplate
      );

      const opt = {
        margin: [0.3, 0, 0.3, 0],
        filename: `${personalInfo.firstName}_${personalInfo.lastName}_CV.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      // SECURITY FIX: Sanitize HTML before rendering to prevent XSS
      const element = document.createElement("div");
      element.innerHTML = sanitizeHTML(html);
      element.style.width = "8.27in";
      element.style.padding = "0.3in";

      await html2pdf().set(opt).from(element).save();

      toast.success("Your CV has been downloaded successfully!");
    } catch (error) {
      logger.error("Download error:", error);
      toast.error(
        "We couldn't download your CV. Please try again or check your browser settings."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to check user's credit status
  const checkCreditStatus = async () => {
    try {
      // Get user profile data instead of using a dedicated credits endpoint
      const response = await axiosInstance.get("/user/profile");
      console.log("User profile data:", response.data);

      // Extract credit information from user profile
      const userData = response.data.data;
      const credits = userData.totalCreditPoint || 0;
      const maxCredits = userData.maxCreditPoint || 10; // Default to 10 if not provided

      console.log(`Credit status: ${credits}/${maxCredits}`);

      // Calculate percentage of credits remaining
      const percentage = (credits / maxCredits) * 100;

      // Show warning if credits are running low
      if (percentage <= 20 && percentage > 5) {
        toast.warning(
          `You're running low on credits (${credits}/${maxCredits}). Consider upgrading your plan soon.`,
          {
            duration: 8000,
            action: {
              label: "Upgrade",
              onClick: () => redirectToPayment(),
            },
          }
        );
      } else if (percentage <= 5) {
        toast.error(
          `You're almost out of credits (${credits}/${maxCredits}). Upgrade now to continue using all features.`,
          {
            duration: 10000,
            action: {
              label: "Upgrade Now",
              onClick: () => redirectToPayment(),
            },
          }
        );
      }

      return { credits, maxCredits };
    } catch (error) {
      console.error("Error checking credit status:", error);
      return null;
    }
  };

  const handleFetchDraft = async () => {
    try {
      const response = await axiosInstance.get("/cv/draft");
      console.log("CV draft fetched:", response);

      // Check if we have valid data before updating state
      if (response?.data?.data) {
        const cv = removeIdFromCv(response.data.data) as CV;
        console.log("CV data:", cv);

        // Only update if we have valid data
        if (cv) {
          setPersonalInfo({
            firstName: cv.firstName || "",
            lastName: cv.lastName || "",
            email: cv.email || "",
            phone: cv.phone || "",
            address: cv.address || "",
            professionalTitle: cv.professionalTitle || "",
            professionalSummary: cv.professionalSummary || "",
            jobDescription: cv.jobDescription || "",
          });

          if (Array.isArray(cv.workExperience)) {
            // Ensure each experience has an achievements array if not provided from backend
            const workExpsWithAchievements = cv.workExperience.map((exp) => {
              return {
                ...exp,
                achievements: Array.isArray(exp.achievements)
                  ? exp.achievements
                  : [],
              };
            });

            console.log(
              "Work experiences with achievements:",
              workExpsWithAchievements
            );
            setWorkExperiences(workExpsWithAchievements);
          }

          if (Array.isArray(cv.education)) {
            setEducations(cv.education);
          }

          if (Array.isArray(cv.certifications)) {
            setCertifications(cv.certifications);
          }

          if (Array.isArray(cv.projects)) {
            setProjects(cv.projects);
          }

          if (Array.isArray(cv.skills)) {
            setSkills(cv.skills);
          }
        }
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        // Don't show an error to the user - just start with an empty form
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }

    // Check credit status after loading the draft, but don't block the UI if it fails
    try {
      await checkCreditStatus();
    } catch (error) {
      console.error("Failed to check credit status:", error);
      // Don't show an error to the user - this is a non-critical feature
      // We'll just proceed without showing credit warnings
    }
  };

  useEffect(() => {
    // Check if there's a pending save from before a payment redirect
    const pendingSave = localStorage.getItem("cv_pending_save");
    if (pendingSave) {
      try {
        const savedData = JSON.parse(pendingSave) as CV;

        // Show toast with restore option
        toast.info(
          "We found unsaved changes from before your payment. Would you like to restore them?",
          {
            duration: 10000,
            action: {
              label: "Restore",
              onClick: () => {
                // Restore data from localStorage
                if (savedData.firstName) setPersonalInfo(savedData);
                if (savedData.workExperience)
                  setWorkExperiences(savedData.workExperience);
                if (savedData.education) setEducations(savedData.education);
                if (savedData.certifications)
                  setCertifications(savedData.certifications);
                if (savedData.projects) setProjects(savedData.projects);
                if (savedData.skills) setSkills(savedData.skills);

                // Remove the pending save
                localStorage.removeItem("cv_pending_save");

                toast.success("Your unsaved changes have been restored!");
              },
            },
          }
        );
      } catch (error) {
        console.error("Error parsing pending CV data:", error);
        localStorage.removeItem("cv_pending_save");
      }
    }

    // Fetch draft from server
    handleFetchDraft();
  }, []);

  return (
    <main className="flex-1 overflow-auto max-w-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <div className="p-4 md:p-6">
          {/* Mobile header layout */}
          <div className="md:hidden flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-xl font-bold text-white">CV Builder</h1>
                  <p className="text-sm text-slate-400">
                    Create & optimize your CV
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[150px]">
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white w-full">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {cvTemplates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id}
                        className="text-white hover:bg-slate-700"
                      >
                        <div className="flex items-center">
                          <Palette className="w-4 h-4 mr-2" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 flex-1 justify-end">
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={handleSave}
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 flex-grow md:flex-grow-0"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? "..." : "Save"}
                </Button>
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-grow md:flex-grow-0"
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  {isGenerating ? "..." : "AI"}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-grow md:flex-grow-0"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isDownloading ? "..." : "PDF"}
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop header layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">CV Builder</h1>
                <p className="text-slate-400">
                  Create and optimize your professional CV
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger className="w-[200px] bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {cvTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id}
                      className="text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                disabled={isSaving}
                onClick={handleSave}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "AI Optimize"}
              </Button>
              {/* Enhanced Templates button temporarily commented out
              <Button
                onClick={() => setIsTemplateModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Palette className="w-4 h-4 mr-2" />
                Enhanced Templates
              </Button>
              */}
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download CV"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-8 w-full max-w-full overflow-x-hidden">
        {/* Personal Information */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
            <CardDescription className="text-slate-400">
              Basic details about yourself
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      firstName: e.target.value,
                    })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      lastName: e.target.value,
                    })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone: e.target.value })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-slate-300">
                  Address
                </Label>
                <Input
                  id="address"
                  value={personalInfo.address}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      address: e.target.value,
                    })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="professionalTitle" className="text-slate-300">
                  Professional Title
                </Label>
                <Input
                  id="professionalTitle"
                  value={personalInfo.professionalTitle}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      professionalTitle: e.target.value,
                    })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="professionalSummary" className="text-slate-300">
                Professional Summary
              </Label>
              <Textarea
                id="professionalSummary"
                value={personalInfo.professionalSummary}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    professionalSummary: e.target.value,
                  })
                }
                className="bg-slate-800 border-slate-600 text-white"
                required
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="jobDescription" className="text-slate-300">
                Job Description
              </Label>
              <Textarea
                id="jobDescription"
                value={personalInfo.jobDescription}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    jobDescription: e.target.value,
                  })
                }
                className="bg-slate-800 border-slate-600 text-white"
                required
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Work Experience</CardTitle>
                <CardDescription className="text-slate-400">
                  Your professional experience
                </CardDescription>
              </div>
              <Button
                onClick={addWorkExperience}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {workExperiences.map((exp, index) => (
              <div
                key={index}
                className="p-4 border border-slate-700 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-white">
                    Experience Entry
                  </h4>
                  <Button
                    onClick={() => removeWorkExperience(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Company</Label>
                    <Input
                      required
                      value={exp.company}
                      onChange={(e) =>
                        updateWorkExperience(index, "company", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Position</Label>
                    <Input
                      required
                      value={exp.position}
                      onChange={(e) =>
                        updateWorkExperience(index, "position", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Title</Label>
                    <Input
                      required
                      value={exp.title}
                      onChange={(e) =>
                        updateWorkExperience(index, "title", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Location</Label>
                    <Input
                      required
                      value={exp.location}
                      onChange={(e) =>
                        updateWorkExperience(index, "location", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Start Date</Label>
                    <Input
                      required
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "startDate", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">End Date</Label>
                    <Input
                      required
                      disabled={exp.isCurrentRole}
                      type="date"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "endDate", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <Label className="text-white">Current Role</Label>
                  </div>
                  <Switch
                    checked={exp.isCurrentRole}
                    onCheckedChange={(checked) =>
                      updateWorkExperience(index, "isCurrentRole", checked)
                    }
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateWorkExperience(index, "description", e.target.value)
                    }
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Describe your overall responsibilities and role. What were your day-to-day duties? What teams did you work with? What tools or technologies did you use regularly?"
                    rows={3}
                    required
                  />
                </div>

                {/* Achievements Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-slate-300">Achievements</Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Specific, measurable accomplishments that show your
                        impact
                      </p>
                    </div>
                    <Button
                      onClick={() => addAchievement(index)}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-blue-400 border-blue-500 hover:bg-blue-700 hover:text-white"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Achievement
                    </Button>
                  </div>

                  {exp.achievements.length === 0 && (
                    <div className="text-sm text-slate-400 italic">
                      Add key achievements with measurable results (e.g.,
                      "Increased sales by 20%", "Reduced costs by $50K", "Led
                      team of 5 developers").
                    </div>
                  )}

                  {exp.achievements.map((achievement, achievementIndex) => (
                    <div
                      key={achievementIndex}
                      className="flex items-center gap-2"
                    >
                      <Input
                        value={achievement}
                        onChange={(e) =>
                          updateAchievement(
                            index,
                            achievementIndex,
                            e.target.value
                          )
                        }
                        className="bg-slate-800 border-slate-600 text-white flex-1"
                        placeholder={`Achievement ${
                          achievementIndex + 1
                        }: e.g., "Increased revenue by 20%" or "Implemented process that saved 15 hours weekly"`}
                      />
                      <Button
                        onClick={() =>
                          removeAchievement(index, achievementIndex)
                        }
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {workExperiences.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No work experience added yet. Click "Add Experience" to get
                started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Education</CardTitle>
                <CardDescription className="text-slate-400">
                  Your educational background
                </CardDescription>
              </div>
              <Button
                onClick={addEducation}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {educations.map((edu, index) => (
              <div
                key={index}
                className="p-4 border border-slate-700 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-white">
                    Education Entry
                  </h4>
                  <Button
                    onClick={() => removeEducation(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Field of Study</Label>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        updateEducation(index, "fieldOfStudy", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Grade</Label>
                    <Input
                      type="text"
                      value={edu.grade}
                      onChange={(e) =>
                        updateEducation(index, "grade", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Start Date</Label>
                    <Input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(index, "startDate", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">End Date</Label>
                    <Input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(index, "endDate", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={edu.description}
                    onChange={(e) =>
                      updateEducation(index, "description", e.target.value)
                    }
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Describe what you studied, key courses, research projects or any notable academic achievements"
                    required
                    rows={3}
                  />
                </div>
              </div>
            ))}
            {educations.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No education added yet. Click "Add Education" to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/*Certifications*/}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Certification</CardTitle>
                <CardDescription className="text-slate-400">
                  Your certifications
                </CardDescription>
              </div>
              <Button
                onClick={addCertification}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="p-4 border border-slate-700 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-white">
                    Certification Entry
                  </h4>
                  <Button
                    onClick={() => removeCertification(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Name</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(index, "name", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Credential ID</Label>
                    <Input
                      value={cert.credentialId}
                      onChange={(e) =>
                        updateCertification(
                          index,
                          "credentialId",
                          e.target.value
                        )
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Issuer</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) =>
                        updateCertification(index, "issuer", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Date Issued</Label>
                    <Input
                      type="date"
                      value={cert.dateIssued}
                      onChange={(e) =>
                        updateCertification(index, "dateIssued", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Credential URL</Label>
                  <Input
                    type="text"
                    value={cert.credentialUrl}
                    onChange={(e) =>
                      updateCertification(
                        index,
                        "credentialUrl",
                        e.target.value
                      )
                    }
                    onBlur={(e) => {
                      if (e.target.value.trim() !== "") {
                        // Format URL on blur
                        updateCertification(
                          index,
                          "credentialUrl",
                          formatURL(e.target.value)
                        );
                      }
                    }}
                    className={`bg-slate-800 border-slate-600 text-white ${
                      cert.credentialUrl && !isValidURL(cert.credentialUrl)
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="https://credential.org/verify"
                    required
                  />
                  {cert.credentialUrl && !isValidURL(cert.credentialUrl) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid URL (e.g., "example.com" or
                      "https://example.com")
                    </p>
                  )}
                </div>
              </div>
            ))}
            {certifications.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No certifications added yet. Click "Add Certification" to get
                started.
              </div>
            )}
          </CardContent>
        </Card>

        {/*Projects*/}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Project</CardTitle>
                <CardDescription className="text-slate-400">
                  Your projects
                </CardDescription>
              </div>
              <Button
                onClick={addProject}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((proj, index) => (
              <div
                key={index}
                className="p-4 border border-slate-700 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-white">
                    Project Entry
                  </h4>
                  <Button
                    onClick={() => removeProject(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Name</Label>
                    <Input
                      value={proj.name}
                      onChange={(e) =>
                        updateProject(index, "name", e.target.value)
                      }
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Project Link</Label>
                    <Input
                      value={proj.project}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateProject(index, "project", value);
                        updateProject(index, "link", value);
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value.trim() !== "") {
                          // Format URL on blur
                          const formattedUrl = formatURL(value);
                          updateProject(index, "project", formattedUrl);
                          updateProject(index, "link", formattedUrl);
                        }
                      }}
                      className={`bg-slate-800 border-slate-600 text-white ${
                        proj.project && !isValidURL(proj.project)
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      placeholder="https://yourproject.com"
                      required
                    />
                    {proj.project && !isValidURL(proj.project) && (
                      <p className="text-red-500 text-xs mt-1">
                        Please enter a valid URL (e.g.,
                        "github.com/username/repo" or full URL)
                      </p>
                    )}
                  </div>
                </div>

                {/*<div>*/}
                {/*    <Label className="text-slate-300">Link</Label>*/}
                {/*    <Input*/}
                {/*        value={proj.link}*/}
                {/*        onChange={(e) => updateProject(index, 'link', e.target.value)}*/}
                {/*        className="bg-slate-800 border-slate-600 text-white"*/}
                {/*        required*/}
                {/*    />*/}
                {/*</div>*/}

                <div className="flex flex-col sm:flex-row items-end gap-4 sm:gap-2">
                  <div className="flex-1 w-full">
                    <Label htmlFor="technology" className="text-slate-300">
                      Technologies
                    </Label>
                    <Input
                      id="technology"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Enter a technology"
                      className="bg-slate-800 border-slate-600 text-white w-full"
                    />
                  </div>

                  <Button
                    onClick={addTechnology}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add</span>
                  </Button>
                </div>

                <div className="w-full flex flex-wrap gap-2">
                  {proj.technologies.map((tech, i) => (
                    <Badge
                      key={`tech-${index}-${i}`}
                      variant="secondary"
                      className="bg-blue-600/20 text-blue-400 border-blue-600/30 cursor-pointer hover:bg-red-600/20 hover:text-red-400"
                      onClick={() => removeTechnology(i, index)}
                    >
                      {tech} ×
                    </Badge>
                  ))}
                </div>

                <div>
                  <Label className="text-slate-300">Project Description</Label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No projects added yet. Click "Add Project" to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Skills</CardTitle>
            <CardDescription className="text-slate-400">
              Add your technical and soft skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4 sm:gap-2">
              <div className="flex-1 w-full">
                <Label htmlFor="skillName" className="text-slate-300">
                  Name
                </Label>
                <Input
                  id="skillName"
                  value={newSkill?.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  placeholder="Enter a skill name"
                  className="bg-slate-800 border-slate-600 text-white w-full"
                />
              </div>

              <div className="flex-1 w-full">
                <Label htmlFor="skillLevel" className="text-slate-300">
                  Level
                </Label>
                <Select
                  value={newSkill?.level}
                  onValueChange={(value: SkillLevel) =>
                    setNewSkill({ ...newSkill, level: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {skillLevels.map((skillLevel) => (
                      <SelectItem
                        key={skillLevel.id}
                        value={skillLevel.value}
                        className="text-white hover:bg-slate-700"
                      >
                        {skillLevel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={addSkill}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto mt-4 sm:mt-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Add Skill</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-400 border-blue-600/30 cursor-pointer hover:bg-red-600/20 hover:text-red-400"
                  onClick={() => removeSkill(index)}
                >
                  {skill.name} ×
                </Badge>
              ))}
            </div>

            {skills.length === 0 && (
              <div className="text-center py-4 text-slate-400">
                No skills added yet. Add your skills above.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced CV Template Modal */}
      <CVTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        personalInfo={personalInfo}
        workExperiences={workExperiences}
        educations={educations}
        certifications={certifications}
        projects={projects}
        skills={skills}
      />
    </main>
  );
}

/**
 * Removes ID fields from CV data and ensures proper array handling
 * This function is critical for API compatibility as the backend expects
 * arrays to be handled in a specific way
 */
const removeIdFromCv = (data: CV): CV => {
  // Create a clean object with basic personal info
  const cleanCV: CV = {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    professionalTitle: data.professionalTitle || "",
    professionalSummary: data.professionalSummary || "",
  };

  // Handle arrays safely with defensive programming
  if (data.workExperience && Array.isArray(data.workExperience)) {
    cleanCV.workExperience = data.workExperience.map((exp) => ({
      company: exp.company || "",
      position: exp.position || "",
      title: exp.title || exp.position || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description || "",
      location: exp.location || "",
      isCurrentRole: !!exp.isCurrentRole,
      achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
    }));
  } else {
    cleanCV.workExperience = [];
  }

  if (data.education && Array.isArray(data.education)) {
    cleanCV.education = data.education.map((edu) => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      grade: edu.grade || "",
      description: edu.description || "",
    }));
  } else {
    cleanCV.education = [];
  }

  if (data.certifications && Array.isArray(data.certifications)) {
    cleanCV.certifications = data.certifications.map((cert) => ({
      name: cert.name || "",
      issuer: cert.issuer || "",
      dateIssued: cert.dateIssued || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
    }));
  } else {
    cleanCV.certifications = [];
  }

  if (data.projects && Array.isArray(data.projects)) {
    cleanCV.projects = data.projects.map((proj) => ({
      name: proj.name || "",
      description: proj.description || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      project: proj.project || "",
      link: proj.link || "",
    }));
  } else {
    cleanCV.projects = [];
  }

  if (data.skills && Array.isArray(data.skills)) {
    cleanCV.skills = data.skills.map((skill) => ({
      name: skill.name || "",
      level: skill.level || ("BEGINNER" as SkillLevel),
    }));
  } else {
    cleanCV.skills = [];
  }

  return cleanCV;
};
