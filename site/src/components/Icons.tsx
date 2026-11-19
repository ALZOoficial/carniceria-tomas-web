/**
 * Iconos: Phosphor (una sola familia en todo el proyecto, peso "regular" salvo marcas).
 * Se re-exportan con los nombres que usa la web para no tocar cada componente.
 */
import {
  ArrowRight,
  ArrowUpRight,
  InstagramLogo,
  MapPin,
  Phone,
  Play,
  Star,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react/dist/ssr";

type P = { className?: string };

export const WhatsAppIcon = ({ className = "size-5" }: P) => <WhatsappLogo className={className} weight="fill" aria-hidden="true" />;
export const PhoneIcon = ({ className = "size-5" }: P) => <Phone className={className} aria-hidden="true" />;
export const PinIcon = ({ className = "size-5" }: P) => <MapPin className={className} aria-hidden="true" />;
export const InstagramIcon = ({ className = "size-5" }: P) => <InstagramLogo className={className} aria-hidden="true" />;
export const ArrowIcon = ({ className = "size-4" }: P) => <ArrowRight className={className} aria-hidden="true" />;
export const ExternalIcon = ({ className = "size-4" }: P) => <ArrowUpRight className={className} aria-hidden="true" />;
export const PlayIcon = ({ className = "size-6" }: P) => <Play className={className} weight="fill" aria-hidden="true" />;
export const CloseIcon = ({ className = "size-5" }: P) => <X className={className} aria-hidden="true" />;

export const Stars = ({ value, className = "size-4" }: { value: number; className?: string }) => (
  <span className="inline-flex gap-0.5" aria-label={`${value.toString().replace(".", ",")} de 5 estrellas`} role="img">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        weight={value - i >= 0.75 ? "fill" : value - i >= 0.25 ? "duotone" : "regular"}
        className={`${className} ${value - i >= 0.25 ? "text-led" : "text-white/25"}`}
        aria-hidden="true"
      />
    ))}
  </span>
);
