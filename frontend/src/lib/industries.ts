/**
 * Examples of what we can build. These are not past clients, and the page says so: the
 * brand rule is never to invent client details.
 */
export const industries = [
  {
    slug: "shops-and-retail",
    icon: "store",
    title: "Shops and retailers",
    short: "Sell online and keep track of your stock.",
    problem: "Stock kept in notebooks or spreadsheets, and customers who can only buy from you in person.",
    builds: ["An online store with products you can manage yourself", "Stock and sales tracking", "Order updates for your customers"],
    service: "website-development",
  },
  {
    slug: "clinics-and-healthcare",
    icon: "clinic",
    title: "Clinics and healthcare",
    short: "Take bookings online and organise your records.",
    problem: "Appointments taken over the phone, and records spread across paper files.",
    builds: ["Online appointment booking", "Patient and visit records with restricted access", "A clear website for your services and doctors"],
    service: "web-application-development",
  },
  {
    slug: "schools-and-training",
    icon: "school",
    title: "Schools and training",
    short: "Manage students, classes and fees in one place.",
    problem: "Class details, payments and results all tracked by hand.",
    builds: ["Student and class management", "Fee tracking and reminders", "A site for courses, notices and enrolment"],
    service: "custom-software-development",
  },
  {
    slug: "restaurants-and-tourism",
    icon: "food",
    title: "Restaurants, hotels and tourism",
    short: "Let guests see what you offer and book directly.",
    problem: "Bookings arriving by phone, Facebook and WhatsApp, with nothing in one place.",
    builds: ["A website for your menu, rooms or tours", "A reservation and booking system", "A simple view of the day for your staff"],
    service: "website-development",
  },
  {
    slug: "professional-services",
    icon: "briefcase",
    title: "Professional services",
    short: "Look the part and keep client work organised.",
    problem: "Client files and tasks spread across email, chat and spreadsheets.",
    builds: ["A professional company website", "A secure portal for your clients", "Task and document tracking for your team"],
    service: "web-application-development",
  },
  {
    slug: "growing-companies",
    icon: "growth",
    title: "Startups and growing companies",
    short: "Test an idea, or replace what you have outgrown.",
    problem: "A new idea to try out, or a way of working that has outgrown spreadsheets.",
    builds: ["A first version of your product", "Dashboards and internal tools", "Connections between the tools you already use"],
    service: "custom-software-development",
  },
] as const;
