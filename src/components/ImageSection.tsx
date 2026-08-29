import Link from "next/link";
import Image from "next/image";

type ImageSectionProps = {
  src: string;
  alt: string;
  title: string;
};

export default function ImageSection({ src, alt, title }: ImageSectionProps) {
  return (
    <section className="relative w-full flex flex-col items-center bg-boza-cream-alt">
      <div className="relative w-full h-[130vh] flex justify-center items-center max-[968px]:h-[65vh] max-[640px]:h-[45vh]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <h1 className="w-full text-center pt-2.5 pb-6 max-[640px]:pb-8">
        <Link href="/catalogue" className="font-display text-base font-black tracking-wide uppercase text-boza-black no-underline hover:text-boza-brown max-[640px]:text-sm">
          {title}
        </Link>
      </h1>
    </section>
  );
}