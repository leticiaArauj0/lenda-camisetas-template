import {Button} from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="h-150 bg-[url('/banner.webp')] bg-cover relative bg-center sm:bg-top">
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="h-140 container mx-auto px-4 py-24 md:py-32 flex items-center relative z-10 dark">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-foreground text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 font-heading">
                        Crie Seu Legado
                    </h1>
                    <p className="text-foreground opacity-85 text-xl md:text-2xl max-w-2xl mx-auto font-medium">
                        Não é apenas sobre vestir. É sobre expressar quem você é.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center pt-4">
                        <Button asChild size="lg" className="min-w-[300px] min-h-[48px] text-xl">
                            <Link href="/search">
                                Explorar Coleção
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    );
}
