import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Do you supply the hardware or do I buy it?",
    answer:
      "Either way. We give you an exact parts list with links so you can buy locally, or we source the components and bill them at cost. Buying locally is usually faster and cheaper once shipping is counted.",
  },
  {
    question: "Do I get the circuit diagram and the source code?",
    answer:
      "Yes. Every build is handed over with the wiring diagram, the full firmware source, a parts list and a setup guide — so you or anyone else can rebuild, repair or extend it later.",
  },
  {
    question: "Can you help with a final-year engineering project?",
    answer:
      "Yes, as a build partner: we design the circuit, write the firmware and document how it works so you can explain and defend every part of it. We will not sit an assessment or write your academic submission for you.",
  },
  {
    question: "Can a prototype be turned into a real product later?",
    answer:
      "Often. A breadboard proof of concept can move to a custom PCB, an enclosure and a small production run. We tell you up front which parts of the prototype will survive that move and which will need redesigning.",
  },
];

export const metadata = pageMeta({
  title: "DIY Tech & IoT Projects — Raspberry Pi, Arduino & ESP32 Builds",
  description:
    "DIY tech and IoT project development: Raspberry Pi, Arduino and ESP32 prototypes, home and workshop automation, sensor dashboards and engineering project builds with full source and documentation.",
  path: "/services/diy-tech",
  keywords: [
    "iot project development",
    "arduino project development service",
    "raspberry pi project help",
    "esp32 iot prototype",
    "final year engineering project development",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function DiyTechServicePage() {
  const pricing = await getServicePricing("diy-tech");
  return (
    <>
      <ServiceSeo slug="diy-tech" faqs={faqs} />
      <ServiceDetail
        title="DIY Tech Projects"
        category="IoT & Hardware Prototyping 🔧"
        icon="fa-microchip"
        color="#facc15"
        gradient="from-yellow-400 to-amber-500"
        targetAudience={[
          "Engineering students & project teams",
          "Makers with an idea and no firmware skills",
          "Small factories automating a manual step",
          "Startups needing a hardware proof of concept",
          "Businesses wanting sensor dashboards",
        ]}
        features={[
          "Raspberry Pi, Arduino & ESP32 builds",
          "Sensor wiring and circuit design",
          "Custom firmware in C++ / MicroPython",
          "Wi-Fi, Bluetooth & MQTT connectivity",
          "Live dashboards for sensor data",
          "Mobile or web control panel",
          "Relay, motor and camera control",
          "3D-printable enclosure files",
          "Wiring diagram & parts list",
          "Setup guide and handover documentation",
        ]}
        description="IoT builds, Raspberry Pi and Arduino prototypes and automation rigs, delivered with source and docs."
        longDescription="This is the hands-on side of the studio: things with wires in them. A sensor rig that logs temperature and humidity to a dashboard you can open from your phone. A relay board that switches a pump when a tank runs low. An ESP32 reading a meter and pushing the number to MQTT. A camera module that photographs a production line and flags the odd one out. We design the circuit, write the firmware, build the dashboard or app that controls it, and hand over the wiring diagram, the parts list and the complete source so the project is yours to maintain. For students we work as a build partner and document how every part functions so you can explain and defend the work — we build the project with you, not the assessment for you."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Full source, schematics and parts list",
          "Documented so you can explain how it works",
          "Off-the-shelf parts you can replace locally",
          "A prototype path toward a real product",
          "Remote build with video walkthroughs",
        ]}
        process={[
          "Define what the device must sense or control",
          "Component selection and parts list",
          "Circuit design and breadboard prototype",
          "Firmware development and bench testing",
          "Dashboard or app for control and logging",
          "Documentation, handover and support",
        ]}
        technologies={[
          "Arduino / ESP32 / ESP8266",
          "Raspberry Pi & Linux",
          "C++ / MicroPython / Python",
          "MQTT & REST APIs",
          "Node.js dashboards",
          "Fusion 360 / 3D printing",
        ]}
        faqs={faqs}
      />
    </>
  );
}
