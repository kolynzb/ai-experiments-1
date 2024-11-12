import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const experiments = [
  {
    href: "/talent-search",
    title: "Talent Search",
    description: "Using AI to recommend talent that fit the search description and summarize profile descriptions"
  },
  {
    href: "/linkedin-gen",
    title: "Linkedin Post Generator",
    description: "Using AI to create better AI posts"
  },
]

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      
      <h1> AI Experiments</h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {experiments.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card>
                <CardHeader>
                  {item.title}
                </CardHeader>
                <CardContent>
                  {item.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
