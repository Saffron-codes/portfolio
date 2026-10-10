import ProjectsScreen, { PROJECTS_DESIGN } from "./ProjectsScreen";
import ExperienceEditor, { EXPERIENCE_DESIGN } from "./ExperienceEditor";
import SkillsPanel, { SKILLS_DESIGN } from "./SkillsPanel";
import ContactChat, { CONTACT_DESIGN } from "./ContactChat";
import AboutPage, { ABOUT_DESIGN } from "./AboutPage";
import DeskpulseCard, { DESKPULSE_DESIGN } from "./DeskpulseCard";
import EducationCard, { EDUCATION_DESIGN } from "./EducationCard";
import ChennaiCard, { CHENNAI_DESIGN } from "./ChennaiCard";

/** Section id → panel component and its design size in px (aspect matches the 3D panel rect). */
export const PANELS = {
  projects: { Component: ProjectsScreen, design: PROJECTS_DESIGN },
  experience: { Component: ExperienceEditor, design: EXPERIENCE_DESIGN },
  skills: { Component: SkillsPanel, design: SKILLS_DESIGN },
  contact: { Component: ContactChat, design: CONTACT_DESIGN },
  about: { Component: AboutPage, design: ABOUT_DESIGN },
  deskpulse: { Component: DeskpulseCard, design: DESKPULSE_DESIGN },
  education: { Component: EducationCard, design: EDUCATION_DESIGN },
  chennai: { Component: ChennaiCard, design: CHENNAI_DESIGN },
};
