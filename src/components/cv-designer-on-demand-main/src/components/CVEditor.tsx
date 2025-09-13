import React from "react";
import { CVData } from "./CVData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

interface CVEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export default function CVEditor({ data, onChange }: CVEditorProps) {
  // Update personalInfo fields
  const updatePersonalInfo = (
    field: keyof CVData["personalInfo"],
    value: string
  ) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  // Update summary
  const updateSummary = (value: string) => {
    onChange({ ...data, summary: value });
  };

  // Experience section
  const updateExperience = (
    index: number,
    field: keyof CVData["experience"][0],
    value: string | string[]
  ) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };
  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        {
          position: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: [""],
        },
      ],
    });
  };
  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    });
  };

  // Education section
  const updateEducation = (
    index: number,
    field: keyof CVData["education"][0],
    value: string
  ) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };
  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        { degree: "", institution: "", location: "", year: "", gpa: "" },
      ],
    });
  };
  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    });
  };

  // Skills section
  const updateSkill = (
    type: keyof CVData["skills"],
    index: number,
    value: string
  ) => {
    const newSkills = { ...data.skills };
    if (type === "technical" || type === "other") {
      newSkills[type] = [...newSkills[type]];
      newSkills[type][index] = value;
    } else if (type === "languages") {
      newSkills.languages = [...newSkills.languages];
      newSkills.languages[index] = {
        ...newSkills.languages[index],
        name: value,
      };
    }
    onChange({ ...data, skills: newSkills });
  };
  const addSkill = (type: keyof CVData["skills"]) => {
    const newSkills = { ...data.skills };
    if (type === "technical" || type === "other") {
      newSkills[type] = [...newSkills[type], ""];
    } else if (type === "languages") {
      newSkills.languages = [...newSkills.languages, { name: "", level: "" }];
    }
    onChange({ ...data, skills: newSkills });
  };
  const removeSkill = (type: keyof CVData["skills"], index: number) => {
    const newSkills = { ...data.skills };
    if (type === "technical" || type === "other") {
      newSkills[type] = newSkills[type].filter((_, i) => i !== index);
    } else if (type === "languages") {
      newSkills.languages = newSkills.languages.filter((_, i) => i !== index);
    }
    onChange({ ...data, skills: newSkills });
  };

  // Update language level
  const updateLanguageLevel = (index: number, value: string) => {
    const newSkills = { ...data.skills };
    newSkills.languages = [...newSkills.languages];
    newSkills.languages[index] = {
      ...newSkills.languages[index],
      level: value,
    };
    onChange({ ...data, skills: newSkills });
  };

  // Projects section
  const updateProject = (
    index: number,
    field: keyof CVData["projects"][0],
    value: string | string[]
  ) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...data, projects: newProjects });
  };
  const addProject = () => {
    onChange({
      ...data,
      projects: [
        ...data.projects,
        { name: "", description: "", technologies: [""], link: "" },
      ],
    });
  };
  const removeProject = (index: number) => {
    onChange({
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 p-6 h-full overflow-y-auto">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Personal Information
        </h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={data.personalInfo.title}
              onChange={(e) => updatePersonalInfo("title", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-primary">Summary</h3>
        <Textarea
          value={data.summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={4}
          className="input-field"
        />
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Skills</h3>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Technical Skills</h4>
          {data.skills.technical.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={skill}
                onChange={(e) =>
                  updateSkill("technical", index, e.target.value)
                }
                className="input-field flex-1"
              />
              <Button
                onClick={() => removeSkill("technical", index)}
                size="icon"
                variant="destructive"
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => addSkill("technical")}
            size="sm"
            className="btn-primary mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Technical Skill
          </Button>
        </div>
        <div className="space-y-2 mt-4">
          <h4 className="font-semibold">Languages</h4>
          {data.skills.languages.map((lang, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={lang.name}
                onChange={(e) =>
                  updateSkill("languages", index, e.target.value)
                }
                className="input-field flex-1"
                placeholder="Language"
              />
              <Input
                value={lang.level}
                onChange={(e) => updateLanguageLevel(index, e.target.value)}
                className="input-field flex-1"
                placeholder="Level"
              />
              <Button
                onClick={() => removeSkill("languages", index)}
                size="icon"
                variant="destructive"
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => addSkill("languages")}
            size="sm"
            className="btn-primary mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Language
          </Button>
        </div>
        <div className="space-y-2 mt-4">
          <h4 className="font-semibold">Other Skills</h4>
          {data.skills.other.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={skill}
                onChange={(e) => updateSkill("other", index, e.target.value)}
                className="input-field flex-1"
              />
              <Button
                onClick={() => removeSkill("other", index)}
                size="icon"
                variant="destructive"
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => addSkill("other")}
            size="sm"
            className="btn-primary mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Other Skill
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Experience</h3>
          <Button onClick={addExperience} size="sm" className="btn-primary">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <Card key={index} className="p-3 bg-secondary/30">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, "position", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(index, "location", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(index, "startDate", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(index, "endDate", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  {exp.description.map((desc, dIndex) => (
                    <div key={dIndex} className="flex gap-2 mt-2">
                      <Textarea
                        value={desc}
                        onChange={(e) => {
                          const newDesc = [...exp.description];
                          newDesc[dIndex] = e.target.value;
                          updateExperience(index, "description", newDesc);
                        }}
                        rows={2}
                        className="input-field flex-1"
                      />
                      <Button
                        onClick={() => {
                          const newDesc = exp.description.filter(
                            (_, i) => i !== dIndex
                          );
                          updateExperience(index, "description", newDesc);
                        }}
                        size="icon"
                        variant="destructive"
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      updateExperience(index, "description", [
                        ...exp.description,
                        "",
                      ]);
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Description
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove Experience
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Education</h3>
          <Button onClick={addEducation} size="sm" className="btn-primary">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {data.education.map((edu, index) => (
            <Card key={index} className="p-3 bg-secondary/30">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(index, "location", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) =>
                      updateEducation(index, "year", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <Label>GPA</Label>
                  <Input
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      updateEducation(index, "gpa", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  onClick={() => removeEducation(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Projects</h3>
          <Button onClick={addProject} size="sm" className="btn-primary">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {data.projects.map((proj, index) => (
            <Card key={index} className="p-3 bg-secondary/30">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) =>
                      updateProject(index, "name", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <Label>Link</Label>
                  <Input
                    value={proj.link || ""}
                    onChange={(e) =>
                      updateProject(index, "link", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    rows={2}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2 mt-2">
                  <Label>Technologies</Label>
                  {proj.technologies.map((tech, tIndex) => (
                    <div key={tIndex} className="flex gap-2 mt-2">
                      <Input
                        value={tech}
                        onChange={(e) => {
                          const newTech = [...proj.technologies];
                          newTech[tIndex] = e.target.value;
                          updateProject(index, "technologies", newTech);
                        }}
                        className="input-field flex-1"
                      />
                      <Button
                        onClick={() => {
                          const newTech = proj.technologies.filter(
                            (_, i) => i !== tIndex
                          );
                          updateProject(index, "technologies", newTech);
                        }}
                        size="icon"
                        variant="destructive"
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      updateProject(index, "technologies", [
                        ...proj.technologies,
                        "",
                      ]);
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Technology
                  </Button>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  onClick={() => removeProject(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
