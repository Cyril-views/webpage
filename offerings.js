const offerings = {
  status: "Founding Cohort offer",
  currency: "INR",
  delivery: "Live online cohort",
  weeklySchedule: "2-3 live classes per week, about 1.5-2 hours per class",
  learnerSupport: "Assignments, guided labs, session recordings, and learner support",
  cohortStart: "Next start date to be announced",
  tuitionNote: "Cohort dates, final fees, inclusions, and any applicable taxes are confirmed in the written offer before enrollment or payment.",
  courses: [
    { id: "python", name: "Python Foundations", duration: "8 weeks", liveHours: "32-36 hours", launchPrice: 7999, regularPrice: 9999 },
    { id: "sql", name: "SQL & Analytics", duration: "8 weeks", liveHours: "30-36 hours", launchPrice: 7999, regularPrice: 9999 },
    { id: "bigquery", name: "GCP Data Engineering Professional Program", duration: "14-16 weeks", liveHours: "60+ hours", launchPrice: 17999, regularPrice: 21999 },
    { id: "gcp", name: "Google Cloud Foundations", duration: "8 weeks", liveHours: "30-36 hours", launchPrice: 8999, regularPrice: 11999 },
    { id: "ai-ml", name: "AI, ML, Deep Learning & GenAI", duration: "18 weeks", liveHours: "75-90 hours", launchPrice: 24999, regularPrice: 29999 },
    { id: "other-services", name: "Data Engineering Tools & Workflows", duration: "10-12 weeks", liveHours: "45-55 hours", launchPrice: 14999, regularPrice: 18999 },
    { id: "maths", name: "Maths & Statistics for Data", duration: "6-8 weeks", liveHours: "24-30 hours", launchPrice: 4999, regularPrice: 6999 },
    { id: "english", name: "Technical Communication", duration: "4 weeks", liveHours: "12-16 hours", launchPrice: 2999, regularPrice: 3999 },
    { id: "soft-skills", name: "Professional Skills & Career Preparation", duration: "4 weeks", liveHours: "12-16 hours", launchPrice: 2999, regularPrice: 3999 }
  ],
  bundles: [
    { id: "data-analyst", name: "Data Analyst Track", courseIds: ["python", "sql", "maths"], priceLabel: "₹17,999", priceInr: 17999 },
    { id: "gcp-data-engineer", name: "GCP Data Engineer Track", courseIds: ["python", "sql", "gcp", "bigquery"], priceLabel: "₹34,999", priceInr: 34999 },
    { id: "ai-ml-engineer", name: "AI/ML Engineer Track", courseIds: ["python", "maths", "ai-ml"], priceLabel: "₹39,999-₹44,999", priceInr: null },
    { id: "complete-data-ai", name: "Complete Data + AI Track", courseIds: ["python", "sql", "maths", "gcp", "bigquery", "other-services", "ai-ml", "soft-skills"], priceLabel: "₹59,999-₹69,999", priceInr: null }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = offerings;
} else {
  window.YHatOfferings = offerings;
}