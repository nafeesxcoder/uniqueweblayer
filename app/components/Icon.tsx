import type { IconType } from "react-icons";
import {
  FaArrowRight,
  FaArrowTrendUp,
  FaArrowsRotate,
  FaBlog,
  FaBolt,
  FaBox,
  FaBoxArchive,
  FaBriefcase,
  FaBuilding,
  FaBullhorn,
  FaBullseye,
  FaCalendarCheck,
  FaCalendarWeek,
  FaCartShopping,
  FaChartLine,
  FaCheck,
  FaChevronDown,
  FaCircleCheck,
  FaCircleInfo,
  FaCircleQuestion,
  FaClock,
  FaCloud,
  FaCode,
  FaCodeBranch,
  FaCoins,
  FaComments,
  FaCreditCard,
  FaDiagramProject,
  FaEarthAmericas,
  FaEye,
  FaFileLines,
  FaFileSignature,
  FaFlag,
  FaFolderOpen,
  FaGaugeHigh,
  FaGears,
  FaGem,
  FaGlobe,
  FaGraduationCap,
  FaGrip,
  FaHeadset,
  FaHouse,
  FaImage,
  FaIndustry,
  FaKey,
  FaLaptopCode,
  FaLayerGroup,
  FaLinkSlash,
  FaListCheck,
  FaLocationDot,
  FaLockOpen,
  FaMagnifyingGlass,
  FaMagnifyingGlassChart,
  FaMagnifyingGlassLocation,
  FaMicrochip,
  FaMobileScreen,
  FaMobileScreenButton,
  FaPaperPlane,
  FaPen,
  FaPenRuler,
  FaPeopleGroup,
  FaPlus,
  FaReply,
  FaRobot,
  FaRulerCombined,
  FaScrewdriverWrench,
  FaServer,
  FaShieldHalved,
  FaStar,
  FaTrash,
  FaUniversalAccess,
  FaUpRightFromSquare,
  FaUserAstronaut,
  FaUsers,
  FaUtensils,
  FaWhatsapp,
  FaXmark,
  FaBugSlash,
  FaDatabase,
  FaNewspaper,
  FaReceipt,
  FaRocket,
  FaRotate,
  FaStethoscope,
  FaTruckFast,
  FaUserGear,
  FaUserTie,
  FaUsersGear,
} from "react-icons/fa6";
// Brand glyph — only the legacy module carries it.
import { FaReact } from "react-icons/fa";

/**
 * Icon registry — replaces the Font Awesome CDN.
 *
 * The site used to pull a ~70KB render-blocking stylesheet from
 * cdnjs.cloudflare.com on every single page, purely for icons, while already
 * bundling react-icons for other components. Two icon systems, one of them a
 * third-party request that blocks first paint and can go down independently
 * of the site.
 *
 * Icon names stay as the original "fa-*" strings, because they are stored as
 * DATA in app/data/services.ts and app/data/site.ts. Keeping the names means
 * those files never had to change, and adding a service still works the same
 * way — put "fa-whatever" in the data and add one line to the map below.
 */
const ICONS: Record<string, IconType> = {
  "fa-arrow-right": FaArrowRight,
  "fa-arrow-trend-up": FaArrowTrendUp,
  "fa-arrows-rotate": FaArrowsRotate,
  "fa-blog": FaBlog,
  "fa-bolt": FaBolt,
  "fa-box": FaBox,
  "fa-box-archive": FaBoxArchive,
  "fa-briefcase": FaBriefcase,
  "fa-building": FaBuilding,
  "fa-bullhorn": FaBullhorn,
  "fa-bullseye": FaBullseye,
  "fa-calendar-check": FaCalendarCheck,
  "fa-calendar-week": FaCalendarWeek,
  "fa-cart-shopping": FaCartShopping,
  "fa-chart-line": FaChartLine,
  "fa-check": FaCheck,
  "fa-check-circle": FaCircleCheck,
  "fa-chevron-down": FaChevronDown,
  "fa-circle-question": FaCircleQuestion,
  "fa-clock": FaClock,
  "fa-cloud": FaCloud,
  "fa-code": FaCode,
  "fa-code-branch": FaCodeBranch,
  "fa-coins": FaCoins,
  "fa-comments": FaComments,
  "fa-credit-card": FaCreditCard,
  "fa-diagram-project": FaDiagramProject,
  "fa-earth-americas": FaEarthAmericas,
  "fa-external-link-alt": FaUpRightFromSquare,
  "fa-eye": FaEye,
  "fa-file-lines": FaFileLines,
  "fa-file-signature": FaFileSignature,
  "fa-flag": FaFlag,
  "fa-folder-open": FaFolderOpen,
  "fa-gauge-high": FaGaugeHigh,
  "fa-gears": FaGears,
  "fa-gem": FaGem,
  "fa-globe": FaGlobe,
  "fa-graduation-cap": FaGraduationCap,
  "fa-grid-2": FaGrip,
  "fa-headset": FaHeadset,
  "fa-home": FaHouse,
  "fa-image": FaImage,
  "fa-industry": FaIndustry,
  "fa-info-circle": FaCircleInfo,
  "fa-key": FaKey,
  "fa-laptop-code": FaLaptopCode,
  "fa-layer-group": FaLayerGroup,
  "fa-link-slash": FaLinkSlash,
  "fa-list-check": FaListCheck,
  "fa-location-dot": FaLocationDot,
  "fa-lock-open": FaLockOpen,
  "fa-magnifying-glass": FaMagnifyingGlass,
  "fa-magnifying-glass-chart": FaMagnifyingGlassChart,
  "fa-magnifying-glass-location": FaMagnifyingGlassLocation,
  "fa-microchip": FaMicrochip,
  "fa-mobile-screen": FaMobileScreen,
  "fa-mobile-screen-button": FaMobileScreenButton,
  "fa-paper-plane": FaPaperPlane,
  "fa-pen": FaPen,
  "fa-pen-ruler": FaPenRuler,
  "fa-people-group": FaPeopleGroup,
  "fa-plus": FaPlus,
  "fa-reply": FaReply,
  "fa-robot": FaRobot,
  "fa-ruler-combined": FaRulerCombined,
  "fa-screwdriver-wrench": FaScrewdriverWrench,
  "fa-server": FaServer,
  "fa-shield-halved": FaShieldHalved,
  "fa-star": FaStar,
  "fa-trash": FaTrash,
  "fa-universal-access": FaUniversalAccess,
  "fa-user-astronaut": FaUserAstronaut,
  "fa-users": FaUsers,
  "fa-utensils": FaUtensils,
  "fa-bug-slash": FaBugSlash,
  "fa-database": FaDatabase,
  "fa-house": FaHouse,
  "fa-newspaper": FaNewspaper,
  "fa-react": FaReact,
  "fa-receipt": FaReceipt,
  "fa-rocket": FaRocket,
  "fa-rotate": FaRotate,
  "fa-stethoscope": FaStethoscope,
  "fa-truck-fast": FaTruckFast,
  "fa-user-gear": FaUserGear,
  "fa-user-tie": FaUserTie,
  "fa-users-gear": FaUsersGear,
  "fa-whatsapp": FaWhatsapp,
  "fa-xmark": FaXmark,
};

export default function Icon({
  name,
  className = "",
}: {
  /** The original Font Awesome name, e.g. "fa-building". */
  name: string;
  className?: string;
}) {
  // Tolerate a stray "fas "/"fab " prefix left in data.
  const key = name.replace(/^fa[srbl]?\s+/, "").trim();
  const Glyph = ICONS[key];

  // An unmapped name renders nothing rather than crashing the page. Add the
  // icon to ICONS above and it appears — no CDN, no stylesheet.
  if (!Glyph) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] No mapping for "${name}" — add it to components/Icon.tsx`);
    }
    return null;
  }

  return <Glyph className={className} aria-hidden="true" />;
}
