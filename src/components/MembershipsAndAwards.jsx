import React from "react";
import { FaAward, FaUserTie } from "react-icons/fa";

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
    <section id="memberships-awards" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Professional Recognition
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Memberships in professional organizations and academic honors received
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Memberships */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUserTie className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Professional Memberships
              </h3>
            </div>

            <div className="space-y-6">
              {memberships.map((item, index) => (
                <div key={index} className="pl-4 border-l-4 border-blue-200">
                  <div className="flex justify-between items-start flex-wrap gap-y-2">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {item.organization}
                    </h4>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{item.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaAward className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Honors & Awards
              </h3>
            </div>

            <div className="space-y-6">
              {awards.map((award, index) => (
                <div key={index} className="pl-4 border-l-4 border-green-200">
                  <div className="flex justify-between items-start flex-wrap gap-y-2">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {award.title}
                    </h4>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {award.session}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipsAndAwards;