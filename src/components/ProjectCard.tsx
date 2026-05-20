"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  Text,
} from "@once-ui-system/core";
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
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`${styles.cardWrapper} ${layout === "grid" ? styles.grid : styles.list}`}
    >
      {/* Image Section */}
      <div className={styles.imageContainer}>
        {layout === "grid" ? (
          <img
            src={images[0] || "/images/placeholder.jpg"}
            alt={title}
            className={styles.cardImage}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <Carousel
            sizes="(max-width: 960px) 100vw, 960px"
            items={images.map((image) => ({
              slide: image,
              alt: title,
            }))}
          />
        )}
      </div>

      {/* Details Section */}
      <div className={styles.cardContent}>
        {/* Title */}
        {title && (
          <Heading as="h2" wrap="balance" variant={layout === "grid" ? "heading-strong-l" : "heading-strong-xl"} className={styles.titleText}>
            {title}
          </Heading>
        )}

        {/* Date and Team Avatars */}
        {(publishedAt || avatars.length > 0) && (
          <div className={styles.metaInfo}>
            {publishedAt && (
              <span className={styles.dateText}>
                {formatDate(publishedAt)}
              </span>
            )}
            {publishedAt && avatars.length > 0 && <span>•</span>}
            {avatars.length > 0 && (
              <AvatarGroup avatars={avatars} size="s" reverse />
            )}
          </div>
        )}

        {/* Description / Summary */}
        {description?.trim() && (
          <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className={styles.tagPills}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actionLinks}>
          {content?.trim() && (
            <a
              className={`${styles.actionLink} ${styles.primary}`}
              href={href}
            >
              Read case study
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          )}
          {link && (
            <a
              className={styles.actionLink}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
