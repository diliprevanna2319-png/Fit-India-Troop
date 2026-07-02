/* =============================================================================
   FIT INDIA TROOP — SINGLE SOURCE OF TRUTH
   Edit everything here. No need to touch any other file.
   Prices, contact details, hours, social links, plans, programs, trainers,
   testimonials and image filenames are all driven from this object.
   ============================================================================= */

export const CONFIG = {

  /* ---- Brand ---- */
  brand: {
    name: "Fit India Troop",
    tagline: "Premium Fitness & Performance Center",
    logo: "assets/logo.png",
    city: "Tumakuru, Karnataka",
  },

  /* ---- Contact ---- */
  contact: {
    phonePrimary: "8971749222",
    phoneSecondary: "6366618201",
    // WhatsApp number in international format (no +, no spaces)
    whatsapp: "918971749222",
    email: "info@fitindiatroop.com",
    address: "Tumakuru, Karnataka, India",
    // Embedded map pinned to the exact Fit India Troop location
    mapEmbed: "https://www.google.com/maps?q=Fit+India+Troop&ll=13.3111105,77.1296479&z=16&output=embed",
    mapLink: "https://maps.app.goo.gl/EgJygeCYYQEfgJms7",
    directions: "https://www.google.com/maps/dir/?api=1&destination=13.3111105,77.1296479&destination_place_id=Fit+India+Troop",
    landmark: "Central Tumakuru",
    parking: "Free on-site parking available",
  },

  /* ---- Social links (leave "" to hide the icon) ---- */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },

  /* ---- Business hours ---- */
  hours: [
    { day: "Monday – Saturday", time: "Morning & Evening Batches" },
    { day: "Sunday", time: "Limited Hours" },
    { day: "Public Holidays", time: "By Schedule" },
  ],

  /* ---- Animated stat counters ---- */
  stats: [
    { value: 8,    suffix: "+",  label: "Years of Experience" },
    { value: 2500, suffix: "+",  label: "Happy Members" },
    { value: 600,  suffix: "+",  label: "Transformations" },
    { value: 15,   suffix: "+",  label: "Professional Trainers" },
    { value: 120,  suffix: "+",  label: "Equipment Count" },
  ],

  /* ---- Rotating motivational words (left rail) ---- */
  words: ["DISCIPLINE", "POWER", "STRENGTH", "CONSISTENCY", "ENDURANCE", "FOCUS"],

  /* ---- Membership plans (edit prices freely) ---- */
  plans: [
    { name: "Daily Pass",  price: "₹250",    per: "/ day",   popular: false,
      perks: ["Full gym floor access", "Cardio & strength zones", "No commitment"] },
    { name: "1 Month",     price: "₹3,776",  per: "/ month", popular: false,
      perks: ["Full gym access", "Group classes", "Locker facility"] },
    { name: "3 Months",    price: "₹7,772",  per: "/ quarter", popular: true,
      perks: ["Everything in Monthly", "1 free fitness assessment", "Diet guidance"] },
    { name: "6 Months",    price: "₹11,210", per: "/ 6 months", popular: false,
      perks: ["Everything in Quarterly", "Personalised workout plan", "Recovery zone access"] },
    { name: "12 Months",   price: "₹18,140", per: "/ year",  popular: false,
      perks: ["Best value", "Priority coaching", "Full recovery access"] },
  ],
  // Other durations available at the desk
  extraPlans: [
    { name: "2 Months", price: "₹5,792" },
    { name: "8 Months", price: "₹12,345" },
    { name: "9 Months", price: "₹13,100" },
  ],
  planNote: "No free trial classes. Daily pass available at ₹250/day.",

  /* ---- Training programs ---- */
  programs: [
    { icon: "💪", title: "Strength Training",   desc: "Progressive overload with commercial-grade racks and free weights." },
    { icon: "🏋️", title: "Muscle Building",     desc: "Hypertrophy-focused programming to add quality lean mass." },
    { icon: "🔥", title: "Weight & Fat Loss",   desc: "Structured fat-loss coaching that keeps the results for good." },
    { icon: "⚡", title: "HIIT",                 desc: "High-intensity intervals that torch calories and build engine." },
    { icon: "🤸", title: "Functional Training", desc: "Move better, lift heavier, and stay injury-free for life." },
    { icon: "🥊", title: "CrossFit",             desc: "Strength, endurance, speed & conditioning in one session." },
    { icon: "🏃", title: "Cardio",               desc: "Dedicated cardio zone to build stamina and heart health." },
    { icon: "🎯", title: "Personal Training",    desc: "One-on-one coaching built entirely around your goals." },
    { icon: "🌸", title: "Women's Fitness",      desc: "Focused programming in a supportive, motivating environment." },
    { icon: "🧘", title: "Mobility & Recovery",  desc: "Flexibility work plus sauna & steam to recover stronger." },
  ],

  /* ---- Testimonials / success stories ---- */
  testimonials: [
    { name: "Rahul K.",   result: "Lost 14 kg in 5 months", img: "assets/images/member-1.jpg",
      quote: "The coaches actually care. My technique, energy and confidence have completely transformed." },
    { name: "Priya S.",   result: "First pull-up in 3 months", img: "assets/images/member-2.jpg",
      quote: "From never training to competing in CrossFit. Fit India Troop changed how I see myself." },
    { name: "Arjun M.",   result: "Gained 8 kg lean muscle", img: "assets/images/member-3.jpg",
      quote: "The strength coaching gave me discipline I carry into every part of life. Best decision I made." },
  ],

  /* ---- Gallery images (drop into assets/images/, list filenames) ----
     Add or remove freely; the masonry + lightbox rebuild automatically. */
  gallery: [
    "assets/images/gym-1.jpg",
    "assets/images/gym-2.jpg",
    "assets/images/gym-3.jpg",
    "assets/images/gym-4.jpg",
    "assets/images/gym-5.jpg",
    "assets/images/gym-6.jpg",
    "assets/images/gym-7.jpg",
  ],

  /* ---- Hero / About feature images ---- */
  images: {
    aboutPrimary: "assets/images/gym-5.jpg",
    aboutSecondary: "assets/images/gym-4.jpg",
  },

  /* ---- FAQ ---- */
  faq: [
    { q: "Is Fit India Troop suitable for beginners?", a: "Absolutely. We welcome members of all fitness levels and our coaches scale every workout to your ability." },
    { q: "Do you provide personal trainers?", a: "Yes. Certified trainers are available to guide your fitness journey with fully personalised plans." },
    { q: "Do you have CrossFit?", a: "Yes. We run structured CrossFit sessions combining strength, endurance, agility and conditioning for all experience levels." },
    { q: "Do you have steam and sauna?", a: "Yes. Members can access our premium recovery facilities including a steam room and sauna." },
    { q: "Is there a free trial?", a: "We do not offer free trial classes, but a Daily Pass is available at ₹250/day so you can experience the facility." },
    { q: "Is parking available?", a: "Yes — free on-site parking is available for all members and visitors." },
    { q: "Do you offer body transformation programs?", a: "Yes. Our coaches create personalised plans for weight loss, muscle gain and overall fitness." },
  ],
};
