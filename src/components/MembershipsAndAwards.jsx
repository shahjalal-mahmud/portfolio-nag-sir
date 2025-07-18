import React from "react";

const memberships = [
  {
    organization: "Institute of Electrical and Electronics Engineers (IEEE)",
    period: "From 2023 - Now",
    role: "Graduate Student Member & IEEE Young Professionals",
  },
  {
    organization: "International Association of Engineers (IAENG)",
    period: "From 2023 - Now",
    role: "Professional Member",
  },
];

const awards = [
  {
    title: "National Science and Technology (NST) Fellowship",
    session: "Session: 2023-2024",
    description: "Ministry of Science and Technology, Bangladesh",
  },
  {
    title: "Dean's List",
    session: "Session: 2020-2021",
    description:
      "Awarded the Dean's List Student accolade for exceptional academic performance in the B.Tech (Computer Science Engineering) Program at Adamas University.",
  },
  {
    title: "Merit Scholarship",
    session: "Session: 2020-2021",
    description:
      "The Adamas University Merit Scholarship for the 2020-2021 session is awarded based on academic performance.",
  },
];

const MembershipsAndAwards = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12" id="memberships-awards">
      {/* Memberships */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-primary inline-block">
          Membership of Scientific Societies
        </h2>
        <div className="space-y-6">
          {memberships.map((item, index) => (
            <div
              key={index}
              className="border border-base-200 rounded-xl p-4 hover:shadow-md transition duration-300 bg-base-100"
            >
              <h3 className="text-lg font-semibold text-primary">
                {item.organization}
              </h3>
              <p className="text-sm text-gray-500 italic">{item.period}</p>
              <p className="mt-1 text-sm">{item.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Honors and Awards */}
      <div>
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-secondary inline-block">
          Honors and Awards
        </h2>
        <div className="space-y-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="border border-base-200 rounded-xl p-4 hover:shadow-md transition duration-300 bg-base-100"
            >
              <h3 className="text-lg font-semibold text-secondary">
                {award.title}
              </h3>
              <p className="text-sm text-gray-500 italic">{award.session}</p>
              <p className="mt-1 text-sm">{award.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipsAndAwards;
