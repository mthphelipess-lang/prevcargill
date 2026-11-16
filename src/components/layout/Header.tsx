import { BrandBanner } from "./BrandBanner";

export function Header() {
  return (
    <header className="relative h-[104px] w-full border-b-4 border-primary md:h-[132px] xl:h-[152px]">
      <BrandBanner />
    </header>
  );
}
