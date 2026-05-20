"use client";

import { AvatarGroup, Heading, Text } from "@once-ui-system/core";
import { useState } from "react";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  tags?: string[];
  layout?: "grid" | "list";
  publishedAt?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority = false,
  images = [],
  title,
  content,
  description,
  avatars = [],
  link,
  tags = [],
  layout = "grid",
  publishedAt,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultiple = images.length > 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const goTo = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(idx);
  };

  const prev = (e: React.MouseEvent) => goTo((currentImage - 1 + images.length) % images.length, e);
  const next = (e: React.MouseEvent) => goTo((currentImage + 1) % images.length, e);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch { return dateStr; }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={styles.cardWrapper}
    >
      {/* ── Image Section with navigation ── */}
      <div className={styles.imageSection}>
        <div className={styles.imageTrack}>
          {images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${title} screenshot ${i + 1}`}
                className={styles.cardImage}
                style={{ transform: `translateX(${(i - currentImage) * 100}%)` }}
                loading={priority && i === 0 ? "eager" : "lazy"}
              />
            ))
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Previous image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Next image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className={styles.dotNav}>
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentImage ? styles.dotActive : ""}`}
                  onClick={(e) => goTo(i, e)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className={styles.imageCounter}>
              {currentImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* ── Content Section ── */}
      <div className={styles.cardContent}>
        {/* Header row: title + meta */}
        <div className={styles.cardHeader}>
          {title && (
            <Heading as="h2" wrap="balance" variant="heading-strong-l" className={styles.titleText}>
              {title}
            </Heading>
          )}
          {(publishedAt || avatars.length > 0) && (
            <div className={styles.metaInfo}>
              {publishedAt && <span className={styles.dateText}>{formatDate(publishedAt)}</span>}
              {publishedAt && avatars.length > 0 && <span className={styles.metaDot} />}
              {avatars.length > 0 && <AvatarGroup avatars={avatars} size="s" reverse />}
            </div>
          )}
        </div>

        {/* Description */}
        {description?.trim() && (
          <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak" className={styles.description}>
            {description}
          </Text>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className={styles.tagPills}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actionLinks}>
          {content?.trim() && (
            <a className={`${styles.actionLink} ${styles.primary}`} href={href}>
              Read case study
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {link && (
            <a className={styles.actionLink} href={link} target="_blank" rel="noopener noreferrer">
              View project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Spotlight overlay */}
      <div className={styles.spotlight} />
      {/* Shine border */}
      <div className={styles.shineBorder} />
    </div>
  );
};
