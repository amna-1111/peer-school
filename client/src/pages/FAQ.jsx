import { useState } from "react";
import { Helmet } from "react-helmet-async";

const faqData = [
  {
    question: "How does PeerSchool work?",
    answer:
      "PeerSchool is a community where users teach skills they master and learn new ones from others. You can browse skill listings, book an available time slot, and attend a virtual or in-person session once the instructor confirms."
  },
  {
    question: "Is there a cost for sessions?",
    answer:
      "PeerSchool is built on the principle of peer exchange. While we are currently in a community-beta phase, the goal is to foster knowledge sharing. Check individual skill listings for specific details provided by the instructor."
  },
  {
    question: "How do I become an instructor?",
    answer:
      "Everyone is an instructor! Go to your Profile, add a 'Skill Listing' with a title, description, and category, and then set your availability slots. Once you do that, your skill will appear in the 'Browse' section for others to book."
  },
  {
    question: "What happens if I need to cancel a session?",
    answer:
      "You can cancel a session from your 'My Sessions' dashboard. We ask that you provide at least 24 hours notice out of respect for your peer's time. Cancelled sessions will notify the other party via email."
  },
  {
    question: "How do I join the actual session?",
    answer:
      "Once a session is 'Confirmed,' you and the instructor can coordinate the meeting location or link. Many of our users use Zoom, Google Meet, or meet at local libraries and cafes."
  },
  {
    question: "How do ratings and reviews work?",
    answer:
      "After a session is marked as 'Completed' by the instructor, the learner can leave a star rating and a written review. This helps build trust within the community and recognizes great teachers."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>FAQ - PeerSchool</title>
      </Helmet>

      {/* Hero Header */}
      <div className="bg-[#5395EF] pt-16 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-4">
            How can we help?
          </h1>
          <p className="text-blue-100 text-lg font-medium opacity-90">
            Everything you need to know about learning and teaching on
            PeerSchool.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-xl shadow-blue-900/5 border border-gray-100">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 ${
                  openIndex === index
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-gray-100 bg-white"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span
                    className={`font-bold text-lg ${openIndex === index ? "text-blue-600" : "text-gray-800"}`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`transform transition-transform duration-300 text-blue-500 font-bold text-2xl ${openIndex === index ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 pt-0 text-gray-500 leading-relaxed border-t border-blue-100/50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support CTA */}
          <div className="mt-12 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
            <h3 className="font-bold text-gray-800 mb-2 text-xl">
              Still have questions?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              We're here to help you get the most out of your learning journey.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
