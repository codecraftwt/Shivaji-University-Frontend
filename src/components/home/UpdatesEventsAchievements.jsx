import Button from "../Button";

const defaultUpdates = [
  "Shivaji University invites Expression Of Interest (EOI) for running Canteen. (Last Date: 20-09-2024)",
  "Workshop on Digital Media and Mass Communication (20th Sept 2024)",
];

const defaultEvents = [
  "राष्ट्रीय सेवा योजना, शिवाजी विद्यापीठ संलग्नित महाविद्यालयांसाठी विशेष शिबिर (दि. २४ सप्टेंबर २०२४)",
  "MONTHLY INNOVATION CHALLENGE - OCTOBER 2024",
];

const defaultAchievements = [
  "सुयश: आंतरराष्ट्रीय क्रीडा स्पर्धेत शिवाजी विद्यापीठाचे...",
  "सुयश: राज्यस्तरीय कुस्ती स्पर्धेत शिवाजी विद्यापीठाचे...",
  "Ankit Rao won Gold in 400m race...",
];

export default function UpdatesEventsAchievements({ data }) {
  const updates = data?.updates?.length ? data.updates.map((u) => u.title).filter(Boolean) : defaultUpdates;
  const events = data?.events?.length ? data.events.map((e) => e.title).filter(Boolean) : defaultEvents;
  const achievements = data?.achievements?.length ? data.achievements.map((a) => a.title).filter(Boolean) : defaultAchievements;

  const maxVisible = (list) => list.slice(0, 3);

  return (
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Updates */}
          <div className="bg-white border rounded shadow-sm relative pt-12 p-6">
            <h3 className="absolute -top-4 left-6 bg-white px-4 text-xl font-bold text-[#005bb5]">Updates</h3>
            <div className="space-y-4">
              {maxVisible(updates).map((title, i) => (
                <div key={i} className={i < maxVisible(updates).length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] font-bold text-[#005bb5] hover:text-[#ff7f00] leading-tight block">
                    {title}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="text-xs px-4 py-1.5">View More</Button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-[#004a99] text-white border rounded shadow-sm relative pt-12 p-6">
            <h3 className="absolute -top-4 left-6 bg-[#004a99] px-4 text-xl font-bold">Upcoming Events</h3>
            <div className="space-y-4">
              {maxVisible(events).map((title, i) => (
                <div key={i} className={i < maxVisible(events).length - 1 ? "pb-4 border-b border-blue-800" : ""}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] font-bold leading-tight block hover:text-orange-300">
                    {title}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="text-xs px-4 py-1.5">View More</Button>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white border rounded shadow-sm relative pt-12 p-6">
            <h3 className="absolute -top-4 left-6 bg-white px-4 text-xl font-bold text-[#005bb5]">Achievements</h3>
            <div className="space-y-4">
              {maxVisible(achievements).map((title, i) => (
                <div key={i} className={i < maxVisible(achievements).length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] font-bold text-[#005bb5] hover:text-[#ff7f00] leading-tight block">
                    {title}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="text-xs px-4 py-1.5">View More</Button>
            </div>
          </div>
        </div>
      </section>
  );
}
