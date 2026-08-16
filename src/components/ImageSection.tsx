type ImageSectionProps = {
  src: string;
  alt: string;
  title: string;
};

export default function ImageSection({ src, alt, title }: ImageSectionProps) {
  return (
    <section className="relative w-full flex flex-col items-center bg-boza-cream-alt">
      <div className="w-full h-[130vh] flex justify-center items-center max-[968px]:h-[85vh] max-[640px]:h-[55vh]">
        <img
          src={src}
          alt={alt}
          className="w-[60%] h-full object-cover max-[968px]:w-[80%] max-[640px]:w-[92%]"
        />
      </div>
      <h1 className="w-[60%] text-right pr-0 pt-2.5 pb-6 font-display text-base font-black tracking-wide uppercase text-boza-black max-[968px]:w-[80%] max-[640px]:w-[92%] max-[640px]:text-sm max-[640px]:pb-8">
        {title}
      </h1>
    </section>
  );
}