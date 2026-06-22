import { initDocPage, renderSections, example } from "../page-components/index";
import { createCarousel } from "../../src/index";

const done = initDocPage();

const app = document.getElementById("app") as HTMLElement;

const sections = [
  example(
    { title: "Alap Carousel", description: "Egyszerű carousel 3D perspective effektekkel, nyíl navigációval és dot indikátorokkal.", component: createCarousel },
    (parent) =>
      createCarousel({
        parent,
        id: "demo-carousel-1",
        slides: [
          { icon: "🚀", title: "Első slide", description: "Gyors indulás" },
          { icon: "Shield", title: "Második slide", description: "Biztonság" },
          { icon: "📊", title: "Harmadik slide", description: "Monitoring" },
          { icon: "🔄", title: "Negyedik slide", description: "CI/CD" },
        ],
        showArrows: true,
        showDots: true,
      }),
  ),
  example(
    { title: "Carousel CTA gombokkal", description: "Carousel slide-okonCTA gombokkal és hivatkozásokkal." },
    (parent) =>
      createCarousel({
        parent,
        id: "demo-carousel-2",
        slides: [
          {
            icon: "📖",
            title: "Olvasás",
            description: "Tiszta, olvasható CV",
            cta: { text: "Megnyitás →", href: "#" },
          },
          {
            icon: "📊",
            title: "Projektmenedzser",
            description: "Gantt chart",
            cta: { text: "Megnyitás →", href: "#" },
          },
          {
            icon: "📋",
            title: "Scrum Master",
            description: "Kanban / Scrum board",
            cta: { text: "Megnyitás →", href: "#" },
          },
        ],
        showArrows: true,
        showDots: true,
      }),
  ),
  example(
    { title: "Custom tartalommal", description: "Carousel egyedi tartalommal minden slide-ban." },
    (parent) =>
      createCarousel({
        parent,
        id: "demo-carousel-3",
        slides: [
          {
            title: "Kártya 1",
            content: { tag: "p", text: "Ez egyedi tartalom a slide-ban." },
          },
          {
            title: "Kártya 2",
            content: {
              tag: "ul",
              style: { listStyle: "disc", textAlign: "left", fontSize: "0.8rem" },
              children: [
                { tag: "li", text: "Első elem" },
                { tag: "li", text: "Második elem" },
                { tag: "li", text: "Harmadik elem" },
              ],
            },
          },
          {
            title: "Kártya 3",
            content: { tag: "p", text: "Harmadik egyedi slide." },
          },
        ],
        showArrows: true,
        showDots: true,
      }),
  ),
  example(
    { title: "Nyíl nélkül", description: "Carousel csak dot indikátorokkal, nyíl nélkül." },
    (parent) =>
      createCarousel({
        parent,
        id: "demo-carousel-4",
        slides: [
          { icon: "1️⃣", title: "Első" },
          { icon: "2️⃣", title: "Második" },
          { icon: "3️⃣", title: "Harmadik" },
          { icon: "4️⃣", title: "Negyedik" },
          { icon: "5️⃣", title: "Ötödik" },
        ],
        showArrows: false,
        showDots: true,
      }),
  ),
];

renderSections(sections);
done();
