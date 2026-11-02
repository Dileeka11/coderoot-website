import { ServicePage, serviceMetadata } from "@/components/services/ServicePage";
import { getService } from "@/lib/services";

const service = getService("custom-software-development");

export const metadata = serviceMetadata(service);

export default function Page() {
  return <ServicePage service={service} />;
}
