import type { Metadata } from "next";
import { FiCheckCircle, FiInfo } from "react-icons/fi";
import RolePage from "@/components/dashboard/RolePage";
import ServiceForm from "@/components/dashboard/preview/ServiceForm";
import {
  DashboardLink,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Add Service | FixMate" };

export default function AddServicePage() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <PageHeader
          title="Add Service"
          description="Describe your expertise and build a clear, helpful service listing."
          action={
            <DashboardLink href="/dashboard/technician/my-services">
              My Services
            </DashboardLink>
          }
        />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Panel
            title="Service information"
            description="Add the details customers need to understand your service."
          >
            <ServiceForm live />
          </Panel>
          <div className="space-y-6">
            <Panel title="A helpful listing">
              <ul className="space-y-4 text-sm leading-relaxed text-slate-500">
                {[
                  "Use a clear, specific service title.",
                  "Explain what the base price includes.",
                  "Add the areas where you can travel.",
                  "Choose a bright, relevant image.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <FiCheckCircle className="mt-1 shrink-0 text-teal-600" />
                    {tip}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Review process">
              <p className="flex gap-2 text-sm leading-relaxed text-slate-500">
                <FiInfo className="mt-1 shrink-0 text-orange-500" />
                New services are saved as pending. They appear publicly only
                after admin approval and while available.
              </p>
            </Panel>
          </div>
        </div>
      </PageContainer>
    </RolePage>
  );
}
