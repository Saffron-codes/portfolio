const education = [
  {
    id: "sjce",
    degree: "B.E. in Electronics and Communication Engineering",
    school: "St. Joseph's College of Engineering, Chennai",
    start: "2021",
    end: "2025",
    detail: "CGPA: 7.0/10",
  },
  {
    id: "alpha",
    degree: "Higher Secondary",
    school: "Alpha Matriculation Higher Secondary School",
    start: "2019",
    end: "2021",
    detail: null,
  },
];

export default education;

/**
 * Images for the Education section.
 * - graduationPhoto: shown in the education panel and the plain view.
 * - certificateImage: printed inside the wall frame. Swap for the certificate scan when ready.
 */
export const educationMedia = {
  graduationPhoto: "/assets/graduation.webp",
  graduationAlt: "Saffron in a graduation gown, holding the degree certificate",
  certificateImage: "/assets/graduation.webp",
};
