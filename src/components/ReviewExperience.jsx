import React from "react";
import { Card, CardContent } from "../components/ui/Card";

const journalReviews = [
  "Pattern Recognition, Elsevier",
  "IEEE Access, IEEE",
  "Transactions on Emerging Telecommunications Technologies, Wiley",
  "Human-Centric Intelligent Systems, Springer",
  "PLOS Digital Health, PLOS",
  "Frontiers in Nutrition, Frontiers",
  "Frontiers in Oncology, Frontiers",
  "Computer Methods in Biomechanics and Biomedical Engineering, Taylor & Francis",
  "Artificial Intelligence and Applications, Bon View Publishing",
  "International Journal of Computing and Digital Systems, University of Bahrain, Bahrain",
];

const conferenceReviews = [
  {
    name: "WcCST-2026",
    date: "March 2026",
    title: "World Conference on Computational Science & Technology",
    location: "Punjab, India",
    publisher: "IEEE",
  },
  {
    name: "INCSTIC-2025",
    date: "October 2025",
    title: "1st Int. Conf. on Smart Technologies & Intelligent Computing",
    location: "Haryana, India",
    publisher: "CRC Press",
  },
  {
    name: "ICRTCIS-2025",
    date: "June 2025",
    title: "6th Int. Conf. on Recent Trends in Communication & Intelligent System",
    location: "Jaipur, Rajasthan, India",
    publisher: "Springer, IET",
  },
  {
    name: "InCACCT-2025",
    date: "April 2025",
    title: "3rd Int. Conf. on Advancement in Computation & Computer Technologies",
    location: "Jaipur, Rajasthan, India",
    publisher: "IEEE",
  },
  {
    name: "IISU-ASSET-2025",
    date: "March 2025",
    title: "Int. Conf. on AI Systems and Sustainable Technologies",
    location: "Jaipur, India",
    publisher: "Springer",
  },
  {
    name: "STI-2024",
    date: "December 2024",
    title: "6th Int. Conf. on Sustainable Technologies for Industry 5.0",
    location: "Dhaka, Bangladesh",
    publisher: "Springer",
  },
  {
    name: "ICRTAC-2024",
    date: "November 2024",
    title: "7th Int. Conf. on Recent Trends in Advanced Computing",
    location: "Chennai, India",
    publisher: "Springer",
  },
  {
    name: "ICETAI-2024",
    date: "September 2024",
    title: "2nd Int. Conf. on Emerging Trends and Applications in AI",
    location: "Baghdad, Iraq",
    publisher: "IEEE",
  },
  {
    name: "AIBThings-2024",
    date: "September 2024",
    title: "2nd Int. Conf. on AI, Blockchain, and IoT",
    location: "Michigan, USA",
    publisher: "IEEE",
  },
  {
    name: "ICSCPS-2024",
    date: "September 2024",
    title: "Int. Conf. on Smart Cyber-Physical Systems",
    location: "Delhi NCR, India",
    publisher: "IEEE",
  },
  {
    name: "ICCTAC-2024",
    date: "May 2024",
    title: "Int. Conf. on Current Trends in Advanced Computing",
    location: "Bengaluru, India",
    publisher: "Springer",
  },
  {
    name: "ICCCIS-2023",
    date: "November 2023",
    title: "4th Int. Conf. on Computing Communication, and Intelligent Systems",
    location: "Uttar Pradesh, India",
    publisher: "IEEE",
  },
];

const ReviewExperience = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20" id="review-experience">
      <h2 className="text-3xl font-bold text-center mb-12">Review Experience</h2>

      {/* Journal Reviews */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-6">Journal Article Reviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journalReviews.map((journal, index) => (
            <Card key={index}>
              <CardContent>
                <p className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                  {journal}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Conference Reviews */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">Conferences Review Experiences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {conferenceReviews.map((conf, index) => (
            <Card key={index}>
              <CardContent>
                <h4 className="text-lg font-semibold text-primary mb-1">{conf.name}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">{conf.date}</p>
                <p className="text-sm text-neutral-700 dark:text-neutral-200">{conf.title}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{conf.location}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Publication Partner: <span className="font-medium">{conf.publisher}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewExperience;
