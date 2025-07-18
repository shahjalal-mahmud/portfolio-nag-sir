const references = [
  {
    name: "Dr. Anupam Kumar Bairagi",
    title: "Professor",
    institution: "Computer Science and Engineering Discipline, Khulna University",
    location: "Khulna-9208, Bangladesh",
    email: "anupam@cse.ku.ac.bd",
    link: "https://ku.ac.bd/discipline/cse/faculty/anupam",
  },
  {
    name: "Dr. C Kishor Kumar Reddy",
    title: "Associate Professor and Head of the Department",
    institution:
      "Department of Computer Science and Engineering, Stanley College of Engineering & Technology for Women",
    location: "Hyderabad, Telangana, India",
    email: "drckkreddy@gmail.com",
  },
];

const References = () => {
  return (
    <section id="references" className="py-16 px-4 md:px-10 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-left">References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {references.map((ref, index) => (
            <div
              key={index}
              className="border border-base-300 rounded-xl p-6 bg-base-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-primary">
                {ref.link ? (
                  <a
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {ref.name}
                  </a>
                ) : (
                  ref.name
                )}
              </h3>
              <p className="mt-1">{ref.title}</p>
              <p className="text-sm mt-1 text-gray-600">{ref.institution}</p>
              <p className="text-sm text-gray-600">{ref.location}</p>
              <p className="mt-3">
                <span className="font-medium">Email: </span>
                <a
                  href={`mailto:${ref.email}`}
                  className="text-blue-600 underline"
                >
                  {ref.email}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default References;
