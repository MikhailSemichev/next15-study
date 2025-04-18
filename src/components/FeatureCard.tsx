import { ReactNode } from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iconAlt: string;
  children?: ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon,
  iconAlt,
  children,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/[.08] p-6 transition-all hover:shadow-md bg-green-100 dark:bg-green-900 dark:border-white/[.15] dark:hover:bg-green-800">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/[.05] dark:bg-white/[.06]">
          <Image src={icon} alt={iconAlt} width={24} height={24} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {children}
    </div>
  );
}
