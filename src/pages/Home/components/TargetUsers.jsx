import { Building2, GraduationCap, School, Users } from "lucide-react";
import { TARGET_USERS } from "../data/landingContent";
import { SectionHeading } from "./ui";

const ICONS = { GraduationCap, School, Building2, Users };

export default function TargetUsers() {
  return (
    <section id="users" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <SectionHeading title="কার জন্য স্মার্ট প্রশ্নব্যাংক?" />
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TARGET_USERS.map((user) => {
            const Icon = ICONS[user.icon] || Users;
            return (
              <article
                key={user.title}
                className="rounded-2xl border border-border bg-glass-elevated p-5 shadow-soft hover:-translate-y-1 hover:border-purple-200 transition duration-300 font-bengali"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-purple-200/70 bg-purple-50 text-purple-700">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">{user.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
