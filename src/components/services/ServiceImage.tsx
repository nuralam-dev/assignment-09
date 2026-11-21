"use client";

import Image from "next/image";
import { useState } from "react";

// Local repair photo used when a service has no image or its link is broken.
const FALLBACK_IMAGE = "/images/repair-hero.jpg";

type ServiceImageProps = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
};

// Service images come from MongoDB (ImgBB or technician links), so they are
// requested directly; the local photo takes over if a link is missing or broken.
export default function ServiceImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
}: ServiceImageProps) {
  const [failed, setFailed] = useState(false);

  const remote = typeof src === "string" && /^https?:\/\//.test(src.trim());
  const useFallback = !remote || failed;

  return (
    <Image
      src={useFallback ? FALLBACK_IMAGE : src!.trim()}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      unoptimized={!useFallback}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
